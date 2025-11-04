package course_project.course_project.controller;

import course_project.course_project.dto.UserWithCustomerInfoDTO;
import course_project.course_project.dto.CustomerInfoDTO;
import course_project.course_project.model.User;
import course_project.course_project.model.CustomerInfo;
import course_project.course_project.repository.UserRepository;
import course_project.course_project.repository.CustomerInfoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/user")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CustomerInfoRepository customerInfoRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // Получить профиль пользователя
    @GetMapping("/profile")
    public ResponseEntity<UserWithCustomerInfoDTO> getProfile() {
        User user = getCurrentUser();
        return ResponseEntity.ok(convertToProfileDTO(user));
    }

    // Обновить профиль (имя, email) и/или информацию о доставке
    @PatchMapping("/profile")
    public ResponseEntity<UserWithCustomerInfoDTO> updateProfile(@RequestBody UserWithCustomerInfoDTO profileDTO) {
        User user = getCurrentUser();

        if (profileDTO.getName() != null && !profileDTO.getName().isEmpty()) {
            user.setName(profileDTO.getName());
        }
        if (profileDTO.getEmail() != null && !profileDTO.getEmail().isEmpty()) {
            user.setEmail(profileDTO.getEmail());
        }

        User updatedUser = userRepository.save(user);

        // Обновляем информацию о доставке, если передана
        if ((profileDTO.getAddress() != null && !profileDTO.getAddress().isEmpty()) ||
                (profileDTO.getPhone() != null && !profileDTO.getPhone().isEmpty())) {

            CustomerInfo customerInfo = updatedUser.getCustomerInfo();
            if (customerInfo == null) {
                customerInfo = new CustomerInfo();
                customerInfo.setUser(updatedUser);
            }

            if (profileDTO.getAddress() != null && !profileDTO.getAddress().isEmpty()) {
                customerInfo.setAddress(profileDTO.getAddress());
            }
            if (profileDTO.getPhone() != null && !profileDTO.getPhone().isEmpty()) {
                customerInfo.setPhone(profileDTO.getPhone());
            }

            customerInfoRepository.save(customerInfo);
        }

        updatedUser = userRepository.findById(updatedUser.getId()).get();
        return ResponseEntity.ok(convertToProfileDTO(updatedUser));
    }

    // Изменить пароль
    @PatchMapping("/password")
    public ResponseEntity<String> changePassword(@RequestParam String oldPassword,
                                                 @RequestParam String newPassword) {
        User user = getCurrentUser();

        if (!passwordEncoder.matches(oldPassword, user.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Старый пароль неверный");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        return ResponseEntity.ok("Пароль успешно изменён");
    }

    // Получить информацию о доставке
    @GetMapping("/delivery-info")
    public ResponseEntity<CustomerInfoDTO> getDeliveryInfo() {
        User user = getCurrentUser();

        if (user.getCustomerInfo() == null) {
            return ResponseEntity.notFound().build();
        }

        CustomerInfo customerInfo = user.getCustomerInfo();
        return ResponseEntity.ok(new CustomerInfoDTO(
                customerInfo.getId(),
                customerInfo.getAddress(),
                customerInfo.getPhone(),
                user.getId()
        ));
    }

    // Создать или обновить информацию о доставке
    @PutMapping("/delivery-info")
    public ResponseEntity<CustomerInfoDTO> updateDeliveryInfo(@RequestBody CustomerInfoDTO infoDTO) {
        User user = getCurrentUser();

        CustomerInfo customerInfo = user.getCustomerInfo();
        if (customerInfo == null) {
            customerInfo = new CustomerInfo();
            customerInfo.setUser(user);
        }

        customerInfo.setAddress(infoDTO.getAddress());
        customerInfo.setPhone(infoDTO.getPhone());

        CustomerInfo savedInfo = customerInfoRepository.save(customerInfo);

        return ResponseEntity.ok(new CustomerInfoDTO(
                savedInfo.getId(),
                savedInfo.getAddress(),
                savedInfo.getPhone(),
                user.getId()
        ));
    }

    // Вспомогательные методы
    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        return userRepository.findByName(username)
                .orElseThrow(() -> new IllegalArgumentException("Пользователь не найден"));
    }

    private UserWithCustomerInfoDTO convertToProfileDTO(User user) {
        UserWithCustomerInfoDTO profileDTO = new UserWithCustomerInfoDTO();
        profileDTO.setId(user.getId());
        profileDTO.setName(user.getName());
        profileDTO.setEmail(user.getEmail());
        profileDTO.setRole(user.getRole());

        if (user.getCustomerInfo() != null) {
            profileDTO.setAddress(user.getCustomerInfo().getAddress());
            profileDTO.setPhone(user.getCustomerInfo().getPhone());
        }

        return profileDTO;
    }
}

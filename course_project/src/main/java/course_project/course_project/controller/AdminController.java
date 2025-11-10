package course_project.course_project.controller;

import course_project.course_project.dto.*;
import course_project.course_project.model.*;
import course_project.course_project.repository.DishRepository;
import course_project.course_project.repository.OrderRepository;
import course_project.course_project.repository.RestaurantRepository;
import course_project.course_project.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.math.BigDecimal;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    @Autowired
    private RestaurantRepository restaurantRepository;

    @Autowired
    private DishRepository dishRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private UserRepository userRepository;

    // Путь к папке где будут сохраняться загруженные файлы
    @Value("${file.upload-dir:uploads}")
    private String uploadDir;

    // ============ РЕСТОРАНЫ ============

    @PostMapping(value = "/restaurants", consumes = {"multipart/form-data"})
    public ResponseEntity<RestaurantDTO> createRestaurant(@RequestPart("restaurant") RestaurantDTO restaurantDTO,
                                                          @RequestPart(value = "image", required = false) MultipartFile imageFile) {
        Restaurant restaurant = new Restaurant();
        restaurant.setName(restaurantDTO.getName());
        restaurant.setAddress(restaurantDTO.getAddress());
        restaurant.setPhone(restaurantDTO.getPhone());
        restaurant.setDescription(restaurantDTO.getDescription());

        // Если загружено фото, сохраняем его и устанавливаем URL
        if (imageFile != null && !imageFile.isEmpty()) {
            String imageUrl = saveImage(imageFile);
            restaurant.setUrl(imageUrl);
        } else {
            restaurant.setUrl(restaurantDTO.getUrl());
        }

        Restaurant savedRestaurant = restaurantRepository.save(restaurant);
        return ResponseEntity.status(HttpStatus.CREATED).body(convertRestaurantToDTO(savedRestaurant));
    }

    @PutMapping(value = "/restaurants/{restaurantId}", consumes = {"multipart/form-data"})
    public ResponseEntity<RestaurantDTO> updateRestaurant(
            @PathVariable Long restaurantId,
            @RequestPart("restaurant") RestaurantDTO restaurantDTO,
            @RequestPart(value = "image", required = false) MultipartFile imageFile) {

        Restaurant restaurant = restaurantRepository.findById(restaurantId)
                .orElseThrow(() -> new IllegalArgumentException("Ресторан не найден"));

        restaurant.setName(restaurantDTO.getName());
        restaurant.setAddress(restaurantDTO.getAddress());
        restaurant.setPhone(restaurantDTO.getPhone());
        restaurant.setDescription(restaurantDTO.getDescription());

        // Если загружено новое фото
        if (imageFile != null && !imageFile.isEmpty()) {
            // Удаляем старый файл если есть
            if (restaurant.getUrl() != null && !restaurant.getUrl().isEmpty()) {
                deleteImage(restaurant.getUrl());
            }
            // Сохраняем новый файл
            String imageUrl = saveImage(imageFile);
            restaurant.setUrl(imageUrl);
        }

        Restaurant updatedRestaurant = restaurantRepository.save(restaurant);
        return ResponseEntity.ok(convertRestaurantToDTO(updatedRestaurant));
    }

    @DeleteMapping("/restaurants/{restaurantId}")
    public ResponseEntity<Void> deleteRestaurant(@PathVariable Long restaurantId) {
        Restaurant restaurant = restaurantRepository.findById(restaurantId)
                .orElseThrow(() -> new IllegalArgumentException("Ресторан не найден"));

        // Удаляем файл со диска
        if (restaurant.getUrl() != null && !restaurant.getUrl().isEmpty()) {
            deleteImage(restaurant.getUrl());
        }

        // Удаляем запись из БД
        restaurantRepository.deleteById(restaurantId);
        return ResponseEntity.noContent().build();
    }

    // ============ БЛЮДА ============

    @PostMapping(value = "/restaurants/{restaurantId}/dishes", consumes = {"multipart/form-data"})
    public ResponseEntity<DishDTO> createDish(
            @PathVariable Long restaurantId,
            @RequestPart("dish") DishDTO dishDTO,
            @RequestPart(value = "image", required = false) MultipartFile imageFile) {

        Restaurant restaurant = restaurantRepository.findById(restaurantId)
                .orElseThrow(() -> new IllegalArgumentException("Ресторан не найден"));

        Dish dish = new Dish();
        dish.setRestaurant(restaurant);
        dish.setName(dishDTO.getName());
        dish.setDescription(dishDTO.getDescription());
        dish.setPrice(dishDTO.getPrice());
        dish.setWeight(dishDTO.getWeight());

        // Если загружено фото, сохраняем его и устанавливаем URL
        if (imageFile != null && !imageFile.isEmpty()) {
            String imageUrl = saveImage(imageFile);
            dish.setUrl(imageUrl);
        } else {
            dish.setUrl(dishDTO.getUrl());
        }

        Dish savedDish = dishRepository.save(dish);
        return ResponseEntity.status(HttpStatus.CREATED).body(convertDishToDTO(savedDish));
    }

    @PutMapping(value = "/dishes/{dishId}", consumes = {"multipart/form-data"})
    public ResponseEntity<DishDTO> updateDish(
            @PathVariable Long dishId,
            @RequestPart("dish") DishDTO dishDTO,
            @RequestPart(value = "image", required = false) MultipartFile imageFile) {

        Dish dish = dishRepository.findById(dishId)
                .orElseThrow(() -> new IllegalArgumentException("Блюдо не найдено"));

        dish.setName(dishDTO.getName());
        dish.setDescription(dishDTO.getDescription());
        dish.setPrice(dishDTO.getPrice());
        dish.setWeight(dishDTO.getWeight());

        // Если загружено новое фото
        if (imageFile != null && !imageFile.isEmpty()) {
            // Удаляем старый файл если есть
            if (dish.getUrl() != null && !dish.getUrl().isEmpty()) {
                deleteImage(dish.getUrl());
            }
            // Сохраняем новый файл
            String imageUrl = saveImage(imageFile);
            dish.setUrl(imageUrl);
        }

        Dish updatedDish = dishRepository.save(dish);
        return ResponseEntity.ok(convertDishToDTO(updatedDish));
    }

    @DeleteMapping("/dishes/{dishId}")
    public ResponseEntity<Void> deleteDish(@PathVariable Long dishId) {
        Dish dish = dishRepository.findById(dishId)
                .orElseThrow(() -> new IllegalArgumentException("Ресторан не найден"));

        // Удаляем файл со диска
        if (dish.getUrl() != null && !dish.getUrl().isEmpty()) {
            deleteImage(dish.getUrl());
        }

        // Удаляем запись из БД
        dishRepository.deleteById(dishId);
        return ResponseEntity.noContent().build();
    }

    // ============ ЗАКАЗЫ ============

    @GetMapping("/orders")
    public ResponseEntity<List<OrderDTO>> getOrders(
            @RequestParam(required = false) OrderStatus status,
            @RequestParam(required = false) Long userId) {

        List<Order> orders;

        if (status != null && userId != null) {
            orders = orderRepository.findByUserIdAndStatus(userId, status);
        } else if (status != null) {
            orders = orderRepository.findByStatus(status);
        } else if (userId != null) {
            orders = orderRepository.findByUserId(userId);
        } else {
            orders = orderRepository.findAll();
        }

        List<OrderDTO> orderDTOs = new ArrayList<>();
        orders.forEach(order -> orderDTOs.add(convertOrderToDTO(order)));

        return ResponseEntity.ok(orderDTOs);
    }

    @PatchMapping("/orders/{orderId}/status")
    public ResponseEntity<OrderDTO> updateOrderStatus(@PathVariable Long orderId,
                                                      @RequestParam OrderStatus status) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Заказ не найден"));

        order.setStatus(status);
        Order updatedOrder = orderRepository.save(order);

        return ResponseEntity.ok(convertOrderToDTO(updatedOrder));
    }

    // ============ ПОЛЬЗОВАТЕЛИ ============

    @GetMapping("/users")
    public ResponseEntity<List<UserInfoDTO>> getUsers() {
        List<User> users = userRepository.findAll();
        List<UserInfoDTO> userInfoDTOs = new ArrayList<>();

        users.forEach(user -> userInfoDTOs.add(
                new UserInfoDTO(user.getId(), user.getName(), user.getEmail(), user.getRole())
        ));

        return ResponseEntity.ok(userInfoDTOs);
    }

    @DeleteMapping("/users/{userId}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long userId) {
        if (!userRepository.existsById(userId)) {
            return ResponseEntity.notFound().build();
        }
        userRepository.deleteById(userId);
        return ResponseEntity.noContent().build();
    }

    // ============ ВСПОМОГАТЕЛЬНЫЕ МЕТОДЫ ============

    /**
     * Сохраняет загруженный файл на диск и возвращает путь к нему
     *
     * @param file MultipartFile загруженный файл
     * @return String путь к сохранённому файлу (для использования в URL)
     */
    private String saveImage(MultipartFile file) {
        try {
            // Генерируем уникальное имя файла: UUID + оригинальное расширение
            String originalFilename = file.getOriginalFilename();
            String fileExtension = originalFilename.substring(originalFilename.lastIndexOf("."));
            String uniqueFilename = UUID.randomUUID() + fileExtension;

            // Создаём директорию если её нет
            Path uploadPath = Paths.get(uploadDir);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            // Полный путь к файлу
            Path filePath = uploadPath.resolve(uniqueFilename);

            // Сохраняем файл на диск
            Files.write(filePath, file.getBytes());

            // Возвращаем относительный путь для URL
            // Например: "/uploads/550e8400-e29b-41d4-a716-446655440000.jpg"
            return "/uploads/" + uniqueFilename;

        } catch (IOException e) {
            throw new RuntimeException("Ошибка при сохранении файла: " + e.getMessage());
        }
    }

    /**
     * Удаляет файл со диска
     * @param imageUrl путь к файлу (например: /uploads/550e8400-e29b-41d4-a716-446655440000.jpg)
     */
    private void deleteImage(String imageUrl) {
        try {
            // Преобразуем URL в путь
            // /uploads/550e8400... → uploads/550e8400...
            String filePath = imageUrl.startsWith("/") ? imageUrl.substring(1) : imageUrl;
            Path path = Paths.get(filePath);

            if (Files.exists(path)) {
                Files.delete(path);
            }
        } catch (IOException e) {
            // Логируем ошибку, но не кидаем исключение
            // Если удаление не сработало, всё равно продолжаем обновление
            System.err.println("Ошибка при удалении старого файла: " + e.getMessage());
        }
    }

    private RestaurantDTO convertRestaurantToDTO(Restaurant restaurant) {
        return new RestaurantDTO(
                restaurant.getId(),
                restaurant.getName(),
                restaurant.getAddress(),
                restaurant.getPhone(),
                restaurant.getDescription(),
                restaurant.getUrl()
        );
    }

    private DishDTO convertDishToDTO(Dish dish) {
        return new DishDTO(
                dish.getId(),
                dish.getName(),
                dish.getDescription(),
                dish.getUrl(),
                dish.getPrice(),
                dish.getWeight()
        );
    }

    private OrderDTO convertOrderToDTO(Order order) {
        var orderItemDTOs = order.getOrderItems().stream()
                .map(orderItem -> new course_project.course_project.dto.OrderItemDTO(
                        orderItem.getId(),
                        orderItem.getDish().getId(),
                        orderItem.getQuantity(),
                        orderItem.getPriceAtOrder(),
                        orderItem.getPriceAtOrder().multiply(new BigDecimal(orderItem.getQuantity()))
                ))
                .toList();

        return new OrderDTO(
                order.getId(),
                order.getUser().getId(),
                orderItemDTOs,
                order.getOrderTime(),
                order.getStatus(),
                order.getTotal()
        );
    }
}

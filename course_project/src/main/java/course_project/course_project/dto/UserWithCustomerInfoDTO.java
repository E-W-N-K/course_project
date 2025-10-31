package course_project.course_project.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserWithCustomerInfoDTO extends UserDTO {
    private String address;
    private String phone;
}
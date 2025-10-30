package course_project.course_project.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class RestaurantDTO {
    private Long id;
    private String name;
    private String address;
    private String phone;
    private String description;
    private String url;
}

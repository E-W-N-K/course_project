package course_project.course_project.dto.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CreateOrderRequestDTO {
    private Long userId;
    private List<OrderItemRequestDTO> items;
}

package course_project.course_project.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class OrderItemDTO {
    private Long id;
    private Long dishId;
    private int quantity;
    private BigDecimal priceAtOrder;
    private BigDecimal itemTotal;  // quantity * priceAtOrder
}
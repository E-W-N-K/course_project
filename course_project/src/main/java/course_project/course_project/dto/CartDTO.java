package course_project.course_project.dto;

import course_project.course_project.model.CartItem;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CartDTO {
    private Long cartId;
    private Long userId;
    private List<CartItem> cartItems;
    private BigDecimal total;
}

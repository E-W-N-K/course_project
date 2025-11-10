package course_project.course_project.repository;

import course_project.course_project.model.CartItem;
import course_project.course_project.model.Dish;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    CartItem findByCartIdAndDishId(Long cartId, Long dishId);
    void deleteAllByCartId(Long cartId);

    @Query("SELECT COALESCE(SUM(item.price * item.quantity), 0) FROM CartItem item WHERE item.cart.id = :cartId")
    BigDecimal calculateCartTotal(@Param("cartId") Long cartId);

}

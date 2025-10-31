package course_project.course_project.repository;

import course_project.course_project.model.CartItem;
import course_project.course_project.model.Dish;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    CartItem findByCartIdAndDishId(Long cartId, Long dishId);
    void deleteAllByCartId(Long cartId);
}

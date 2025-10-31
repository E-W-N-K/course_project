package course_project.course_project.repository;

import course_project.course_project.model.Order;
import course_project.course_project.model.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderRepository extends JpaRepository<Order, Long> {
    Order findByUserIdAndStatus(Long id, OrderStatus status);

    Order findByUserId(Long id);
}

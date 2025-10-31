package course_project.course_project.repository;

import course_project.course_project.model.Order;
import course_project.course_project.model.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUserIdAndStatus(Long id, OrderStatus status);

    List<Order> findByUserId(Long id);
}

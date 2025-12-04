package course_project.course_project.controller;

import course_project.course_project.dto.OrderDTO;
import course_project.course_project.model.Order;
import course_project.course_project.model.OrderStatus;
import course_project.course_project.model.User;
import course_project.course_project.repository.OrderRepository;
import course_project.course_project.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/orders")
public class OrderController {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private UserRepository userRepository;

    // Получить все заказы текущего пользователя
    @GetMapping
    public ResponseEntity<List<OrderDTO>> getUserOrders() {
        User user = getCurrentUser();
        List<Order> orders = orderRepository.findByUserId(user.getId());

        List<OrderDTO> orderDTOs = new ArrayList<>();
        orders.forEach(order -> orderDTOs.add(convertToDTO(order)));

        return ResponseEntity.ok(orderDTOs);
    }

    // Получить конкретный заказ пользователя
    @GetMapping("/{orderId}")
    public ResponseEntity<OrderDTO> getOrderById(@PathVariable Long orderId) {
        User user = getCurrentUser();
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Заказ не найден"));

        // Проверяем, что заказ принадлежит текущему пользователю
        if (!order.getUser().getId().equals(user.getId())) {
            return ResponseEntity.status(403).build(); // Forbidden
        }

        return ResponseEntity.ok(convertToDTO(order));
    }

    // Получить заказы с определённым статусом
    @GetMapping("/status/{status}")
    public ResponseEntity<List<OrderDTO>> getOrdersByStatus(@PathVariable OrderStatus status) {
        User user = getCurrentUser();
        List<Order> orders = orderRepository.findByUserIdAndStatus(user.getId(), status);

        List<OrderDTO> orderDTOs = new ArrayList<>();
        orders.forEach(order -> orderDTOs.add(convertToDTO(order)));

        return ResponseEntity.ok(orderDTOs);
    }

    // Отменить заказ (если он ещё в статусе PENDING)
    @PutMapping("/{orderId}/cancel")
    public ResponseEntity<OrderDTO> cancelOrder(@PathVariable Long orderId) {
        User user = getCurrentUser();
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Заказ не найден"));

        // Проверяем, что заказ принадлежит текущему пользователю
        if (!order.getUser().getId().equals(user.getId())) {
            return ResponseEntity.status(403).build();
        }

        // Можно отменить только заказ в статусе PENDING
        if (order.getStatus() != OrderStatus.PENDING) {
            return ResponseEntity.badRequest().build();
        }

        order.setStatus(OrderStatus.CANCELLED);
        orderRepository.save(order);

        return ResponseEntity.ok(convertToDTO(order));
    }

    // Получить историю заказов
    @GetMapping("/history")
    public ResponseEntity<List<OrderDTO>> getOrderHistory() {
        User user = getCurrentUser();
        List<Order> orders = orderRepository.findByUserId(user.getId());

        // Сортируем по времени заказа в обратном порядке (новые сверху)
        orders.sort((o1, o2) -> o2.getOrderTime().compareTo(o1.getOrderTime()));

        List<OrderDTO> orderDTOs = new ArrayList<>();
        orders.forEach(order -> orderDTOs.add(convertToDTO(order)));

        return ResponseEntity.ok(orderDTOs);
    }

    // Вспомогательный метод для получения текущего пользователя
    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        return userRepository.findByName(username)
                .orElseThrow(() -> new IllegalArgumentException("Пользователь не найден"));
    }

    // Конвертация Order в OrderDTO
    private OrderDTO convertToDTO(Order order) {
        var orderItemDTOs = order.getOrderItems().stream()
                .map(orderItem -> new course_project.course_project.dto.OrderItemDTO(
                        orderItem.getId(),
                        orderItem.getDish().getId(),
                        orderItem.getDish().getName(),
                        orderItem.getQuantity(),
                        orderItem.getPriceAtOrder(),
                        orderItem.getPriceAtOrder().multiply(new java.math.BigDecimal(orderItem.getQuantity()))
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

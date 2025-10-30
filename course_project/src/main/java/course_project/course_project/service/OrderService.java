package course_project.course_project.service;

import course_project.course_project.dto.request.OrderItemRequestDTO;
import course_project.course_project.model.Dish;
import course_project.course_project.model.Order;
import course_project.course_project.model.OrderItem;
import course_project.course_project.model.User;
import course_project.course_project.repository.DishRepository;
import course_project.course_project.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class OrderService {

    @Autowired
    private DishRepository dishRepository;  // Репозиторий для получения Dish из БД

    @Autowired
    private OrderRepository orderRepository;

    //создание заказа
    public Order createOrder(User user, List<OrderItemRequestDTO> itemRequests) {
        Order order = new Order();
        order.setUser(user);
        order.setOrderTime(LocalDateTime.now());

        List<OrderItem> orderItems = new ArrayList<>();
        for (OrderItemRequestDTO request : itemRequests) {
            OrderItem orderItem = new OrderItem();

            orderItem.setOrder(order);
            Dish dish = dishRepository.findById(request.getDishId())
                    .orElseThrow(() -> new RuntimeException("Dish not found"));
            orderItem.setDish(dish);
            orderItem.setQuantity(request.getQuantity());
            orderItem.setPriceAtOrder(dish.getPrice());

            orderItems.add(orderItem);
        }

        order.setOrderItems(orderItems);
        calculateTotal(order);
        return orderRepository.save(order);
    }

    //расчёт общей стоимости
    public void calculateTotal(Order order) {
        if(!(order.getOrderItems()).isEmpty()) {
            order.setTotal(
                    order.getOrderItems().stream()
                            .map(orderItem -> orderItem.getPriceAtOrder().multiply(new BigDecimal(orderItem.getQuantity())))
                            .reduce(BigDecimal.ZERO, BigDecimal::add)
            );
        }
    }

    // Получить цену конкретного товара в заказе
    public BigDecimal getItemTotal(OrderItem item) {
        return item.getPriceAtOrder().multiply(new BigDecimal(item.getQuantity()));
    }

    // Получить общую цену заказа
    public BigDecimal getOrderTotal(Order order) {
        return order.getOrderItems().stream()
                .map(this::getItemTotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }
}

package course_project.course_project.service;

import course_project.course_project.model.*;
import course_project.course_project.repository.CartItemRepository;
import course_project.course_project.repository.CartRepository;
import course_project.course_project.repository.OrderItemRepository;
import course_project.course_project.repository.OrderRepository;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class CartService {

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    OrderRepository orderRepository;

    @Autowired
    OrderItemRepository orderItemRepository;

    @Autowired
    private EntityManager entityManager;

    // Добавление блюда в корзину (или создание корзины)
    @Transactional
    public void addDishToCart(Dish dish, int quantity, User user) {
        // Получаем или создаём корзину пользователя
        Cart cart = cartRepository.findCartByUserId(user.getId());

        if (cart == null) {
            cart = new Cart();
            cart.setUser(user);
            cart = cartRepository.save(cart);
        }

        // Проверяем наличие блюда в корзине
        CartItem existingCartItem = cartItemRepository.findByCartIdAndDishId(cart.getId(), dish.getId());

        if (existingCartItem != null) {
            // Увеличиваем количество если блюдо уже есть
            existingCartItem.setQuantity(existingCartItem.getQuantity() + quantity);
            cartItemRepository.save(existingCartItem);
        } else {
            // Добавляем новый элемент если блюда нет
            CartItem newCartItem = new CartItem();
            newCartItem.setCart(cart);
            newCartItem.setDish(dish);
            newCartItem.setQuantity(quantity);
            newCartItem.setPrice(dish.getPrice());
            cartItemRepository.save(newCartItem);
        }

        calculateTotal(cart);
    }

    // Удаление блюда из корзины
    @Transactional
    public void removeCartItem(User user, Long cartItemId, int quantity) {
        CartItem cartItem = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new IllegalArgumentException("CartItem не найден"));

        Cart cart = cartItem.getCart();

        if (cartItem.getQuantity() <= quantity) {
            cartItemRepository.deleteById(cartItemId);
            cart.getCartItems().remove(cartItem);
        } else {
            cartItem.setQuantity(cartItem.getQuantity() - quantity);
            cartItemRepository.save(cartItem);
        }
        // Гарантируем, что изменения видны перед пересчётом
        entityManager.flush();
        // Пересчитываем с актуальными данными
        calculateTotal(cart);
    }


    // Получение всей корзины пользователя
    public Cart getCartByUser(User user) {
        Cart cart = cartRepository.findCartByUserId(user.getId());

        if (cart == null) {
            cart = new Cart();
            cart.setUser(user);
            cart.setTotal(BigDecimal.ZERO);
            cart = cartRepository.save(cart);
        } else {
            // Calculate total to ensure it's up to date
            calculateTotal(cart);
        }

        return cart;
    }

    // Очистка корзины
    @Transactional
    public void removeAllCartItemsByUser(User user) {
        Cart cart = cartRepository.findCartByUserId(user.getId());

        if (cart != null) {
            cartItemRepository.deleteAllByCartId(cart.getId());
            // После удаления, обновляем total
            cart.setTotal(BigDecimal.ZERO);
            cartRepository.save(cart);
        }
    }

    // Преобразование в заказ
    @Transactional
    public Order checkoutCart(User user) {
        // Получаем корзину пользователя
        Cart cart = cartRepository.findCartByUserId(user.getId());

        if (cart == null || cart.getCartItems().isEmpty()) {
            throw new IllegalArgumentException("Корзина пуста или не найдена");
        }

        Long cartId = cart.getId();
        BigDecimal orderTotal = cart.getTotal();

        // ШАГ 1: КОПИРУЕМ данные из CartItems (только ID и значения)
        List<OrderItemData> orderItemsData = new ArrayList<>();
        for (CartItem cartItem : cart.getCartItems()) {
            orderItemsData.add(new OrderItemData(
                    cartItem.getDish().getId(),
                    cartItem.getQuantity(),
                    cartItem.getPrice()
            ));
        }

        // ШАГ 2: Создаём новый Order
        Order order = new Order();
        order.setUser(user);
        order.setOrderTime(LocalDateTime.now());
        order.setStatus(OrderStatus.valueOf("PENDING"));
        order.setTotal(orderTotal);

        // ШАГ 3: Сохраняем Order
        order = orderRepository.save(order);

        // ШАГ 4: Флаш для синхронизации
        entityManager.flush();

        // ШАГ 5: Создаём OrderItems
        for (OrderItemData itemData : orderItemsData) {
            Dish dishReloaded = entityManager.find(Dish.class, itemData.dishId);

            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setDish(dishReloaded);
            orderItem.setQuantity(itemData.quantity);
            orderItem.setPriceAtOrder(itemData.price);

            orderItemRepository.save(orderItem);
        }

        // ШАГ 6: Флаш перед удалением
        entityManager.flush();

        // ШАГ 7: ОЧИЩАЕМ CART ПЕРЕД УДАЛЕНИЕМ CARTITEMS
        cart.getCartItems().clear();
        cart.setTotal(BigDecimal.ZERO);
        cartRepository.save(cart);

        // ШАГ 8: Флаш перед удалением CartItems
        entityManager.flush();

        // ШАГ 9: Теперь удаляем CartItems
        cartItemRepository.deleteAllByCartId(cartId);

        return order;
    }

    // Расчёт общей стоимости
    public void calculateTotal(Cart cart) {
        if (cart.getCartItems() != null && !cart.getCartItems().isEmpty()) {
            cart.setTotal(
                    cart.getCartItems().stream()
                            .map(cartItem -> cartItem.getPrice().multiply(new BigDecimal(cartItem.getQuantity())))
                            .reduce(BigDecimal.ZERO, BigDecimal::add)
            );
        } else {
            cart.setTotal(BigDecimal.ZERO);
        }
        cartRepository.save(cart);
    }

    // Вспомогательный класс для хранения данных OrderItem
    private static class OrderItemData {
        Long dishId;
        int quantity;
        BigDecimal price;

        OrderItemData(Long dishId, int quantity, BigDecimal price) {
            this.dishId = dishId;
            this.quantity = quantity;
            this.price = price;
        }
    }
}
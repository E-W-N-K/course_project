package course_project.course_project.service;

import course_project.course_project.model.*;
import course_project.course_project.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;

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

    //добавление блюда в корзину (или создание корзины)
    public void addDishToCart(Dish dish, int quantity, User user) {
        // 1. Получаем или создаём корзину пользователя
        Cart cart = cartRepository.findCartByUserId(user.getId());

        if (cart == null) {
            // Если корзины нет, создаём новую
            cart = new Cart();
            cart.setUser(user);
            cart = cartRepository.save(cart);
        }

        // 2. Проверяем, есть ли уже это блюдо в корзине
        CartItem existingCartItem = cartItemRepository.findByCartIdAndDishId(cart.getId(), dish.getId());

        if (existingCartItem != null) {
            // Если блюдо уже есть, увеличиваем количество
            existingCartItem.setQuantity(existingCartItem.getQuantity() + quantity);
            cartItemRepository.save(existingCartItem);
        } else {
            // Если блюда нет, добавляем новый элемент
            CartItem newCartItem = new CartItem();
            newCartItem.setCart(cart);
            newCartItem.setDish(dish);
            newCartItem.setQuantity(quantity);
            newCartItem.setPrice(dish.getPrice());
            cartItemRepository.save(newCartItem);
        }

        calculateTotal(cart);
    }

    //удаление блюда из корзины
    public void removeCartItem(Long cartItemId, int quantity) {
        CartItem cartItem = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new IllegalArgumentException("CartItem не найден"));

        // Если количество меньше или равно запрошенному, удаляем весь элемент
        if (cartItem.getQuantity() <= quantity) {
            cartItemRepository.deleteById(cartItemId);
        } else {
            // Иначе уменьшаем количество
            cartItem.setQuantity(cartItem.getQuantity() - quantity);
            cartItemRepository.save(cartItem);
        }

        calculateTotal(cartItem.getCart());
    }

    //получение всей корзины пользователя
    public Cart getCartByUser(User user) {
        Cart cart = cartRepository.findCartByUserId(user.getId());

        if (cart == null) {
            cart = new Cart();
            cart.setUser(user);
            cart = cartRepository.save(cart);
        }

        return cart;
    }

    //очистка корзины
    public void removeAllCartItemsByUser(User user) {
        Cart cart = cartRepository.findCartByUserId(user.getId());

        if (cart != null) {
            cartItemRepository.deleteAllByCartId(cart.getId());
        }
    }

    //преобразование в заказ
    public Order checkoutCart(User user) {
        // 1. Получаем корзину пользователя
        Cart cart = cartRepository.findCartByUserId(user.getId());

        if (cart == null || cart.getCartItems().isEmpty()) {
            throw new IllegalArgumentException("Корзина пуста или не найдена");
        }

        // 2. Создаём новый заказ
        Order order = new Order();
        order.setUser(user);
        order.setOrderTime(LocalDateTime.now());
        order.setStatus(OrderStatus.valueOf("PENDING")); // статус "в обработке"
        order.setTotal(cart.getTotal());

        // 3. Сохраняем заказ в БД
        order = orderRepository.save(order);

        // 4. Переносим элементы из корзины в заказ
        for (CartItem cartItem : cart.getCartItems()) {
            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setDish(cartItem.getDish());
            orderItem.setQuantity(cartItem.getQuantity());
            orderItem.setPriceAtOrder(cartItem.getPrice());

            orderItemRepository.save(orderItem);
        }

        // 5. Очищаем корзину
        cartItemRepository.deleteAllByCartId(cart.getId());

        return order;
    }

    //расчёт общей стоимости
    public void calculateTotal(Cart cart) {
        if(!(cart.getCartItems()).isEmpty()) {
            cart.setTotal(
                    cart.getCartItems().stream()
                            .map(orderItem -> orderItem.getPrice().multiply(new BigDecimal(orderItem.getQuantity())))
                            .reduce(BigDecimal.ZERO, BigDecimal::add)
            );
        }
    }
}

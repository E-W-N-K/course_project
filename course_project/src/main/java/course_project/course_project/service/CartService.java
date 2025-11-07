package course_project.course_project.service;

import course_project.course_project.model.*;
import course_project.course_project.repository.*;
import jakarta.transaction.Transactional;
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
    @Transactional
    public void addDishToCart(Dish dish, int quantity, User user) {
        //получаем или создаём корзину пользователя
        Cart cart = cartRepository.findCartByUserId(user.getId());

        if (cart == null) {
            cart = new Cart();
            cart.setUser(user);
            cart = cartRepository.save(cart);
        }

        //проверяем наличия блюда в корзине
        CartItem existingCartItem = cartItemRepository.findByCartIdAndDishId(cart.getId(), dish.getId());

        if (existingCartItem != null) {
            //увеличиваем количество если блюдо уже есть
            existingCartItem.setQuantity(existingCartItem.getQuantity() + quantity);
            cartItemRepository.save(existingCartItem);
        } else {
            //добавляем новый элемент если блюда нет
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
    @Transactional
    public void removeCartItem(Long cartItemId, int quantity) {
        CartItem cartItem = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new IllegalArgumentException("CartItem не найден"));

        //если количество меньше или равно запрошенному, удаляем весь элемент
        if (cartItem.getQuantity() <= quantity) {
            cartItemRepository.deleteById(cartItemId);
        } else {
            //уменьшаем количество
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
            cart.setTotal(BigDecimal.ZERO);
            cart = cartRepository.save(cart);
        } else {
            // Calculate total to ensure it's up to date
            calculateTotal(cart);
        }

        return cart;
    }

    //очистка корзины
    @Transactional
    public void removeAllCartItemsByUser(User user) {
        Cart cart = cartRepository.findCartByUserId(user.getId());

        if (cart != null) {
            cartItemRepository.deleteAllByCartId(cart.getId());
        }
    }

    //преобразование в заказ
    @Transactional
    public Order checkoutCart(User user) {
        //получаем корзину пользователя
        Cart cart = cartRepository.findCartByUserId(user.getId());

        if (cart == null || cart.getCartItems().isEmpty()) {
            throw new IllegalArgumentException("Корзина пуста или не найдена");
        }

        //создаём новый заказ
        Order order = new Order();
        order.setUser(user);
        order.setOrderTime(LocalDateTime.now());
        order.setStatus(OrderStatus.valueOf("PENDING")); // статус "в обработке"
        order.setTotal(cart.getTotal());

        //сохраняем заказ в БД
        order = orderRepository.save(order);

        //переносим элементы из корзины в заказ
        for (CartItem cartItem : cart.getCartItems()) {
            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setDish(cartItem.getDish());
            orderItem.setQuantity(cartItem.getQuantity());
            orderItem.setPriceAtOrder(cartItem.getPrice());

            orderItemRepository.save(orderItem);
        }

        //очищаем корзину
        cartItemRepository.deleteAllByCartId(cart.getId());

        return order;
    }

    //расчёт общей стоимости
    public void calculateTotal(Cart cart) {
        if(cart.getCartItems() != null && !(cart.getCartItems()).isEmpty()) {
            cart.setTotal(
                    cart.getCartItems().stream()
                            .map(orderItem -> orderItem.getPrice().multiply(new BigDecimal(orderItem.getQuantity())))
                            .reduce(BigDecimal.ZERO, BigDecimal::add)
            );
        } else {
            cart.setTotal(BigDecimal.ZERO);
        }
        cartRepository.save(cart);
    }
}

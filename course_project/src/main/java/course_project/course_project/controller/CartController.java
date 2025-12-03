package course_project.course_project.controller;

import course_project.course_project.dto.CartDTO;
import course_project.course_project.dto.CartItemDTO;
import course_project.course_project.dto.DishDTO;
import course_project.course_project.dto.OrderDTO;
import course_project.course_project.dto.OrderItemDTO;
import course_project.course_project.model.*;
import course_project.course_project.repository.CartItemRepository;
import course_project.course_project.repository.CartRepository;
import course_project.course_project.repository.DishRepository;
import course_project.course_project.repository.UserRepository;
import course_project.course_project.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/cart")
public class CartController {

    @Autowired
    private CartService cartService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DishRepository dishRepository;

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private CartRepository cartRepository;

    // Получить корзину текущего пользователя
    @GetMapping
    public ResponseEntity<CartDTO> getCart() {
        User user = getCurrentUser();
        Cart cart = cartService.getCartByUser(user);

        CartDTO cartDTO = convertToDTO(cart);
        return ResponseEntity.ok(cartDTO);
    }

    // Добавить блюдо в корзину
    @PostMapping("/add/{dishId}")
    public ResponseEntity<CartDTO> addDishToCart(@PathVariable Long dishId,
                                                 @RequestParam(defaultValue = "1") int quantity) {
        if (quantity <= 0) {
            return ResponseEntity.badRequest().build();
        }

        User user = getCurrentUser();
        Dish dish = dishRepository.findById(dishId)
                .orElseThrow(() -> new IllegalArgumentException("Блюдо не найдено"));

        cartService.addDishToCart(dish, quantity, user);
        Cart cart = cartService.getCartByUser(user);

        CartDTO cartDTO = convertToDTO(cart);
        return ResponseEntity.ok(cartDTO);
    }

    // Удалить блюдо из корзины
    @DeleteMapping("/remove/{cartItemId}")
    public ResponseEntity<CartDTO> removeFromCart(@PathVariable Long cartItemId,
                                                  @RequestParam(defaultValue = "1") int quantity) {
        if (quantity <= 0) {
            return ResponseEntity.badRequest().build();
        }

        User user = getCurrentUser();

        try {
            CartItem cartItem = cartItemRepository.findById(cartItemId)
                    .orElseThrow(() -> new IllegalArgumentException("CartItem не найден"));

            if (!cartItem.getCart().getUser().getId().equals(user.getId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }

            Long cartId = cartItem.getCart().getId();
            cartService.removeCartItem(user, cartItemId, quantity);

            Cart cart = cartRepository.findById(cartId)
                    .orElseThrow(() -> new IllegalArgumentException("Cart не найден"));

            CartDTO cartDTO = convertToDTO(cart);
            return ResponseEntity.ok(cartDTO);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Очистить всю корзину
    @DeleteMapping("/clear")
    public ResponseEntity<Void> clearCart() {
        User user = getCurrentUser();
        cartService.removeAllCartItemsByUser(user);
        return ResponseEntity.noContent().build();
    }

    // Оформить заказ (checkout)
    @PostMapping("/checkout")
    public ResponseEntity<OrderDTO> checkout() {
        User user = getCurrentUser();
        Order order = cartService.checkoutCart(user);
        OrderDTO orderDTO = convertOrderToDTO(order);
        return ResponseEntity.status(HttpStatus.CREATED).body(orderDTO);
    }

    // Вспомогательный метод для получения текущего пользователя
    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        return userRepository.findByName(username)
                .orElseThrow(() -> new IllegalArgumentException("Пользователь не найден"));
    }

    // Конвертация Cart в CartDTO
    private CartDTO convertToDTO(Cart cart) {
        CartDTO cartDTO = new CartDTO();
        cartDTO.setCartId(cart.getId());
        cartDTO.setUserId(cart.getUser().getId());
        cartDTO.setTotal(cart.getTotal());

        List<CartItemDTO> cartItemDTOs = new ArrayList<>();
        if (cart.getCartItems() != null) {
            cart.getCartItems().forEach(cartItem -> {
                Dish dish = cartItem.getDish();
                DishDTO dishDTO = new DishDTO(
                        dish.getId(),
                        dish.getName(),
                        dish.getDescription(),
                        dish.getUrl(),
                        dish.getPrice(),
                        dish.getWeight()
                );

                CartItemDTO itemDTO = new CartItemDTO(
                        cartItem.getId(),
                        cartItem.getDish().getId(),
                        dishDTO,
                        cartItem.getQuantity(),
                        cartItem.getPrice(),
                        cartItem.getPrice().multiply(new java.math.BigDecimal(cartItem.getQuantity()))
                );
                cartItemDTOs.add(itemDTO);
            });
        }

        cartDTO.setCartItems(cartItemDTOs);
        return cartDTO;
    }

    // Конвертация Order в OrderDTO
    private OrderDTO convertOrderToDTO(Order order) {
        List<OrderItemDTO> orderItemDTOs = new ArrayList<>();
        if (order.getOrderItems() != null) {
            order.getOrderItems().forEach(orderItem -> {
                OrderItemDTO itemDTO = new OrderItemDTO(
                        orderItem.getId(),
                        orderItem.getDish().getId(),
                        orderItem.getQuantity(),
                        orderItem.getPriceAtOrder(),
                        orderItem.getPriceAtOrder().multiply(new BigDecimal(orderItem.getQuantity()))
                );
                orderItemDTOs.add(itemDTO);
            });
        }

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

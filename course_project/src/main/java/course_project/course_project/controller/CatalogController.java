package course_project.course_project.controller;

import course_project.course_project.dto.DishDTO;
import course_project.course_project.dto.RestaurantDTO;
import course_project.course_project.model.Dish;
import course_project.course_project.model.Restaurant;
import course_project.course_project.repository.DishRepository;
import course_project.course_project.repository.RestaurantRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/restaurants")
public class CatalogController {

    @Autowired
    private RestaurantRepository restaurantRepository;

    @Autowired
    private DishRepository dishRepository;

    //все рестораны для главной страницы
    @GetMapping
    public ResponseEntity<List<RestaurantDTO>> getRestaurants() {
        List<Restaurant> restaurants = restaurantRepository.findAll();
        List<RestaurantDTO> restaurantDTOs = new ArrayList<>();
        restaurants.forEach(restaurant -> restaurantDTOs.add(
                        new RestaurantDTO(
                                restaurant.getId(),
                                restaurant.getName(),
                                restaurant.getAddress(),
                                restaurant.getPhone(),
                                restaurant.getDescription(),
                                restaurant.getUrl()
                        )
                )
        );
        return ResponseEntity.ok(restaurantDTOs);
    }

    //поиск ресторана по названию
    @GetMapping("/searchRestaurant")
    public ResponseEntity<List<RestaurantDTO>> getRestaurantsByName(@RequestParam String name) {
        List<Restaurant> restaurants = restaurantRepository.search(name);
        List<RestaurantDTO> restaurantDTOs = new ArrayList<>();
        restaurants.forEach(restaurant -> restaurantDTOs.add(
                        new RestaurantDTO(
                                restaurant.getId(),
                                restaurant.getName(),
                                restaurant.getAddress(),
                                restaurant.getPhone(),
                                restaurant.getDescription(),
                                restaurant.getUrl()
                        )
                )
        );
        return ResponseEntity.ok(restaurantDTOs);
    }

    //все блюда выбранного ресторана
    @GetMapping("/{restaurantId}/dishes")
    public ResponseEntity<List<DishDTO>> getDishes(@PathVariable Long restaurantId) {
        List<Dish> dishes = dishRepository.findByRestaurantId(restaurantId);
        List<DishDTO> dishDTOs = new ArrayList<>();
        dishes.forEach(dish -> dishDTOs.add(
                        new DishDTO(
                                dish.getId(),
                                dish.getName(),
                                dish.getUrl(),
                                dish.getPrice(),
                                dish.getWeight()
                        )
                )
        );
        return ResponseEntity.ok(dishDTOs);
    }

    //поиск блюда по названию в выбранном ресторане
    @GetMapping("/{restaurantId}/dishes/searchDish")
    public ResponseEntity<List<DishDTO>> getDishesByRestaurantIdAndDishName(@PathVariable Long restaurantId,
                                                                            @RequestParam String dishName) {
        List<Dish> dishes = dishRepository.searchInRestaurant(dishName, restaurantId);
        List<DishDTO> dishDTOs = new ArrayList<>();
        dishes.forEach(dish -> dishDTOs.add(
                        new DishDTO(
                                dish.getId(),
                                dish.getName(),
                                dish.getUrl(),
                                dish.getPrice(),
                                dish.getWeight()
                        )
                )
        );
        return ResponseEntity.ok(dishDTOs);
    }
    //поиск блюда на главной странице
    @GetMapping("/searchDish")
    public ResponseEntity<List<DishDTO>> getDishesByName(@RequestParam String dishName) {
        List<Dish> dishes = dishRepository.search(dishName);
        List<DishDTO> dishDTOs = new ArrayList<>();
        dishes.forEach(dish -> dishDTOs.add(
                        new DishDTO(
                                dish.getId(),
                                dish.getName(),
                                dish.getUrl(),
                                dish.getPrice(),
                                dish.getWeight(),
                                dish.getRestaurant().getId(),
                                dish.getRestaurant().getName()
                        )
                )
        );
        return ResponseEntity.ok(dishDTOs);
    }

    //открытое окно блюда
    @GetMapping("/{restaurantId}/dishes/{dishId}")
    public ResponseEntity<DishDTO> getDishById(@PathVariable Long restaurantId,
                                               @PathVariable Long dishId) {
        Dish dish = dishRepository.findByIdAndRestaurantId(dishId, restaurantId);
        DishDTO dishDTO = new DishDTO(
                dish.getId(),
                dish.getName(),
                dish.getDescription(),
                dish.getUrl(),
                dish.getPrice(),
                dish.getWeight()
        );
        return ResponseEntity.ok(dishDTO);
    }


}

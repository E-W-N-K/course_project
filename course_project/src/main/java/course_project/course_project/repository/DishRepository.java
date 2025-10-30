package course_project.course_project.repository;

import course_project.course_project.model.Dish;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface DishRepository extends JpaRepository<Dish, Long> {

    //поиск блюда на главной странице
    @Query( "SELECT d " +
            "FROM Dish d " +
            "WHERE d.name LIKE %?1%")
    List<Dish> search(String name);

    //поиск блюда по названию в выбранном ресторане
    @Query( "SELECT d " +
            "FROM Dish d " +
            "WHERE d.name LIKE %?1% AND d.restaurant = ?2")
    List<Dish> searchInRestaurant(String name, Long restaurantId);


    Dish findByIdAndRestaurantId(Long Id, Long restaurantId);

    List<Dish> findByRestaurantId(Long restaurantId);
}

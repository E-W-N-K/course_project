package course_project.course_project.repository;

import course_project.course_project.model.Restaurant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface RestaurantRepository extends JpaRepository<Restaurant, Long> {

    //поиск ресторана по названию
    @Query( "SELECT r " +
            "FROM Restaurant r " +
            "WHERE r.name ILIKE %?1%")
    List<Restaurant> search(String name);
}

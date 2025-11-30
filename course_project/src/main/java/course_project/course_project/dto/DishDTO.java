package course_project.course_project.dto;

import course_project.course_project.model.Dish;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DishDTO {
    private Long id;
    private String name;
    private String description;
    private String url;
    private BigDecimal price;
    private int weight;

    //конструктор для получения в выбранном ресторане
    public DishDTO(Long id, String name, String description, String url, BigDecimal price, int weight) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.url = url;
        this.price = price;
        this.weight = weight;
    }

    //конструктор для маленького окна
    public DishDTO(Long id, String name, String url, BigDecimal price, int weight) {
        this.id = id;
        this.name = name;
        this.url = url;
        this.price = price;
        this.weight = weight;
    }

    //для поиска по названию блюда
    private Long restaurantId;
    private String restaurantName;

    //конструктор для поиска на главной странице
    public DishDTO(Long id, String name,String url, BigDecimal price, int weight, Long restaurantId, String restaurantName) {
        this.id = id;
        this.name = name;
        this.url = url;
        this.price = price;
        this.weight = weight;
        this.restaurantId = restaurantId;
        this.restaurantName = restaurantName;
    }

}

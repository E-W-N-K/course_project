package course_project.course_project.repository;

import course_project.course_project.model.Cart;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;

public interface CartRepository extends JpaRepository<Cart, Long> {
    Cart findCartByUserId(Long id);

    @Modifying
    @Transactional
    @Query("UPDATE Cart c SET c.total = :total WHERE c.id = :cartId")
    void updateTotal(@Param("cartId") Long cartId, @Param("total") BigDecimal total);
}

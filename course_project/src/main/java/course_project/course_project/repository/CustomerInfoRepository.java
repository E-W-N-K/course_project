package course_project.course_project.repository;

import course_project.course_project.model.CustomerInfo;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CustomerInfoRepository extends JpaRepository<CustomerInfo, Long> {
    CustomerInfo findByUserId(Long userId);
}

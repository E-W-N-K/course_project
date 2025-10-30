package course_project.course_project.service;

import course_project.course_project.model.User;
import course_project.course_project.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collection;
import java.util.Collections;

@Service
public class CustomerUserDetailsService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

        //поиск в бд
        User user= userRepository.findByName(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found " + username));

        return new org.springframework.security.core.userdetails.User(
                user.getName(),
                user.getPassword(),
                user.isActive(),
                true,
                true,
                true, // срок действия не истёк, данные не прострочены, акк не заблокирован
                getAuthorities(user.getRole())
        );
    }

    //конвертация роли в GrantedAuthority
    private Collection<? extends GrantedAuthority> getAuthorities(String role) {
        return Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + role));
    }
}

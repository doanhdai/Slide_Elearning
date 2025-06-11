package com.example.slide_elearning.Entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Entity
@Table(name = "users")
public class user {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "full_name", nullable = false)
    private String fullName;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(name = "createdAt", nullable = false)
    private LocalDateTime createdAt;

    @JsonManagedReference
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<lecture> lectures;
}

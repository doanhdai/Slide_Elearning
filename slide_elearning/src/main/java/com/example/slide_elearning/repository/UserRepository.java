package com.example.slide_elearning.repository;

import com.example.slide_elearning.Entity.user;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<user, Integer> {
}
package com.example.slide_elearning.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ApiResponse<T> {
    private int status;
    private String message;
    private T data;
    private Object metadata;
    private Object errors;

    public static <T> ApiResponse<T> success(String message, T data) {
        return new ApiResponse<>(200, message, data, null, null);
    }

    public static <T> ApiResponse<T> error(int status, String message, Object errors) {
        return new ApiResponse<>(status, message, null, null, errors);
    }
}
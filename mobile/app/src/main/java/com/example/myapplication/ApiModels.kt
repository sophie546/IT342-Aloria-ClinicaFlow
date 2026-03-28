package com.example.myapplication

data class RegisterRequest(
    val firstname: String,
    val lastname: String,
    val email: String,
    val password: String
)

data class LoginRequest(
    val identifier: String,
    val password: String
)

data class UpdateProfileRequest(
    val firstname: String,
    val lastname: String
)

data class AuthResponse(
    val token: String,
    val type: String,
    val userId: Long,
    val firstname: String,
    val lastname: String,
    val email: String
)

data class UserResponse(
    val userId: Long,
    val firstname: String,
    val lastname: String,
    val email: String
)
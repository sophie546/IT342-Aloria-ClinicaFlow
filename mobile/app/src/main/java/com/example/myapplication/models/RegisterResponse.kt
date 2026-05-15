package com.example.myapplication.models

data class RegisterResponse(
    val success: Boolean,
    val message: String? = null,
    val token: String? = null,
    val user: User? = null
)

data class User(
    val id: Int,
    val email: String,
    val firstName: String? = null,
    val lastName: String? = null,
    val role: String? = null
)
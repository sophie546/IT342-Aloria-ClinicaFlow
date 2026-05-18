package com.example.myapplication.models

data class RegisterResponse(
    val success: Boolean,
    val message: String? = null,
    val token: String? = null,
    val user: User? = null
)
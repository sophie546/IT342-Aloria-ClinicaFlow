package com.example.myapplication.features.authentication.models

data class LoginResponse(
    val success: Boolean,
    val message: String? = null,
    val token: String? = null,
    val user: Map<String, Any>? = null
)
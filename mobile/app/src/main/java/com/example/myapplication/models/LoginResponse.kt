package com.example.myapplication.models

data class LoginResponse(
    val success: Boolean,
    val message: String?,
    val token: String?,
    val user: Map<String, Any>?
)
package com.example.myapplication.features.authentication.models

data class LoginRequest(
    val email: String,
    val password: String
)
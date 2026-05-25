package com.example.myapplication.features.authentication.models

import com.example.myapplication.features.profile.models.User

data class RegisterResponse(
    val success: Boolean,
    val message: String? = null,
    val token: String? = null,
    val user: User? = null
)
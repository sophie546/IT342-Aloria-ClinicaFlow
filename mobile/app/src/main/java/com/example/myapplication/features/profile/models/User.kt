package com.example.myapplication.features.profile.models

data class User(
    val id: Int,
    val email: String,
    val firstName: String? = null,
    val lastName: String? = null,
    val role: String? = null
)
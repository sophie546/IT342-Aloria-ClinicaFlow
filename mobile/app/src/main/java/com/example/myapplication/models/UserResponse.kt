package com.example.myapplication.models

data class UserResponse(
    val id: Long,
    val email: String,
    val role: String,
    val medicalStaff: Map<String, Any>?
)
package com.example.myapplication.features.profile.models

// ========== PROFILE MODELS ==========

// Response from GET /api/auth/user/{accountId}
data class UserProfileResponse(
    val accountID: Int,
    val firstName: String,
    val lastName: String,
    val email: String,
    val role: String,
    val age: Int? = null,
    val gender: String? = null,
    val phone: String? = null,
    val specialization: String? = null,
    val department: String? = null,
    val availability: String? = null,
    val photo: String? = null
)

// Request for PUT /api/auth/user/{accountId}
data class UpdateProfileRequest(
    val firstName: String,
    val lastName: String,
    val email: String,
    val role: String,
    val gender: String? = null,
    val age: Int? = null,
    val phone: String? = null,
    val specialization: String? = null,
    val department: String? = null,
    val availability: String? = null,
    val photo: String? = null
)

// Response from update profile
data class UpdateProfileResponse(
    val success: Boolean,
    val message: String? = null,
    val data: UserProfileResponse? = null
)

// Request for POST /api/auth/change-password
data class ChangePasswordRequest(
    val email: String,
    val currentPassword: String,
    val newPassword: String
)

// Response from change password
data class ChangePasswordResponse(
    val success: Boolean,
    val message: String? = null
)

// Response from delete account
data class DeleteAccountResponse(
    val success: Boolean,
    val message: String? = null
)
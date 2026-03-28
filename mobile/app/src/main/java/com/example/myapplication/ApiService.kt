package com.example.myapplication

import retrofit2.Call
import retrofit2.http.*

interface ApiService {

    @POST("api/auth/register")
    fun register(@Body request: RegisterRequest): Call<AuthResponse>

    @POST("api/auth/login")
    fun login(@Body request: LoginRequest): Call<AuthResponse>

    @POST("api/auth/logout")
    fun logout(@Header("Authorization") token: String): Call<Void>

    @GET("api/auth/profile")
    fun getProfile(@Header("Authorization") token: String): Call<UserResponse>

    @PUT("api/auth/profile")
    fun updateProfile(
        @Header("Authorization") token: String,
        @Body request: UpdateProfileRequest
    ): Call<AuthResponse>
}
package com.example.myapplication.network

import com.example.myapplication.models.LoginRequest
import com.example.myapplication.models.LoginResponse
import com.example.myapplication.models.RegisterRequest
import retrofit2.Call
import retrofit2.http.Body
import retrofit2.http.POST

interface ApiService {

    @POST("/api/auth/login")
    fun login(@Body request: LoginRequest): Call<LoginResponse>

    @POST("/api/auth/register")
    fun register(@Body request: RegisterRequest): Call<LoginResponse>  // Uses same response type
}
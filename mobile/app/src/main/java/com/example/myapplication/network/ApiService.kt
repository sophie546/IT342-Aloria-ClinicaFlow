package com.example.myapplication.network

import com.example.myapplication.models.*
import retrofit2.Call
import retrofit2.http.*

interface ApiService {

    @POST("/api/auth/login")
    fun login(@Body request: LoginRequest): Call<LoginResponse>

    @POST("/api/auth/register")
    fun register(@Body request: RegisterRequest): Call<RegisterResponse>  // ← CHANGE THIS to RegisterResponse

    // ========== PATIENT QUEUE ==========
    @GET("/api/patient/queue/all")
    fun getQueue(): Call<PatientQueueResponse>

    @PUT("/api/patient/{id}")
    fun updatePatient(
        @Path("id") id: String,
        @Body request: UpdatePatientStatusRequest
    ): Call<UpdatePatientResponse>

    @DELETE("/api/patient/{id}")
    fun deletePatient(@Path("id") id: String): Call<PatientQueueResponse>

    @DELETE("/api/patient/{id}/permanent")
    fun permanentDeletePatient(@Path("id") id: String): Call<UpdatePatientResponse>

    // ========== PROFILE / ACCOUNT SETTINGS ==========

    // Get user profile by account ID
    @GET("/api/auth/user/{accountId}")
    fun getUserProfile(@Path("accountId") accountId: Int): Call<UserProfileResponse>

    // Update user profile
    @PUT("/api/auth/user/{accountId}")
    fun updateProfile(
        @Path("accountId") accountId: Int,
        @Body request: UpdateProfileRequest
    ): Call<UpdateProfileResponse>

    // Change password
    @POST("/api/auth/change-password")
    fun changePassword(@Body request: ChangePasswordRequest): Call<ChangePasswordResponse>

    // Delete account
    @DELETE("/api/user/account")
    fun deleteAccount(): Call<DeleteAccountResponse>
    @POST("/api/auth/logout-all")
    fun logoutAllDevices(): Call<LogoutAllDevicesResponse>

    @POST("/api/patient/register-queue")
    fun registerToQueue(@Body request: PatientRegistrationRequest): Call<PatientEntity>

    @GET("/api/patient/queue/all")
    fun getAllPatients(): Call<PatientQueueResponse>


}
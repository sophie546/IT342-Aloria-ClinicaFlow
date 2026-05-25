package com.example.myapplication.shared.network

import com.example.myapplication.features.profile.models.ChangePasswordRequest
import com.example.myapplication.features.profile.models.ChangePasswordResponse
import com.example.myapplication.features.profile.models.DeleteAccountResponse
import com.example.myapplication.features.authentication.models.LoginRequest
import com.example.myapplication.features.authentication.models.LoginResponse
import com.example.myapplication.features.authentication.models.LogoutAllDevicesResponse
import com.example.myapplication.features.patient.models.PatientEntity
import com.example.myapplication.features.patient.models.PatientQueueResponse
import com.example.myapplication.features.patient.models.PatientRegistrationRequest
import com.example.myapplication.features.authentication.models.RegisterRequest
import com.example.myapplication.features.authentication.models.RegisterResponse
import com.example.myapplication.features.patient.models.UpdatePatientResponse
import com.example.myapplication.features.patient.models.UpdatePatientStatusRequest
import com.example.myapplication.features.profile.models.UpdateProfileRequest
import com.example.myapplication.features.profile.models.UpdateProfileResponse
import com.example.myapplication.features.profile.models.UserProfileResponse
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
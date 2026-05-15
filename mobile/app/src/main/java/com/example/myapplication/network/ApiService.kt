package com.example.myapplication.network

import com.example.myapplication.models.LoginRequest
import com.example.myapplication.models.LoginResponse
import com.example.myapplication.models.RegisterRequest
import com.example.myapplication.models.PatientQueueResponse
import com.example.myapplication.models.UpdatePatientResponse
import com.example.myapplication.models.UpdatePatientStatusRequest  // Add this import
import retrofit2.Call
import retrofit2.http.*

interface ApiService {

    @POST("/api/auth/login")
    fun login(@Body request: LoginRequest): Call<LoginResponse>

    @POST("/api/auth/register")
    fun register(@Body request: RegisterRequest): Call<LoginResponse>

    // GET active queue (waiting + consulting only)
    @GET("/api/patient/queue/all")
    fun getQueue(): Call<PatientQueueResponse>

    // UPDATE patient status
    @PUT("/api/patient/{id}")
    fun updatePatient(
        @Path("id") id: String,
        @Body request: UpdatePatientStatusRequest
    ): Call<UpdatePatientResponse>

    // REMOVE from queue (mark as completed)
    @DELETE("/api/patient/{id}")
    fun deletePatient(@Path("id") id: String): Call<PatientQueueResponse>

    @DELETE("/api/patient/{id}/permanent")
    fun permanentDeletePatient(@Path("id") id: String): Call<UpdatePatientResponse>
}
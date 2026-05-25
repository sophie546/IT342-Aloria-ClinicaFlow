package com.example.myapplication.features.patient.models

import com.google.gson.annotations.SerializedName

data class PatientQueueResponse(
    val success: Boolean,
    val data: List<PatientEntity>? = null,
    val message: String? = null,
    val queueLength: Int? = null,
    val estimatedWaitTime: String? = null,
    val currentQueue: List<PatientEntity>? = null
)

data class PatientEntity(
    @SerializedName("patientId")
    val patientId: String? = null,

    @SerializedName("fname")
    val fname: String? = null,

    @SerializedName("lname")
    val lname: String? = null,

    val age: Int? = null,
    val gender: String? = null,

    @SerializedName("contactNo")
    val contactNo: String? = null,

    val address: String? = null,
    val queueNumber: Int? = null,
    val queuePosition: Int? = null,
    val estimatedWaitTime: String? = null,
    val assignedDoctor: String? = null,
    val status: String? = "waiting",

    @SerializedName("arrivalTime")
    val arrivalTime: String? = null,

    @SerializedName("createdAt")
    val createdAt: String? = null,

    @SerializedName("updatedAt")
    val updatedAt: String? = null
)

// UPDATE THIS - Add name fields
data class UpdatePatientStatusRequest(
    val status: String? = null,
    val assignedDoctor: String? = null,
    val fname: String? = null,      // ADD THIS
    val lname: String? = null,      // ADD THIS
    val age: Int? = null            // ADD THIS
)

data class PatientQueueItem(
    val id: String,
    val queueNumber: Int,
    val patientName: String,
    val patientId: String,
    val age: Int,
    val status: String,
    val assignedDoctor: String,
    val arrivalTime: String
)

// For single patient update response (NOT array)
data class UpdatePatientResponse(
    val success: Boolean,
    val data: PatientEntity? = null,  // This is a SINGLE object, not list
    val message: String? = null
)
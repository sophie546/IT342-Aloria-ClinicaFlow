package com.example.myapplication.models

data class JoinQueueResponse(
    val success: Boolean,
    val message: String,
    val patient: PatientData?,
    val queueNumber: Int?
)

data class PatientData(
    val patientId: String,
    val fname: String,
    val lname: String,
    val age: Int,
    val gender: String,
    val queueNumber: Int,
    val status: String,
    val assignedDoctor: String,
    val arrivalTime: String
)
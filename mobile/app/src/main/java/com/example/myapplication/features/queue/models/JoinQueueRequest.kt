package com.example.myapplication.features.queue.models

data class JoinQueueRequest(
    val fname: String,
    val lname: String,
    val age: Int,
    val gender: String,
    val contactNo: String,
    val address: String
)
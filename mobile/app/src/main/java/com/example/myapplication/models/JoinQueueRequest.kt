package com.example.myapplication.models

data class JoinQueueRequest(
    val fname: String,
    val lname: String,
    val age: Int,
    val gender: String,
    val contactNo: String,
    val address: String
)
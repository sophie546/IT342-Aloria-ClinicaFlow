package com.example.myapplication.models

import com.google.gson.annotations.SerializedName

data class PatientRegistrationRequest(
    @SerializedName("firstName")
    val firstName: String,

    @SerializedName("lastName")
    val lastName: String,

    @SerializedName("age")
    val age: Int,

    @SerializedName("gender")
    val gender: String,

    @SerializedName("contactNumber")
    val contactNumber: String,

    @SerializedName("address")
    val address: String
)
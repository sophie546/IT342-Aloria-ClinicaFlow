package com.example.myapplication

import android.content.Context
import android.content.SharedPreferences

class TokenManager(context: Context) {
    private val prefs: SharedPreferences =
        context.getSharedPreferences("auth_prefs", Context.MODE_PRIVATE)

    fun saveToken(token: String) = prefs.edit().putString("jwt_token", token).apply()
    fun getToken(): String? = prefs.getString("jwt_token", null)
    fun clearToken() = prefs.edit().remove("jwt_token").apply()

    fun saveUser(userId: Long, firstname: String, lastname: String, email: String) {
        prefs.edit()
            .putLong("user_id", userId)
            .putString("firstname", firstname)
            .putString("lastname", lastname)
            .putString("email", email)
            .apply()
    }

    fun getFirstname(): String? = prefs.getString("firstname", null)
    fun getLastname(): String? = prefs.getString("lastname", null)
    fun getEmail(): String? = prefs.getString("email", null)
    fun getUserId(): Long = prefs.getLong("user_id", -1)
    fun saveAvatarUri(uri: String) = prefs.edit().putString("avatar_uri", uri).apply()
    fun getAvatarUri(): String? = prefs.getString("avatar_uri", null)

    fun clearAll() = prefs.edit().clear().apply()
}
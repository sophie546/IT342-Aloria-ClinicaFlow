package com.example.myapplication

import android.content.Context
import android.content.SharedPreferences

class TokenManager(context: Context) {
    private val prefs: SharedPreferences =
        context.getSharedPreferences("auth_prefs", Context.MODE_PRIVATE)

    // Token methods
    fun saveToken(token: String) = prefs.edit().putString("jwt_token", token).apply()
    fun getToken(): String? = prefs.getString("jwt_token", null)
    fun clearToken() = prefs.edit().remove("jwt_token").apply()
    fun hasToken(): Boolean = getToken() != null

    // User info methods
    fun saveUser(userId: Long, email: String, role: String, firstName: String? = null, lastName: String? = null) {
        prefs.edit()
            .putLong("user_id", userId)
            .putString("email", email)
            .putString("role", role)
            .putString("firstname", firstName)
            .putString("lastname", lastName)
            .putBoolean("is_logged_in", true)
            .apply()
    }

    // Getters
    fun getUserId(): Long = prefs.getLong("user_id", -1)
    fun getUserEmail(): String? = prefs.getString("email", null)  // ✅ ADD THIS
    fun getUserRole(): String? = prefs.getString("role", null)    // ✅ ADD THIS
    fun getFirstname(): String? = prefs.getString("firstname", null)
    fun getLastname(): String? = prefs.getString("lastname", null)
    fun isLoggedIn(): Boolean = prefs.getBoolean("is_logged_in", false) && hasToken()

    // Avatar/profile picture
    fun saveAvatarUri(uri: String) = prefs.edit().putString("avatar_uri", uri).apply()
    fun getAvatarUri(): String? = prefs.getString("avatar_uri", null)

    // Clear all data
    fun clearAll() = prefs.edit().clear().apply()
}
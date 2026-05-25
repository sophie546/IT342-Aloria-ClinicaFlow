package com.example.myapplication.shared.network

import android.content.Context
import android.content.SharedPreferences
import org.json.JSONObject

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

    // NEW: Save complete user data as JSON (for profile)
    fun saveUserJson(userJson: JSONObject) {
        prefs.edit()
            .putString("user_data", userJson.toString())
            .apply()
    }

    // NEW: Get user data as JSON
    fun getUserJson(): JSONObject? {
        val userString = prefs.getString("user_data", null)
        return if (userString != null) JSONObject(userString) else null
    }

    // NEW: Save user from LoginResponse with all fields
    fun saveUserFromResponse(
        accountID: Int,
        firstName: String,
        lastName: String,
        email: String,
        role: String,
        age: Int? = null,
        gender: String? = null,
        phone: String? = null,
        specialization: String? = null,
        department: String? = null,
        availability: String? = null,
        photo: String? = null
    ) {
        val userJson = JSONObject().apply {
            put("accountID", accountID)
            put("firstName", firstName)
            put("lastName", lastName)
            put("email", email)
            put("role", role)
            age?.let { put("age", it) }
            gender?.let { put("gender", it) }
            phone?.let { put("phone", it) }
            specialization?.let { put("specialization", it) }
            department?.let { put("department", it) }
            availability?.let { put("availability", it) }
            photo?.let { put("photo", it) }
        }
        saveUserJson(userJson)

        // Also save to individual fields for backward compatibility
        saveUser(accountID.toLong(), email, role, firstName, lastName)
    }

    // NEW: Update specific user fields
    fun updateUserField(key: String, value: String) {
        val userJson = getUserJson()
        if (userJson != null) {
            userJson.put(key, value)
            saveUserJson(userJson)
        }
    }

    // NEW: Get account ID (as Int)
    fun getAccountId(): Int {
        val userJson = getUserJson()
        return userJson?.optInt("accountID", -1) ?: getUserId().toInt()
    }

    // NEW: Get user full name
    fun getFullName(): String {
        val userJson = getUserJson()
        if (userJson != null) {
            val firstName = userJson.optString("firstName", "")
            val lastName = userJson.optString("lastName", "")
            if (firstName.isNotEmpty() && lastName.isNotEmpty()) {
                return "$firstName $lastName"
            } else if (firstName.isNotEmpty()) {
                return firstName
            }
        }
        val first = getFirstname() ?: ""
        val last = getLastname() ?: ""
        return if (first.isNotEmpty() && last.isNotEmpty()) "$first $last" else first
    }

    // NEW: Get user email
    fun getUserEmail(): String? {
        val userJson = getUserJson()
        return userJson?.optString("email", null) ?: prefs.getString("email", null)
    }

    // NEW: Get user role
    fun getUserRole(): String? {
        val userJson = getUserJson()
        return userJson?.optString("role", null) ?: prefs.getString("role", null)
    }

    // NEW: Get user first name
    fun getUserFirstName(): String {
        val userJson = getUserJson()
        return userJson?.optString("firstName", "") ?: prefs.getString("firstname", "") ?: ""
    }

    // NEW: Get user last name
    fun getUserLastName(): String {
        val userJson = getUserJson()
        return userJson?.optString("lastName", "") ?: prefs.getString("lastname", "") ?: ""
    }

    // NEW: Get user age
    fun getUserAge(): Int? {
        val userJson = getUserJson()
        return if (userJson?.has("age") == true) userJson.optInt("age") else null
    }

    // NEW: Get user gender
    fun getUserGender(): String? {
        val userJson = getUserJson()
        return userJson?.optString("gender", null)
    }

    // NEW: Get user phone
    fun getUserPhone(): String? {
        val userJson = getUserJson()
        return userJson?.optString("phone", null)
    }

    // NEW: Get user specialization
    fun getUserSpecialization(): String? {
        val userJson = getUserJson()
        return userJson?.optString("specialization", null)
    }

    // NEW: Get user department
    fun getUserDepartment(): String? {
        val userJson = getUserJson()
        return userJson?.optString("department", null)
    }

    // NEW: Get user availability
    fun getUserAvailability(): String? {
        val userJson = getUserJson()
        return userJson?.optString("availability", "Available")
    }

    // NEW: Get user photo URL
    fun getUserPhoto(): String? {
        val userJson = getUserJson()
        return userJson?.optString("photo", null)
    }

    // NEW: Get user full name (add this method)
    fun getUserFullName(): String {
        val firstName = getUserFirstName()
        val lastName = getUserLastName()
        return if (firstName.isNotEmpty() && lastName.isNotEmpty()) {
            "$firstName $lastName"
        } else if (firstName.isNotEmpty()) {
            firstName
        } else {
            "User"
        }
    }

    // Existing getters (keep for backward compatibility)
    fun getUserId(): Long = prefs.getLong("user_id", -1)
    fun getFirstname(): String? = prefs.getString("firstname", null)
    fun getLastname(): String? = prefs.getString("lastname", null)
    fun isLoggedIn(): Boolean = prefs.getBoolean("is_logged_in", false) && hasToken()

    // Avatar/profile picture
    fun saveAvatarUri(uri: String) = prefs.edit().putString("avatar_uri", uri).apply()
    fun getAvatarUri(): String? = prefs.getString("avatar_uri", null)

    // Clear all data
    fun clearAll() = prefs.edit().clear().apply()
}
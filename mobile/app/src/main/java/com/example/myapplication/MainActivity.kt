package com.example.myapplication

import android.content.Intent
import android.os.Bundle
import android.widget.Button
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.example.myapplication.activities.PatientQueueActivity
import com.example.myapplication.models.LoginRequest
import com.example.myapplication.models.LoginResponse
import com.example.myapplication.network.RetrofitClient
import com.google.android.material.textfield.TextInputEditText
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

class MainActivity : AppCompatActivity() {

    private lateinit var tokenManager: TokenManager

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        tokenManager = TokenManager(this)

        if (tokenManager.hasToken()) {
            startActivity(Intent(this, PatientQueueActivity::class.java))
            finish()
            return
        }

        val etEmail = findViewById<TextInputEditText>(R.id.etEmail)
        val etPassword = findViewById<TextInputEditText>(R.id.etPassword)

        findViewById<TextView>(R.id.tvRegister).setOnClickListener {
            startActivity(Intent(this, RegisterActivity::class.java))
        }

        findViewById<Button>(R.id.btnLogin).setOnClickListener {
            val email = etEmail.text.toString().trim()
            val password = etPassword.text.toString().trim()

            if (email.isEmpty() || password.isEmpty()) {
                Toast.makeText(this, "Please fill in all fields", Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            }

            performLogin(email, password)
        }
    }

    private fun performLogin(email: String, password: String) {
        val loginRequest = LoginRequest(email, password)

        RetrofitClient.instance.login(loginRequest).enqueue(object : Callback<LoginResponse> {
            override fun onResponse(call: Call<LoginResponse>, response: Response<LoginResponse>) {
                if (response.isSuccessful) {
                    val loginResponse = response.body()

                    if (loginResponse?.success == true) {
                        // Save token
                        loginResponse.token?.let { token ->
                            tokenManager.saveToken(token)
                        }

                        // Get user data from the "user" field
                        val user = loginResponse.user
                        if (user != null) {
                            val accountID = (user["accountID"] as? Number)?.toInt() ?: -1
                            val firstName = user["firstName"] as? String ?: ""
                            val lastName = user["lastName"] as? String ?: ""
                            val userEmail = user["email"] as? String ?: email
                            val userRole = user["role"] as? String ?: "STAFF"

                            tokenManager.saveUserFromResponse(
                                accountID = accountID,
                                firstName = firstName,
                                lastName = lastName,
                                email = userEmail,
                                role = userRole,
                                age = null,
                                gender = null,
                                phone = null,
                                specialization = null,
                                department = null,
                                availability = null,
                                photo = null
                            )
                        }

                        Toast.makeText(this@MainActivity, "Login Successful!", Toast.LENGTH_SHORT).show()
                        startActivity(Intent(this@MainActivity, PatientQueueActivity::class.java))
                        finish()
                    } else {
                        Toast.makeText(this@MainActivity, loginResponse?.message ?: "Login failed", Toast.LENGTH_SHORT).show()
                    }
                } else {
                    Toast.makeText(this@MainActivity, "Server Error: ${response.code()}", Toast.LENGTH_SHORT).show()
                }
            }

            override fun onFailure(call: Call<LoginResponse>, t: Throwable) {
                Toast.makeText(this@MainActivity, "Network Error: ${t.message}", Toast.LENGTH_SHORT).show()
            }
        })
    }
}
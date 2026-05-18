package com.example.myapplication

import android.content.Intent
import android.os.Bundle
import android.widget.ArrayAdapter
import android.widget.AutoCompleteTextView
import android.widget.Button
import android.widget.TextView
import android.widget.Toast
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat
import com.example.myapplication.models.RegisterRequest
import com.example.myapplication.models.RegisterResponse
import com.example.myapplication.network.RetrofitClient
import com.google.android.material.textfield.TextInputEditText
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

class RegisterActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContentView(R.layout.activity_register)

        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.main)) { v, insets ->
            val systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars())
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom)
            insets
        }

        val etFirstName = findViewById<TextInputEditText>(R.id.etFirstName)
        val etLastName = findViewById<TextInputEditText>(R.id.etLastName)
        val etEmail = findViewById<TextInputEditText>(R.id.etEmail)
        val etPassword = findViewById<TextInputEditText>(R.id.etPassword)
        val etConfirmPassword = findViewById<TextInputEditText>(R.id.etConfirmPassword)
        val etRole = findViewById<AutoCompleteTextView>(R.id.etRole)

        // Setup Role Spinner
        val roles = arrayOf("Doctor", "Nurse", "Staff Member")
        val adapter = ArrayAdapter(this, android.R.layout.simple_dropdown_item_1line, roles)
        etRole.setAdapter(adapter)
        etRole.setText(roles[0], false)

        findViewById<TextView>(R.id.tvLogin).setOnClickListener {
            startActivity(Intent(this, MainActivity::class.java))
            finish()
        }

        findViewById<Button>(R.id.btnSignUp).setOnClickListener {
            val firstName = etFirstName.text.toString().trim()
            val lastName = etLastName.text.toString().trim()
            val email = etEmail.text.toString().trim()
            val password = etPassword.text.toString().trim()
            val confirmPassword = etConfirmPassword.text.toString().trim()
            val role = etRole.text.toString().trim()

            if (firstName.isEmpty() || lastName.isEmpty() || email.isEmpty() || password.isEmpty()) {
                Toast.makeText(this, "Please fill in all fields", Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            }

            if (password != confirmPassword) {
                Toast.makeText(this, "Passwords do not match", Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            }

            if (password.length < 6) {
                Toast.makeText(this, "Password must be at least 6 characters", Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            }

            performRegistration(firstName, lastName, email, password, role)
        }
    }

    private fun performRegistration(firstName: String, lastName: String, email: String, password: String, role: String) {
        val mappedRole = when (role.lowercase()) {
            "doctor" -> "DOCTOR"
            "nurse" -> "NURSE"
            else -> "STAFF"
        }

        val registerRequest = RegisterRequest(
            firstName = firstName,
            lastName = lastName,
            email = email,
            password = password,
            role = mappedRole
        )

        RetrofitClient.instance.register(registerRequest).enqueue(object : Callback<RegisterResponse> {
            override fun onResponse(call: Call<RegisterResponse>, response: Response<RegisterResponse>) {
                if (response.isSuccessful) {
                    val registerResponse = response.body()
                    if (registerResponse?.success == true) {
                        Toast.makeText(this@RegisterActivity, "Registration Successful! Please login.", Toast.LENGTH_LONG).show()
                        startActivity(Intent(this@RegisterActivity, MainActivity::class.java))
                        finish()
                    } else {
                        Toast.makeText(this@RegisterActivity, registerResponse?.message ?: "Registration failed", Toast.LENGTH_LONG).show()
                    }
                } else {
                    Toast.makeText(this@RegisterActivity, "Server Error: ${response.code()}", Toast.LENGTH_SHORT).show()
                }
            }

            override fun onFailure(call: Call<RegisterResponse>, t: Throwable) {
                Toast.makeText(this@RegisterActivity, "Network Error: ${t.message}", Toast.LENGTH_SHORT).show()
            }
        })
    }
}
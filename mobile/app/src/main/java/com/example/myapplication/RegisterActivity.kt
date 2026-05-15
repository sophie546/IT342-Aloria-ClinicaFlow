package com.example.myapplication

import android.content.Intent
import android.os.Bundle
import android.widget.ArrayAdapter
import android.widget.AutoCompleteTextView
import android.widget.TextView
import android.widget.Toast
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AlertDialog
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat
import com.example.myapplication.activities.PatientQueueActivity
import com.example.myapplication.models.LoginResponse
import com.example.myapplication.models.RegisterRequest
import com.example.myapplication.network.RetrofitClient
import com.google.android.material.button.MaterialButton
import com.google.android.material.textfield.TextInputEditText
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

class RegisterActivity : AppCompatActivity() {

    private lateinit var tokenManager: TokenManager

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContentView(R.layout.activity_register)

        tokenManager = TokenManager(this)

        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.main)) { v, insets ->
            val systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars())
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom)
            insets
        }

        val etFirstName = findViewById<TextInputEditText>(R.id.etFirstName)
        val etLastName = findViewById<TextInputEditText>(R.id.etLastName)
        val etEmail = findViewById<TextInputEditText>(R.id.etEmail)
        val etRole = findViewById<AutoCompleteTextView>(R.id.etRole)
        val etPassword = findViewById<TextInputEditText>(R.id.etPassword)
        val etConfirmPassword = findViewById<TextInputEditText>(R.id.etConfirmPassword)

        // Populate role dropdown
        val roles = listOf("STAFF", "DOCTOR", "ADMIN")
        val roleAdapter = ArrayAdapter(this, android.R.layout.simple_dropdown_item_1line, roles)
        etRole.setAdapter(roleAdapter)

        findViewById<TextView>(R.id.tvLogin).setOnClickListener {
            startActivity(Intent(this, MainActivity::class.java))
            finish()
        }

        findViewById<MaterialButton>(R.id.btnSignUp).setOnClickListener {
            val firstName = etFirstName.text.toString().trim()
            val lastName = etLastName.text.toString().trim()
            val email = etEmail.text.toString().trim()
            val role = etRole.text.toString().trim().uppercase()
            val password = etPassword.text.toString().trim()
            val confirmPassword = etConfirmPassword.text.toString().trim()

            when {
                firstName.isEmpty() || lastName.isEmpty() || email.isEmpty()
                        || role.isEmpty() || password.isEmpty() || confirmPassword.isEmpty() -> {
                    Toast.makeText(this, "Please fill in all fields", Toast.LENGTH_SHORT).show()
                    return@setOnClickListener
                }
                password != confirmPassword -> {
                    Toast.makeText(this, "Passwords do not match", Toast.LENGTH_SHORT).show()
                    return@setOnClickListener
                }
                password.length < 8 -> {
                    Toast.makeText(this, "Password must be at least 8 characters", Toast.LENGTH_SHORT).show()
                    return@setOnClickListener
                }
            }

            performRegistration(firstName, lastName, email, password, role)
        }
    }

    private fun performRegistration(firstName: String, lastName: String, email: String, password: String, role: String) {
        val registerRequest = RegisterRequest(firstName, lastName, email, password, role)

        RetrofitClient.instance.register(registerRequest).enqueue(object : Callback<LoginResponse> {
            override fun onResponse(call: Call<LoginResponse>, response: Response<LoginResponse>) {
                if (response.isSuccessful) {
                    val registerResponse = response.body()
                    if (registerResponse?.success == true) {
                        // Save the token from registration response
                        registerResponse.token?.let { token ->
                            tokenManager.saveToken(token)
                        }

                        // Save user info
                        val userMap = registerResponse.user
                        if (userMap != null) {
                            val userEmail = userMap["email"] as? String ?: email
                            val userRole = userMap["role"] as? String ?: role
                            val userId = (userMap["id"] as? Number)?.toLong() ?: 0
                            val userFirstName = userMap["firstName"] as? String ?: firstName
                            val userLastName = userMap["lastName"] as? String ?: lastName

                            tokenManager.saveUser(userId, userEmail, userRole, userFirstName, userLastName)
                        }

                        val message = registerResponse.message ?: "Registration Successful!"

                        if (message.contains("verification email") || message.contains("verify")) {
                            // Show verification dialog but still log them in
                            showVerificationDialogAndNavigate(email, message)
                        } else {
                            // Navigate directly to Patient Queue
                            Toast.makeText(this@RegisterActivity, "Registration Successful!", Toast.LENGTH_LONG).show()
                            navigateToPatientQueue()
                        }
                    } else {
                        val errorMsg = registerResponse?.message ?: "Registration failed"
                        Toast.makeText(this@RegisterActivity, errorMsg, Toast.LENGTH_LONG).show()
                    }
                } else {
                    Toast.makeText(this@RegisterActivity, "Server Error: ${response.code()}", Toast.LENGTH_SHORT).show()
                }
            }

            override fun onFailure(call: Call<LoginResponse>, t: Throwable) {
                Toast.makeText(this@RegisterActivity, "Network Error: ${t.message}", Toast.LENGTH_SHORT).show()
            }
        })
    }

    private fun showVerificationDialogAndNavigate(email: String, message: String) {
        AlertDialog.Builder(this)
            .setTitle("Verify Your Email")
            .setMessage("$message\n\nWe've sent a verification link to:\n\n$email\n\nPlease check your email inbox (and spam folder) and click the verification link to activate your account.\n\nYou can still access the Patient Queue while waiting for verification.")
            .setPositiveButton("Go to Patient Queue") { _, _ ->
                navigateToPatientQueue()
            }
            .setNegativeButton("Later") { _, _ ->
                startActivity(Intent(this, MainActivity::class.java))
                finish()
            }
            .setCancelable(false)
            .show()
    }

    private fun navigateToPatientQueue() {
        val intent = Intent(this, PatientQueueActivity::class.java)
        intent.flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK
        startActivity(intent)
        finish()
    }
}
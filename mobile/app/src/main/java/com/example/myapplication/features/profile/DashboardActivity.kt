package com.example.myapplication.features.profile

import android.content.Intent
import android.os.Bundle
import android.widget.Button
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.example.myapplication.R
import com.example.myapplication.shared.network.TokenManager
import com.example.myapplication.features.authentication.MainActivity

class DashboardActivity : AppCompatActivity() {

    private lateinit var tokenManager: TokenManager

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_dashboard)

        tokenManager = TokenManager(this)

        val tvWelcome = findViewById<TextView>(R.id.tvWelcome)
        val tvRole = findViewById<TextView>(R.id.tvRole)
        val btnLogout = findViewById<Button>(R.id.btnLogout)

        // These methods now exist in TokenManager
        val email = tokenManager.getUserEmail() ?: "User"
        val role = tokenManager.getUserRole() ?: "STAFF"
        val firstName = tokenManager.getFirstname()

        tvWelcome.text = if (firstName != null) "Welcome, $firstName!" else "Welcome, $email!"
        tvRole.text = "Role: $role"

        btnLogout.setOnClickListener {
            tokenManager.clearAll()
            startActivity(Intent(this, MainActivity::class.java))
            finish()
            Toast.makeText(this, "Logged out", Toast.LENGTH_SHORT).show()
        }
    }
}
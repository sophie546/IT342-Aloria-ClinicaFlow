package com.example.myapplication

import android.Manifest
import android.content.pm.PackageManager
import android.net.Uri
import android.os.Build
import android.os.Bundle
import android.view.View
import android.widget.Button
import android.widget.ImageView
import android.widget.TextView
import android.widget.Toast
import androidx.activity.enableEdgeToEdge
import androidx.activity.result.contract.ActivityResultContracts
import androidx.appcompat.app.AppCompatActivity
import androidx.core.content.ContextCompat
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat
import com.google.android.material.imageview.ShapeableImageView
import com.google.android.material.textfield.TextInputEditText
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

class EditProfileActivity : AppCompatActivity() {
    private lateinit var tokenManager: TokenManager

    private val pickImageLauncher = registerForActivityResult(
        ActivityResultContracts.GetContent()
    ) { uri: Uri? ->
        uri?.let {
            tokenManager.saveAvatarUri(it.toString())
            showAvatar(it.toString())
        }
    }

    private val requestPermissionLauncher = registerForActivityResult(
        ActivityResultContracts.RequestPermission()
    ) { isGranted ->
        if (isGranted) pickImageLauncher.launch("image/*")
        else Toast.makeText(this, "Permission needed to select image", Toast.LENGTH_SHORT).show()
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContentView(R.layout.activity_edit_profile)
        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.main)) { v, insets ->
            val systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars())
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom)
            insets
        }

        tokenManager = TokenManager(this)

        val etFirstName = findViewById<TextInputEditText>(R.id.etFirstName)
        val etLastName = findViewById<TextInputEditText>(R.id.etLastName)
        val etEmail = findViewById<TextInputEditText>(R.id.etEmail)

        etFirstName.setText(tokenManager.getFirstname())
        etLastName.setText(tokenManager.getLastname())
        etEmail.setText(tokenManager.getEmail())
        etEmail.isEnabled = false

        // Load avatar
        val savedUri = tokenManager.getAvatarUri()
        if (savedUri != null) {
            showAvatar(savedUri)
        } else {
            val letter = tokenManager.getFirstname()?.firstOrNull()?.uppercaseChar()?.toString() ?: "?"
            findViewById<TextView>(R.id.tvAvatarLetter).text = letter
        }

        // Camera icon click
        findViewById<ImageView>(R.id.ivEditPhoto).setOnClickListener {
            checkPermissionAndPickImage()
        }

        findViewById<Button>(R.id.btnSave).setOnClickListener {
            val firstname = etFirstName.text.toString().trim()
            val lastname = etLastName.text.toString().trim()

            if (firstname.isEmpty()) {
                Toast.makeText(this, "First name is required", Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            }

            val token = "Bearer ${tokenManager.getToken()}"
            val request = UpdateProfileRequest(firstname = firstname, lastname = lastname)

            RetrofitClient.instance.updateProfile(token, request).enqueue(object : Callback<AuthResponse> {
                override fun onResponse(call: Call<AuthResponse>, response: Response<AuthResponse>) {
                    if (response.isSuccessful) {
                        val body = response.body()!!
                        tokenManager.saveUser(body.userId, body.firstname, body.lastname, body.email)
                        Toast.makeText(this@EditProfileActivity, "Profile updated!", Toast.LENGTH_SHORT).show()
                        finish()
                    } else {
                        Toast.makeText(this@EditProfileActivity, "Update failed", Toast.LENGTH_SHORT).show()
                    }
                }

                override fun onFailure(call: Call<AuthResponse>, t: Throwable) {
                    Toast.makeText(this@EditProfileActivity, "Connection error: ${t.message}", Toast.LENGTH_SHORT).show()
                }
            })
        }

        findViewById<Button>(R.id.btnCancel).setOnClickListener {
            finish()
        }
    }

    private fun checkPermissionAndPickImage() {
        val permission = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU)
            Manifest.permission.READ_MEDIA_IMAGES
        else
            Manifest.permission.READ_EXTERNAL_STORAGE

        if (ContextCompat.checkSelfPermission(this, permission) == PackageManager.PERMISSION_GRANTED)
            pickImageLauncher.launch("image/*")
        else
            requestPermissionLauncher.launch(permission)
    }

    private fun showAvatar(uriString: String) {
        val ivAvatar = findViewById<ShapeableImageView>(R.id.ivAvatar)
        val tvLetter = findViewById<TextView>(R.id.tvAvatarLetter)
        ivAvatar.setImageURI(Uri.parse(uriString))
        ivAvatar.visibility = View.VISIBLE
        tvLetter.visibility = View.GONE
    }
}
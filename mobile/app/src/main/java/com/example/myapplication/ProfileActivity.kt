package com.example.myapplication

import android.Manifest
import android.content.Intent
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
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

class ProfileActivity : AppCompatActivity() {
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
        setContentView(R.layout.activity_profile)
        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.main)) { v, insets ->
            val systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars())
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom)
            insets
        }

        tokenManager = TokenManager(this)
        loadProfile()

        findViewById<ImageView>(R.id.ivEditPhoto).setOnClickListener {
            checkPermissionAndPickImage()
        }

        findViewById<Button>(R.id.btnEditProfile).setOnClickListener {
            startActivity(Intent(this, EditProfileActivity::class.java))
        }

        findViewById<Button>(R.id.btnLogout).setOnClickListener {
            val token = "Bearer ${tokenManager.getToken()}"
            RetrofitClient.instance.logout(token).enqueue(object : Callback<Void> {
                override fun onResponse(call: Call<Void>, response: Response<Void>) {}
                override fun onFailure(call: Call<Void>, t: Throwable) {}
            })
            tokenManager.clearAll()
            val intent = Intent(this, MainActivity::class.java)
            intent.flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK
            startActivity(intent)
        }
    }

    override fun onResume() {
        super.onResume()
        loadProfile()
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

    private fun loadProfile() {
        // Load saved avatar first
        tokenManager.getAvatarUri()?.let { showAvatar(it) }

        val token = "Bearer ${tokenManager.getToken()}"
        RetrofitClient.instance.getProfile(token).enqueue(object : Callback<UserResponse> {
            override fun onResponse(call: Call<UserResponse>, response: Response<UserResponse>) {
                if (response.isSuccessful) {
                    val user = response.body()!!
                    tokenManager.saveUser(user.userId, user.firstname, user.lastname, user.email)
                    findViewById<TextView>(R.id.tvUsername).text = "${user.firstname} ${user.lastname}"
                    findViewById<TextView>(R.id.tvEmail).text = user.email

                    // Only show letter if no saved image
                    if (tokenManager.getAvatarUri() == null) {
                        val letter = user.firstname.firstOrNull()?.uppercaseChar()?.toString() ?: "?"
                        findViewById<TextView>(R.id.tvAvatarLetter).text = letter
                    }
                } else {
                    tokenManager.clearAll()
                    startActivity(Intent(this@ProfileActivity, MainActivity::class.java))
                    finish()
                }
            }

            override fun onFailure(call: Call<UserResponse>, t: Throwable) {
                Toast.makeText(this@ProfileActivity, "Connection error: ${t.message}", Toast.LENGTH_SHORT).show()
            }
        })
    }
}
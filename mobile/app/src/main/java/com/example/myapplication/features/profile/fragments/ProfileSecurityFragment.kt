package com.example.myapplication.features.profile.fragments

import android.app.AlertDialog
import android.content.Intent
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Toast
import androidx.fragment.app.Fragment
import com.example.myapplication.features.authentication.MainActivity
import com.example.myapplication.R
import com.example.myapplication.features.profile.ProfileActivity
import com.example.myapplication.features.profile.models.ChangePasswordRequest
import com.example.myapplication.features.profile.models.ChangePasswordResponse
import com.example.myapplication.features.authentication.models.LogoutAllDevicesResponse
import com.google.android.material.button.MaterialButton
import com.google.android.material.textfield.TextInputEditText
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

class ProfileSecurityFragment : Fragment() {

    private lateinit var etCurrentPassword: TextInputEditText
    private lateinit var etNewPassword: TextInputEditText
    private lateinit var etConfirmPassword: TextInputEditText
    private lateinit var btnChangePassword: MaterialButton
    private lateinit var btnLogoutAllDevices: MaterialButton

    private val profileActivity get() = requireActivity() as ProfileActivity

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View = inflater.inflate(R.layout.fragment_profile_security, container, false)

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        initViews(view)
        setupClickListeners()
    }

    private fun initViews(view: View) {
        etCurrentPassword = view.findViewById(R.id.etCurrentPassword)
        etNewPassword = view.findViewById(R.id.etNewPassword)
        etConfirmPassword = view.findViewById(R.id.etConfirmPassword)
        btnChangePassword = view.findViewById(R.id.btnChangePassword)
        btnLogoutAllDevices = view.findViewById(R.id.btnLogoutAllDevices)
    }

    private fun setupClickListeners() {
        btnChangePassword.setOnClickListener { changePassword() }
        btnLogoutAllDevices.setOnClickListener { showLogoutAllDevicesDialog() }
    }

    private fun changePassword() {
        val currentPassword = etCurrentPassword.text.toString()
        val newPassword = etNewPassword.text.toString()
        val confirmPassword = etConfirmPassword.text.toString()
        val email = profileActivity.tokenManager.getUserEmail() ?: ""

        // Validation
        if (currentPassword.isEmpty()) {
            etCurrentPassword.error = "Current password is required"
            return
        }
        if (newPassword.isEmpty()) {
            etNewPassword.error = "New password is required"
            return
        }
        if (newPassword.length < 6) {
            etNewPassword.error = "Password must be at least 6 characters"
            return
        }
        if (newPassword != confirmPassword) {
            etConfirmPassword.error = "Passwords do not match"
            return
        }

        // Show loading indicator
        btnChangePassword.isEnabled = false
        btnChangePassword.text = "Changing..."

        val request = ChangePasswordRequest(email, currentPassword, newPassword)

        profileActivity.apiService.changePassword(request)
            .enqueue(object : Callback<ChangePasswordResponse> {
                override fun onResponse(
                    call: Call<ChangePasswordResponse>,
                    response: Response<ChangePasswordResponse>
                ) {
                    btnChangePassword.isEnabled = true
                    btnChangePassword.text = "Change Password"

                    if (!isAdded) return

                    if (response.isSuccessful) {
                        val result = response.body()
                        if (result?.success == true) {
                            Toast.makeText(requireContext(), "Password changed successfully!", Toast.LENGTH_LONG).show()

                            // Clear password fields only
                            etCurrentPassword.text?.clear()
                            etNewPassword.text?.clear()
                            etConfirmPassword.text?.clear()

                            // Just show success message - NO LOGOUT
                            AlertDialog.Builder(requireContext())
                                .setTitle("Success")
                                .setMessage("Your password has been changed successfully. You can continue using the app with your new password.")
                                .setPositiveButton("OK", null)
                                .show()
                        } else {
                            Toast.makeText(requireContext(), result?.message ?: "Password change failed", Toast.LENGTH_SHORT).show()
                        }
                    } else {
                        // Handle error based on status code
                        val errorMsg = when (response.code()) {
                            400 -> "Current password is incorrect"
                            401 -> "Session expired. Please login again"
                            else -> "Password change failed: ${response.code()}"
                        }
                        Toast.makeText(requireContext(), errorMsg, Toast.LENGTH_SHORT).show()
                    }
                }

                override fun onFailure(call: Call<ChangePasswordResponse>, t: Throwable) {
                    btnChangePassword.isEnabled = true
                    btnChangePassword.text = "Change Password"

                    if (!isAdded) return
                    Toast.makeText(requireContext(), "Network Error: ${t.message}", Toast.LENGTH_SHORT).show()
                }
            })
    }

    private fun showLogoutAllDevicesDialog() {
        AlertDialog.Builder(requireContext())
            .setTitle("Log Out All Devices")
            .setMessage("Are you sure you want to log out from all devices linked to your account? You will need to log in again on all devices.")
            .setPositiveButton("Log Out All") { _, _ ->
                logoutAllDevices()
            }
            .setNegativeButton("Cancel", null)
            .show()
    }

    private fun logoutAllDevices() {
        btnLogoutAllDevices.isEnabled = false
        btnLogoutAllDevices.text = "Logging out..."

        // Call the logout-all-devices endpoint
        profileActivity.apiService.logoutAllDevices()
            .enqueue(object : Callback<LogoutAllDevicesResponse> {
                override fun onResponse(
                    call: Call<LogoutAllDevicesResponse>,
                    response: Response<LogoutAllDevicesResponse>
                ) {
                    btnLogoutAllDevices.isEnabled = true
                    btnLogoutAllDevices.text = "Log Out From All Devices"

                    if (!isAdded) return

                    if (response.isSuccessful && response.body()?.success == true) {
                        Toast.makeText(requireContext(), "Logged out from all devices", Toast.LENGTH_LONG).show()

                        // Clear all local data
                        profileActivity.tokenManager.clearAll()

                        // Navigate to Login Screen (MainActivity)
                        val intent = Intent(requireContext(), MainActivity::class.java)
                        intent.flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK
                        startActivity(intent)

                        // Finish current activity
                        profileActivity.finishAffinity()
                    } else {
                        Toast.makeText(
                            requireContext(),
                            response.body()?.message ?: "Logout failed",
                            Toast.LENGTH_SHORT
                        ).show()
                        btnLogoutAllDevices.isEnabled = true
                        btnLogoutAllDevices.text = "Log Out From All Devices"
                    }
                }

                override fun onFailure(call: Call<LogoutAllDevicesResponse>, t: Throwable) {
                    btnLogoutAllDevices.isEnabled = true
                    btnLogoutAllDevices.text = "Log Out From All Devices"

                    if (!isAdded) return
                    Toast.makeText(requireContext(), "Network Error: ${t.message}", Toast.LENGTH_SHORT).show()
                }
            })
    }
}
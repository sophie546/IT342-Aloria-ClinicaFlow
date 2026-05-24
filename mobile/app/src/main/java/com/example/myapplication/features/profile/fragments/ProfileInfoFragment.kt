package com.example.myapplication.features.profile.fragments

import android.app.AlertDialog
import android.graphics.Color
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View

import android.view.ViewGroup
import android.widget.*
import androidx.fragment.app.Fragment
import com.example.myapplication.R
import com.example.myapplication.features.profile.ProfileActivity
import com.example.myapplication.features.profile.models.UpdateProfileRequest
import com.example.myapplication.features.profile.models.UpdateProfileResponse
import com.example.myapplication.features.profile.models.UserProfileResponse
import com.google.android.material.button.MaterialButton
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response
import java.io.File

class ProfileInfoFragment : Fragment() {

    private var tvAvatarInitials: TextView? = null
    private var tvFullName: TextView? = null
    private var tvRole: TextView? = null
    private var tvStatusBadge: TextView? = null
    private var tvAge: TextView? = null
    private var tvGender: TextView? = null
    private var tvEmail: TextView? = null
    private var tvPhone: TextView? = null
    private var tvSpecialization: TextView? = null
    private var tvDepartment: TextView? = null
    private var tvCurrentAvailability: TextView? = null
    private var tvLastUpdated: TextView? = null
    private var vStatusDot: View? = null
    private var btnEditProfile: MaterialButton? = null

    private val profileActivity get() = requireActivity() as ProfileActivity
    private var currentPhotoFile: File? = null

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View = inflater.inflate(R.layout.fragment_profile_info, container, false)

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        initViews(view)
        loadCachedData()
        fetchFromServer()
        btnEditProfile?.setOnClickListener { showEditDialog() }
    }

    private fun initViews(view: View) {
        tvAvatarInitials = view.findViewById(R.id.tvAvatarInitials)
        tvFullName = view.findViewById(R.id.tvFullName)
        tvRole = view.findViewById(R.id.tvRole)
        tvStatusBadge = view.findViewById(R.id.tvStatusBadge)
        tvAge = view.findViewById(R.id.tvAge)
        tvGender = view.findViewById(R.id.tvGender)
        tvEmail = view.findViewById(R.id.tvEmail)
        tvPhone = view.findViewById(R.id.tvPhone)
        tvSpecialization = view.findViewById(R.id.tvSpecialization)
        tvDepartment = view.findViewById(R.id.tvDepartment)
        tvCurrentAvailability = view.findViewById(R.id.tvCurrentAvailability)
        tvLastUpdated = view.findViewById(R.id.tvLastUpdated)
        vStatusDot = view.findViewById(R.id.vStatusDot)
        btnEditProfile = view.findViewById(R.id.btnEditProfile)
    }

    private fun loadCachedData() {
        val tm = profileActivity.tokenManager
        val firstName = tm.getUserFirstName()
        val lastName = tm.getUserLastName()
        val fullName = "$firstName $lastName".trim()

        tvFullName?.text = if (fullName.isNotEmpty()) fullName else "Unknown"
        tvAvatarInitials?.text = buildInitials(firstName, lastName)
        tvRole?.text = tm.getUserRole() ?: "Staff"
        tvEmail?.text = tm.getUserEmail() ?: ""
        tvPhone?.text = tm.getUserPhone() ?: "—"

        val age = tm.getUserAge()
        tvAge?.text = if (age != null) "$age Years" else "—"

        tvGender?.text = tm.getUserGender() ?: "—"
        tvSpecialization?.text = tm.getUserSpecialization() ?: "—"
        tvDepartment?.text = tm.getUserDepartment() ?: "—"

        val availability = tm.getUserAvailability() ?: "Available"
        updateAvailabilityDisplay(availability)
    }

    private fun fetchFromServer() {
        val accountId = profileActivity.currentAccountId
        if (accountId == -1) return

        profileActivity.apiService.getUserProfile(accountId)
            .enqueue(object : Callback<UserProfileResponse> {
                override fun onResponse(
                    call: Call<UserProfileResponse>,
                    response: Response<UserProfileResponse>
                ) {
                    if (!isAdded) return
                    val user = response.body() ?: return

                    tvFullName?.text = "${user.firstName} ${user.lastName}".trim()
                    tvAvatarInitials?.text = buildInitials(user.firstName, user.lastName)
                    tvRole?.text = user.role ?: "Staff"
                    tvEmail?.text = user.email ?: ""
                    tvPhone?.text = user.phone ?: "—"
                    tvAge?.text = user.age?.let { "$it Years" } ?: "—"
                    tvGender?.text = user.gender ?: "—"
                    tvSpecialization?.text = user.specialization ?: "—"
                    tvDepartment?.text = user.department ?: "—"

                    val availability = user.availability ?: "Available"
                    updateAvailabilityDisplay(availability)

                    profileActivity.tokenManager.saveUserFromResponse(
                        accountID = user.accountID,
                        firstName = user.firstName,
                        lastName = user.lastName,
                        email = user.email,
                        role = user.role,
                        age = user.age,
                        gender = user.gender,
                        phone = user.phone,
                        specialization = user.specialization,
                        department = user.department,
                        availability = user.availability,
                        photo = user.photo
                    )
                }

                override fun onFailure(call: Call<UserProfileResponse>, t: Throwable) {
                    // silently use cached data
                }
            })
    }

    private fun updateAvailabilityDisplay(availability: String) {
        val tvStatus = tvCurrentAvailability ?: return
        val statusDot = vStatusDot ?: return
        val badge = tvStatusBadge ?: return

        badge.text = availability

        when (availability.lowercase()) {
            "busy" -> {
                tvStatus.text = "Busy"
                tvStatus.setTextColor(Color.parseColor("#F97316"))
                statusDot.setBackgroundResource(R.drawable.circle_orange)
                badge.setTextColor(Color.parseColor("#F97316"))
                badge.setBackgroundResource(R.drawable.bg_badge_busy)
            }
            "available" -> {
                tvStatus.text = "Available"
                tvStatus.setTextColor(Color.parseColor("#22c55e"))
                statusDot.setBackgroundResource(R.drawable.circle_green)
                badge.setTextColor(Color.parseColor("#22c55e"))
                badge.setBackgroundResource(R.drawable.bg_badge_available)
            }
            else -> {
                tvStatus.text = "Offline"
                tvStatus.setTextColor(Color.parseColor("#6b7280"))
                statusDot.setBackgroundResource(R.drawable.circle_gray)
                badge.setTextColor(Color.parseColor("#6b7280"))
                badge.setBackgroundResource(R.drawable.bg_badge_offline)
            }
        }

        tvLastUpdated?.text = "Last updated: ${getCurrentDateTime()}"
    }

    private fun getCurrentDateTime(): String {
        val dateFormat = java.text.SimpleDateFormat("MMM dd, hh:mm a", java.util.Locale.getDefault())
        return dateFormat.format(java.util.Date())
    }

    private fun showEditDialog() {
        val tm = profileActivity.tokenManager
        val ctx = requireContext()
        val dp = (16 * resources.displayMetrics.density).toInt()

        val scrollView = ScrollView(ctx)
        val container = LinearLayout(ctx).apply {
            orientation = LinearLayout.VERTICAL
            setPadding(dp, dp, dp, dp)
        }

        // Full Name
        val nameLabel = TextView(ctx).apply {
            text = "Full Name"
            textSize = 12f
            setTextColor(Color.parseColor("#6b7280"))
        }
        val etFullName = EditText(ctx).apply {
            hint = "Enter your full name"
            setText(tm.getFullName())
            inputType = android.text.InputType.TYPE_CLASS_TEXT or android.text.InputType.TYPE_TEXT_FLAG_CAP_WORDS
        }
        container.addView(nameLabel)
        container.addView(etFullName)

        // Age
        val ageLabel = TextView(ctx).apply {
            text = "Age"
            textSize = 12f
            setTextColor(Color.parseColor("#6b7280"))
            layoutParams = LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.MATCH_PARENT,
                LinearLayout.LayoutParams.WRAP_CONTENT
            ).also { it.topMargin = dp }
        }
        val etAge = EditText(ctx).apply {
            hint = "Enter your age"
            val age = tm.getUserAge()
            setText(age?.toString() ?: "")
            inputType = android.text.InputType.TYPE_CLASS_NUMBER
        }
        container.addView(ageLabel)
        container.addView(etAge)

        // Gender Spinner
        val genderLabel = TextView(ctx).apply {
            text = "Gender"
            textSize = 12f
            setTextColor(Color.parseColor("#6b7280"))
            layoutParams = LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.MATCH_PARENT,
                LinearLayout.LayoutParams.WRAP_CONTENT
            ).also { it.topMargin = dp }
        }
        container.addView(genderLabel)

        val genderSpinner = Spinner(ctx).apply {
            val genders = arrayOf("Female", "Male", "Other", "Prefer not to say")
            val adapter = ArrayAdapter(ctx, android.R.layout.simple_spinner_item, genders)
            adapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item)
            this.adapter = adapter
            val currentGender = tm.getUserGender() ?: "Female"
            val position = genders.indexOf(currentGender)
            if (position >= 0) setSelection(position)
        }
        container.addView(genderSpinner)

        // Phone
        val phoneLabel = TextView(ctx).apply {
            text = "Phone"
            textSize = 12f
            setTextColor(Color.parseColor("#6b7280"))
            layoutParams = LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.MATCH_PARENT,
                LinearLayout.LayoutParams.WRAP_CONTENT
            ).also { it.topMargin = dp }
        }
        val etPhone = EditText(ctx).apply {
            hint = "Enter your phone number"
            setText(tm.getUserPhone() ?: "")
            inputType = android.text.InputType.TYPE_CLASS_PHONE
        }
        container.addView(phoneLabel)
        container.addView(etPhone)

        // Specialization
        val specLabel = TextView(ctx).apply {
            text = "Specialization"
            textSize = 12f
            setTextColor(Color.parseColor("#6b7280"))
            layoutParams = LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.MATCH_PARENT,
                LinearLayout.LayoutParams.WRAP_CONTENT
            ).also { it.topMargin = dp }
        }
        val etSpecialization = EditText(ctx).apply {
            hint = "Enter your specialization"
            setText(tm.getUserSpecialization() ?: "")
            inputType = android.text.InputType.TYPE_CLASS_TEXT or android.text.InputType.TYPE_TEXT_FLAG_CAP_WORDS
        }
        container.addView(specLabel)
        container.addView(etSpecialization)

        // Department
        val deptLabel = TextView(ctx).apply {
            text = "Department"
            textSize = 12f
            setTextColor(Color.parseColor("#6b7280"))
            layoutParams = LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.MATCH_PARENT,
                LinearLayout.LayoutParams.WRAP_CONTENT
            ).also { it.topMargin = dp }
        }
        val etDepartment = EditText(ctx).apply {
            hint = "Enter your department"
            setText(tm.getUserDepartment() ?: "")
            inputType = android.text.InputType.TYPE_CLASS_TEXT or android.text.InputType.TYPE_TEXT_FLAG_CAP_WORDS
        }
        container.addView(deptLabel)
        container.addView(etDepartment)

        // Availability Status
        val availabilityLabel = TextView(ctx).apply {
            text = "Availability Status"
            textSize = 12f
            setTextColor(Color.parseColor("#6b7280"))
            layoutParams = LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.MATCH_PARENT,
                LinearLayout.LayoutParams.WRAP_CONTENT
            ).also { it.topMargin = dp }
        }
        container.addView(availabilityLabel)

        val availabilitySpinner = Spinner(ctx).apply {
            val statuses = arrayOf("Available", "Busy", "Offline")
            val adapter = ArrayAdapter(ctx, android.R.layout.simple_spinner_item, statuses)
            adapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item)
            this.adapter = adapter
            val currentAvailability = tm.getUserAvailability() ?: "Available"
            val position = statuses.indexOf(currentAvailability)
            if (position >= 0) setSelection(position)
        }
        container.addView(availabilitySpinner)

        scrollView.addView(container)

        AlertDialog.Builder(ctx)
            .setTitle("Edit Profile")
            .setView(scrollView)
            .setPositiveButton("Save Changes") { dialog, _ ->
                val fullName = etFullName.text.toString().trim()
                val age = etAge.text.toString().trim().toIntOrNull()
                val gender = genderSpinner.selectedItem.toString()
                val phone = etPhone.text.toString().trim()
                val specialization = etSpecialization.text.toString().trim()
                val department = etDepartment.text.toString().trim()
                val availability = availabilitySpinner.selectedItem.toString()

                if (fullName.isEmpty()) {
                    Toast.makeText(ctx, "Full Name is required", Toast.LENGTH_SHORT).show()
                    return@setPositiveButton
                }

                val nameParts = fullName.split(" ", limit = 2)
                val newFirstName = nameParts[0]
                val newLastName = if (nameParts.size > 1) nameParts[1] else ""

                submitProfileUpdate(
                    firstName = newFirstName,
                    lastName = newLastName,
                    age = age,
                    gender = gender,
                    phone = phone,
                    specialization = specialization,
                    department = department,
                    availability = availability
                )
                dialog.dismiss()
            }
            .setNegativeButton("Cancel") { dialog, _ -> dialog.dismiss() }
            .show()
    }

    private fun submitProfileUpdate(
        firstName: String,
        lastName: String,
        age: Int?,
        gender: String,
        phone: String,
        specialization: String,
        department: String,
        availability: String
    ) {
        val tm = profileActivity.tokenManager

        val request = UpdateProfileRequest(
            firstName = firstName,
            lastName = lastName,
            email = tm.getUserEmail() ?: "",
            role = tm.getUserRole() ?: "staff",
            gender = gender,
            age = age,
            phone = phone.ifEmpty { null },
            specialization = specialization.ifEmpty { null },
            department = department.ifEmpty { null },
            availability = availability,
            photo = tm.getUserPhoto()
        )

        profileActivity.apiService
            .updateProfile(profileActivity.currentAccountId, request)
            .enqueue(object : Callback<UpdateProfileResponse> {
                override fun onResponse(
                    call: Call<UpdateProfileResponse>,
                    response: Response<UpdateProfileResponse>
                ) {
                    if (!isAdded) return
                    if (response.isSuccessful && response.body()?.success == true) {
                        tm.updateUserField("firstName", firstName)
                        tm.updateUserField("lastName", lastName)
                        age?.let { tm.updateUserField("age", it.toString()) }
                        tm.updateUserField("gender", gender)
                        tm.updateUserField("phone", phone)
                        tm.updateUserField("specialization", specialization)
                        tm.updateUserField("department", department)
                        tm.updateUserField("availability", availability)

                        tvFullName?.text = "$firstName $lastName".trim()
                        tvAvatarInitials?.text = buildInitials(firstName, lastName)
                        tvPhone?.text = phone.ifEmpty { "—" }
                        tvAge?.text = age?.let { "$it Years" } ?: "—"
                        tvGender?.text = gender
                        tvSpecialization?.text = specialization.ifEmpty { "—" }
                        tvDepartment?.text = department.ifEmpty { "—" }
                        updateAvailabilityDisplay(availability)

                        Toast.makeText(requireContext(), "Profile updated successfully", Toast.LENGTH_SHORT).show()
                    } else {
                        Toast.makeText(requireContext(), "Update failed", Toast.LENGTH_SHORT).show()
                    }
                }

                override fun onFailure(call: Call<UpdateProfileResponse>, t: Throwable) {
                    Toast.makeText(requireContext(), "Error: ${t.message}", Toast.LENGTH_SHORT).show()
                }
            })
    }

    private fun buildInitials(firstName: String?, lastName: String?): String {
        val f = firstName?.firstOrNull()?.uppercaseChar() ?: ' '
        val l = lastName?.firstOrNull()?.uppercaseChar() ?: ' '
        return "$f$l".trim()
    }

    override fun onDestroyView() {
        super.onDestroyView()
        tvAvatarInitials = null
        tvFullName = null
        tvRole = null
        tvStatusBadge = null
        tvAge = null
        tvGender = null
        tvEmail = null
        tvPhone = null
        tvSpecialization = null
        tvDepartment = null
        tvCurrentAvailability = null
        tvLastUpdated = null
        vStatusDot = null
        btnEditProfile = null
    }
}
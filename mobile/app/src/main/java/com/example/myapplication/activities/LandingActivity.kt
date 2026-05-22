package com.example.myapplication.activities

import android.app.ProgressDialog
import android.content.Intent
import android.os.Bundle
import android.widget.ArrayAdapter
import android.widget.AutoCompleteTextView
import android.widget.Toast
import androidx.appcompat.app.AlertDialog
import androidx.appcompat.app.AppCompatActivity
import com.example.myapplication.DashboardActivity
import com.example.myapplication.MainActivity
import com.example.myapplication.R
import com.example.myapplication.RegisterActivity
import com.example.myapplication.TokenManager
import com.example.myapplication.models.PatientEntity
import com.example.myapplication.models.PatientRegistrationRequest
import com.example.myapplication.network.RetrofitClient
import com.google.android.material.button.MaterialButton
import com.google.android.material.textfield.TextInputEditText
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

class LandingActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        val tokenManager = TokenManager(this)
        if (tokenManager.hasToken()) {
            startActivity(Intent(this, DashboardActivity::class.java))
            finish()
            return
        }

        setContentView(R.layout.activity_landing)
        supportActionBar?.hide()

        setupClickListeners()
    }

    private fun setupClickListeners() {
        findViewById<MaterialButton>(R.id.btnNavLogin).setOnClickListener {
            startActivity(Intent(this, MainActivity::class.java))
        }

        findViewById<MaterialButton>(R.id.btnNavGetStarted).setOnClickListener {
            startActivity(Intent(this, RegisterActivity::class.java))
        }

        findViewById<MaterialButton>(R.id.btnHeroSignIn).setOnClickListener {
            startActivity(Intent(this, MainActivity::class.java))
        }

        findViewById<MaterialButton>(R.id.btnJoinQueue).setOnClickListener {
            showJoinQueueDialog()
        }
    }

    private fun showJoinQueueDialog() {
        val dialogView = layoutInflater.inflate(R.layout.dialog_join_queue, null)
        val dialog = AlertDialog.Builder(this)
            .setView(dialogView)
            .setCancelable(true)
            .create()

        val genderInput = dialogView.findViewById<AutoCompleteTextView>(R.id.etGender)
        val genders = arrayOf("Male", "Female", "Other")
        val genderAdapter = ArrayAdapter(this, android.R.layout.simple_dropdown_item_1line, genders)
        genderInput.setAdapter(genderAdapter)

        dialogView.findViewById<MaterialButton>(R.id.btnCancel).setOnClickListener {
            dialog.dismiss()
        }

        dialogView.findViewById<MaterialButton>(R.id.btnSubmit).setOnClickListener {
            val firstName = dialogView.findViewById<TextInputEditText>(R.id.etFirstName).text.toString().trim()
            val lastName = dialogView.findViewById<TextInputEditText>(R.id.etLastName).text.toString().trim()
            val age = dialogView.findViewById<TextInputEditText>(R.id.etAge).text.toString().trim()
            val gender = genderInput.text.toString().trim()
            val contactNo = dialogView.findViewById<TextInputEditText>(R.id.etContactNo).text.toString().trim()
            val address = dialogView.findViewById<TextInputEditText>(R.id.etAddress).text.toString().trim()

            if (firstName.isEmpty() || lastName.isEmpty() || age.isEmpty() || gender.isEmpty()) {
                Toast.makeText(this, "Please fill all required fields", Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            }

            val ageInt = age.toIntOrNull()
            if (ageInt == null || ageInt <= 0 || ageInt > 120) {
                Toast.makeText(this, "Please enter a valid age", Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            }

            // Call API to register to queue
            registerToQueue(firstName, lastName, ageInt, gender, contactNo, address, dialog)
        }

        dialog.show()
    }

    private fun registerToQueue(
        firstName: String,
        lastName: String,
        age: Int,
        gender: String,
        contactNo: String,
        address: String,
        dialog: AlertDialog
    ) {
        val progressDialog = ProgressDialog(this).apply {
            setMessage("Registering to queue...")
            setCancelable(false)
            show()
        }

        val request = PatientRegistrationRequest(
            firstName = firstName,
            lastName = lastName,
            age = age,
            gender = gender,
            contactNumber = contactNo,
            address = address
        )

        RetrofitClient.instance.registerToQueue(request).enqueue(object : Callback<PatientEntity> {
            override fun onResponse(call: Call<PatientEntity>, response: Response<PatientEntity>) {
                progressDialog.dismiss()

                if (response.isSuccessful && response.body() != null) {
                    val patient = response.body()!!

                    Toast.makeText(
                        this@LandingActivity,
                        "Successfully joined queue! Queue #${patient.queueNumber}",
                        Toast.LENGTH_LONG
                    ).show()

                    // Pass data to waiting form
                    val intent = Intent(this@LandingActivity, PatientWaitingFormActivity::class.java)
                    intent.putExtra("patient_first_name", patient.fname)
                    intent.putExtra("patient_last_name", patient.lname)
                    intent.putExtra("patient_age", patient.age ?: age)
                    intent.putExtra("patient_gender", patient.gender)
                    intent.putExtra("patient_queue_number", patient.queueNumber)
                    intent.putExtra("patient_id", patient.patientId)
                    startActivity(intent)
                    dialog.dismiss()
                } else {
                    val errorMsg = when (response.code()) {
                        400 -> "Invalid data. Please check your information."
                        409 -> "Already in queue. Please wait."
                        500 -> "Server error. Please try again later."
                        else -> "Registration failed. Please try again."
                    }
                    Toast.makeText(this@LandingActivity, errorMsg, Toast.LENGTH_LONG).show()
                }
            }

            override fun onFailure(call: Call<PatientEntity>, t: Throwable) {
                progressDialog.dismiss()
                Toast.makeText(
                    this@LandingActivity,
                    "Network error: ${t.message}",
                    Toast.LENGTH_LONG
                ).show()
            }
        })
    }
}
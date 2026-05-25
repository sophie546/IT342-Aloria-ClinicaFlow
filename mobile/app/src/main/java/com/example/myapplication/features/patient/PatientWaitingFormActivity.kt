package com.example.myapplication.features.patient

import android.os.Bundle
import android.text.Editable
import android.text.TextWatcher
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import androidx.swiperefreshlayout.widget.SwipeRefreshLayout
import com.example.myapplication.R
import com.example.myapplication.features.patient.adapters.PatientWaitingAdapter
import com.example.myapplication.features.patient.models.PatientEntity
import com.example.myapplication.shared.network.RetrofitClient
import com.example.myapplication.shared.network.TokenManager
import com.example.myapplication.features.patient.models.PatientQueueResponse
import com.google.android.material.button.MaterialButton
import com.google.android.material.textfield.TextInputEditText
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

class PatientWaitingFormActivity : AppCompatActivity() {

    private lateinit var rvPatientQueue: RecyclerView
    private lateinit var swipeRefreshLayout: SwipeRefreshLayout
    private lateinit var patientAdapter: PatientWaitingAdapter
    private val patientList = mutableListOf<PatientEntity>()
    private lateinit var tokenManager: TokenManager
    private lateinit var progressDialog: android.app.ProgressDialog

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.patient_waiting_form)

        tokenManager = TokenManager(this)

        setupRecyclerView()
        setupSwipeRefresh()
        setupListeners()

        // Fetch data from backend
        fetchQueueData()
    }

    private fun setupRecyclerView() {
        rvPatientQueue = findViewById(R.id.rvPatientQueue)
        patientAdapter = PatientWaitingAdapter(patientList)
        rvPatientQueue.layoutManager = LinearLayoutManager(this)
        rvPatientQueue.adapter = patientAdapter
    }

    private fun setupSwipeRefresh() {
        swipeRefreshLayout = findViewById(R.id.swipeRefreshLayout)
        swipeRefreshLayout.setOnRefreshListener {
            fetchQueueData()
        }
        swipeRefreshLayout.setColorSchemeColors(
            resources.getColor(R.color.navy_primary, null)
        )
    }

    private fun fetchQueueData() {
        progressDialog = android.app.ProgressDialog(this).apply {
            setMessage("Loading queue...")
            setCancelable(false)
            show()
        }

        // Use authenticated API if needed, or use public instance
        val apiService = if (tokenManager.hasToken()) {
            RetrofitClient.getAuthenticatedApi(tokenManager)
        } else {
            RetrofitClient.instance
        }

        apiService.getQueue().enqueue(object : Callback<PatientQueueResponse> {
            override fun onResponse(
                call: Call<PatientQueueResponse>,
                response: Response<PatientQueueResponse>
            ) {
                progressDialog.dismiss()
                swipeRefreshLayout.isRefreshing = false

                if (response.isSuccessful && response.body() != null) {
                    val queueResponse = response.body()!!

                    if (queueResponse.success && queueResponse.data != null) {
                        patientList.clear()
                        patientList.addAll(queueResponse.data)

                        // Sort by queue number
                        patientList.sortBy { it.queueNumber ?: 0 }

                        patientAdapter.updateData(patientList)
                        updateStats()

                        Toast.makeText(
                            this@PatientWaitingFormActivity,
                            "Loaded ${patientList.size} patients",
                            Toast.LENGTH_SHORT
                        ).show()
                    } else {
                        Toast.makeText(
                            this@PatientWaitingFormActivity,
                            queueResponse.message ?: "Failed to load queue",
                            Toast.LENGTH_SHORT
                        ).show()
                    }
                } else {
                    Toast.makeText(
                        this@PatientWaitingFormActivity,
                        "Error: ${response.code()}",
                        Toast.LENGTH_SHORT
                    ).show()
                }
            }

            override fun onFailure(call: Call<PatientQueueResponse>, t: Throwable) {
                progressDialog.dismiss()
                swipeRefreshLayout.isRefreshing = false
                Toast.makeText(
                    this@PatientWaitingFormActivity,
                    "Network Error: ${t.message}",
                    Toast.LENGTH_SHORT
                ).show()
            }
        })
    }

    private fun updateStats() {
        val waiting = patientList.count { it.status == "waiting" }
        val consulting = patientList.count { it.status == "consulting" }
        val completed = patientList.count { it.status == "completed" }
        val total = patientList.size
        val nowServing = patientList.find { it.status == "consulting" }?.queueNumber ?:
        patientList.firstOrNull { it.status == "waiting" }?.queueNumber ?: 0

        // Get current user's queue number from intent or shared preferences
        val yourNumber = patientList.find { it.fname == getCurrentUserFirstName() }?.queueNumber ?:
        patientList.firstOrNull { it.status == "waiting" }?.queueNumber ?: 0

        findViewById<TextView>(R.id.tvNowServing).text = if (nowServing > 0) nowServing.toString() else "0"
        findViewById<TextView>(R.id.tvYourNumber).text = if (yourNumber > 0) yourNumber.toString() else "-"
        findViewById<TextView>(R.id.tvCompleted).text = completed.toString()
        findViewById<TextView>(R.id.tvWaiting).text = waiting.toString()
        findViewById<TextView>(R.id.tvConsulting).text = consulting.toString()
        findViewById<TextView>(R.id.tvTotal).text = total.toString()
    }

    private fun getCurrentUserFirstName(): String? {
        // Get from TokenManager or SharedPreferences
        // For now, return null to show default
        return null
    }

    private fun setupListeners() {
        // Refresh button
        findViewById<MaterialButton>(R.id.btnRefresh).setOnClickListener {
            fetchQueueData()
        }

        // Filter button
        findViewById<MaterialButton>(R.id.btnFilter).setOnClickListener {
            Toast.makeText(this, "Filter coming soon", Toast.LENGTH_SHORT).show()
        }

        // Search
        findViewById<TextInputEditText>(R.id.etSearch).addTextChangedListener(object : TextWatcher {
            override fun beforeTextChanged(s: CharSequence?, start: Int, count: Int, after: Int) {}
            override fun onTextChanged(s: CharSequence?, start: Int, before: Int, count: Int) {
                patientAdapter.filter(s.toString())
            }
            override fun afterTextChanged(s: Editable?) {}
        })
    }
}
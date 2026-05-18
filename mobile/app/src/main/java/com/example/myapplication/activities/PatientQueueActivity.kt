package com.example.myapplication.activities

import android.app.AlertDialog
import android.content.Intent
import android.os.Bundle
import android.text.Editable
import android.text.TextWatcher
import android.view.LayoutInflater
import android.view.View
import android.widget.*
import androidx.appcompat.app.AppCompatActivity
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import androidx.swiperefreshlayout.widget.SwipeRefreshLayout
import com.example.myapplication.R
import com.example.myapplication.adapters.PatientQueueAdapter
import com.example.myapplication.models.PatientQueueItem
import com.example.myapplication.models.PatientQueueResponse
import com.example.myapplication.network.RetrofitClient
import com.example.myapplication.TokenManager
import com.example.myapplication.models.UpdatePatientResponse
import com.example.myapplication.models.UpdatePatientStatusRequest
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

class PatientQueueActivity : AppCompatActivity() {

    private lateinit var recyclerView: RecyclerView
    private lateinit var adapter: PatientQueueAdapter
    private lateinit var swipeRefreshLayout: SwipeRefreshLayout
    private lateinit var searchEditText: EditText
    private lateinit var filterButton: Button
    private lateinit var tvQueueCount: TextView

    // Stats TextViews
    private lateinit var tvTotalPatients: TextView
    private lateinit var tvWaiting: TextView
    private lateinit var tvConsulting: TextView
    private lateinit var tvCompleted: TextView

    private var queueList = mutableListOf<PatientQueueItem>()
    private var filteredList = mutableListOf<PatientQueueItem>()
    private var currentFilter = "all"

    private lateinit var tokenManager: TokenManager
    private lateinit var apiService: com.example.myapplication.network.ApiService

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_patient_queue)

        tokenManager = TokenManager(this)

        if (!tokenManager.hasToken()) {
            Toast.makeText(this, "Please login to access patient queue", Toast.LENGTH_SHORT).show()
            finish()
            return
        }

        // Initialize authenticated API service
        apiService = RetrofitClient.getAuthenticatedApi(tokenManager)

        initViews()
        setupRecyclerView()
        setupSearchListener()
        setupSwipeRefresh()
        setupBurgerMenu()

        // Fetch real data from backend
        fetchQueueData()
    }

    private fun initViews() {
        recyclerView = findViewById(R.id.recyclerView)
        swipeRefreshLayout = findViewById(R.id.swipeRefreshLayout)
        searchEditText = findViewById(R.id.searchEditText)
        filterButton = findViewById(R.id.filterButton)
        tvQueueCount = findViewById(R.id.tvQueueCount)

        tvTotalPatients = findViewById(R.id.tvTotalPatients)
        tvWaiting = findViewById(R.id.tvWaiting)
        tvConsulting = findViewById(R.id.tvConsulting)
        tvCompleted = findViewById(R.id.tvCompleted)

        filterButton.setOnClickListener { showFilterDialog() }
    }

    private fun setupRecyclerView() {
        adapter = PatientQueueAdapter(
            onItemClick = { patient -> showEditDialog(patient) },
            onDeleteClick = { patient -> showDeleteDialog(patient) }
        )
        recyclerView.layoutManager = LinearLayoutManager(this)
        recyclerView.adapter = adapter
    }

    private fun setupSearchListener() {
        searchEditText.addTextChangedListener(object : TextWatcher {
            override fun beforeTextChanged(s: CharSequence?, start: Int, count: Int, after: Int) {}
            override fun onTextChanged(s: CharSequence?, start: Int, before: Int, count: Int) {
                filterList(s.toString(), currentFilter)
            }
            override fun afterTextChanged(s: Editable?) {}
        })
    }

    private fun setupSwipeRefresh() {
        swipeRefreshLayout.setOnRefreshListener {
            fetchQueueData()
        }
    }

    private fun setupBurgerMenu() {
        val btnBurgerMenu = findViewById<ImageView>(R.id.btnBurgerMenu)
        btnBurgerMenu.setOnClickListener { view ->
            showPopupMenu(view)
        }
    }

    private fun showPopupMenu(view: View) {
        val popupMenu = android.widget.PopupMenu(this, view)
        popupMenu.menuInflater.inflate(R.menu.drawer_menu, popupMenu.menu)

        popupMenu.setOnMenuItemClickListener { menuItem ->
            when (menuItem.itemId) {
                R.id.nav_account_settings -> {
                    // Navigate to Profile Activity
                    val intent = Intent(this, ProfileActivity::class.java)
                    startActivity(intent)
                    true
                }
                R.id.nav_logout -> {
                    showLogoutDialog()
                    true
                }
                else -> false
            }
        }

        popupMenu.show()
    }

    private fun showLogoutDialog() {
        AlertDialog.Builder(this)
            .setTitle("Logout")
            .setMessage("Are you sure you want to logout?")
            .setPositiveButton("Yes") { _, _ ->
                tokenManager.clearToken()
                finish()
            }
            .setNegativeButton("No", null)
            .show()
    }

    private fun fetchQueueData() {
        apiService.getQueue().enqueue(object : Callback<PatientQueueResponse> {
            override fun onResponse(call: Call<PatientQueueResponse>, response: Response<PatientQueueResponse>) {
                swipeRefreshLayout.isRefreshing = false

                if (response.isSuccessful && response.body() != null) {
                    val queueResponse = response.body()!!

                    if (queueResponse.success && queueResponse.data != null) {
                        val items = queueResponse.data
                        queueList.clear()

                        for (item in items) {
                            val patientId = item.patientId ?: continue
                            val firstName = item.fname ?: ""
                            val lastName = item.lname ?: ""
                            val patientName = "$firstName $lastName".trim()
                            if (patientName.isEmpty()) continue

                            val shortId = if (patientId.length > 8) {
                                patientId.substring(0, 8) + "..."
                            } else {
                                patientId
                            }

                            val patientItem = PatientQueueItem(
                                id = patientId,
                                queueNumber = item.queueNumber ?: 0,
                                patientName = patientName,
                                patientId = shortId,
                                age = item.age ?: 0,
                                status = (item.status ?: "waiting").uppercase(),
                                assignedDoctor = item.assignedDoctor ?: "Not assigned",
                                arrivalTime = formatArrivalTime(item.arrivalTime ?: item.createdAt)
                            )
                            queueList.add(patientItem)
                        }

                        // Update UI on main thread
                        runOnUiThread {
                            filterList(searchEditText.text.toString(), currentFilter)
                            updateStats()
                            adapter.notifyDataSetChanged()
                        }
                    } else {
                        Toast.makeText(this@PatientQueueActivity, queueResponse.message ?: "Failed to load queue", Toast.LENGTH_SHORT).show()
                    }
                } else if (response.code() == 401) {
                    handleUnauthorized()
                } else {
                    Toast.makeText(this@PatientQueueActivity, "Failed to load queue: ${response.code()}", Toast.LENGTH_SHORT).show()
                }
            }

            override fun onFailure(call: Call<PatientQueueResponse>, t: Throwable) {
                swipeRefreshLayout.isRefreshing = false
                Toast.makeText(this@PatientQueueActivity, "Network error: ${t.message}", Toast.LENGTH_SHORT).show()
            }
        })
    }

    private fun filterList(query: String, statusFilter: String) {
        filteredList = queueList.filter { item ->
            val matchesSearch = query.isEmpty() ||
                    item.patientName.contains(query, ignoreCase = true) ||
                    item.assignedDoctor.contains(query, ignoreCase = true)

            val matchesStatus = statusFilter == "all" ||
                    item.status.equals(statusFilter, ignoreCase = true)

            matchesSearch && matchesStatus
        }.toMutableList()

        adapter.submitList(filteredList)
        tvQueueCount.text = "${filteredList.size} patients in queue"
    }

    private fun updateStats() {
        tvTotalPatients.text = queueList.size.toString()
        tvWaiting.text = queueList.count { it.status == "WAITING" }.toString()
        tvConsulting.text = queueList.count { it.status == "CONSULTING" }.toString()
        tvCompleted.text = queueList.count { it.status == "COMPLETED" }.toString()
    }

    private fun formatArrivalTime(timestamp: String?): String {
        if (timestamp.isNullOrEmpty()) return "Just now"
        try {
            val dateFormat = java.text.SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss", java.util.Locale.US)
            val date = dateFormat.parse(timestamp)
            if (date != null) {
                val now = java.util.Date()
                val diffMinutes = (now.time - date.time) / (60 * 1000)
                when {
                    diffMinutes < 1 -> return "Just now"
                    diffMinutes < 60 -> return "${diffMinutes}min"
                    diffMinutes < 1440 -> return "${diffMinutes / 60}h"
                    else -> return "${diffMinutes / 1440}d"
                }
            }
        } catch (e: Exception) {
            e.printStackTrace()
        }
        return "15 min"
    }

    private fun showFilterDialog() {
        val options = arrayOf("All Status", "Waiting", "Consulting", "Completed")
        AlertDialog.Builder(this)
            .setTitle("Filter by Status")
            .setItems(options) { _, which ->
                when (which) {
                    0 -> {
                        currentFilter = "all"
                        filterButton.text = "All Status"
                        filterList(searchEditText.text.toString(), "all")
                    }
                    1 -> {
                        currentFilter = "WAITING"
                        filterButton.text = "Waiting"
                        filterList(searchEditText.text.toString(), "WAITING")
                    }
                    2 -> {
                        currentFilter = "CONSULTING"
                        filterButton.text = "Consulting"
                        filterList(searchEditText.text.toString(), "CONSULTING")
                    }
                    3 -> {
                        currentFilter = "COMPLETED"
                        filterButton.text = "Completed"
                        filterList(searchEditText.text.toString(), "COMPLETED")
                    }
                }
            }
            .show()
    }

    private fun showEditDialog(patient: PatientQueueItem) {
        val dialogView = LayoutInflater.from(this).inflate(R.layout.dialog_edit_patient, null)
        val etFirstName = dialogView.findViewById<EditText>(R.id.etFirstName)
        val etLastName = dialogView.findViewById<EditText>(R.id.etLastName)
        val etAge = dialogView.findViewById<EditText>(R.id.etAge)
        val etDoctor = dialogView.findViewById<EditText>(R.id.etDoctor)
        val spinnerStatus = dialogView.findViewById<Spinner>(R.id.spinnerStatus)

        val nameParts = patient.patientName.split(" ")
        etFirstName.setText(nameParts.getOrElse(0) { "" })
        etLastName.setText(nameParts.drop(1).joinToString(" "))
        etAge.setText(patient.age.toString())
        etDoctor.setText(patient.assignedDoctor)

        val statuses = arrayOf("waiting", "consulting", "completed")
        val displayStatuses = arrayOf("WAITING", "CONSULTING", "COMPLETED")
        val statusAdapter = ArrayAdapter(this, android.R.layout.simple_spinner_item, displayStatuses)
        spinnerStatus.adapter = statusAdapter
        val statusIndex = statuses.indexOf(patient.status.lowercase())
        if (statusIndex >= 0) spinnerStatus.setSelection(statusIndex)

        AlertDialog.Builder(this)
            .setTitle("Edit Patient")
            .setView(dialogView)
            .setPositiveButton("Save") { _, _ ->
                val request = UpdatePatientStatusRequest(
                    status = statuses[spinnerStatus.selectedItemPosition],
                    assignedDoctor = etDoctor.text.toString(),
                    fname = etFirstName.text.toString(),
                    lname = etLastName.text.toString(),
                    age = etAge.text.toString().toIntOrNull()
                )
                updatePatient(patient.id, request)
            }
            .setNegativeButton("Cancel", null)
            .show()
    }

    private fun updatePatient(id: String, request: UpdatePatientStatusRequest) {
        swipeRefreshLayout.isRefreshing = true

        apiService.updatePatient(id, request).enqueue(object : Callback<UpdatePatientResponse> {
            override fun onResponse(call: Call<UpdatePatientResponse>, response: Response<UpdatePatientResponse>) {
                swipeRefreshLayout.isRefreshing = false

                if (response.isSuccessful) {
                    val result = response.body()
                    if (result?.success == true) {
                        Toast.makeText(this@PatientQueueActivity, "Patient updated successfully", Toast.LENGTH_SHORT).show()
                        fetchQueueData()
                    } else {
                        Toast.makeText(this@PatientQueueActivity, result?.message ?: "Update failed", Toast.LENGTH_SHORT).show()
                    }
                } else if (response.code() == 401) {
                    handleUnauthorized()
                } else {
                    Toast.makeText(this@PatientQueueActivity, "Update failed: ${response.code()}", Toast.LENGTH_SHORT).show()
                }
            }

            override fun onFailure(call: Call<UpdatePatientResponse>, t: Throwable) {
                swipeRefreshLayout.isRefreshing = false
                Toast.makeText(this@PatientQueueActivity, "Error: ${t.message}", Toast.LENGTH_SHORT).show()
            }
        })
    }

    private fun showDeleteDialog(patient: PatientQueueItem) {
        AlertDialog.Builder(this)
            .setTitle("Confirm Delete")
            .setMessage("Are you sure you want to remove ${patient.patientName} from the queue?")
            .setPositiveButton("Delete") { _, _ ->
                deletePatient(patient.id)
            }
            .setNegativeButton("Cancel", null)
            .show()
    }

    private fun deletePatient(id: String) {
        AlertDialog.Builder(this)
            .setTitle("Permanent Delete")
            .setMessage("Are you sure you want to PERMANENTLY delete this patient? This action cannot be undone.")
            .setPositiveButton("Delete Permanently") { _, _ ->
                apiService.permanentDeletePatient(id).enqueue(object : Callback<UpdatePatientResponse> {
                    override fun onResponse(call: Call<UpdatePatientResponse>, response: Response<UpdatePatientResponse>) {
                        if (response.isSuccessful) {
                            Toast.makeText(this@PatientQueueActivity, "Patient permanently deleted", Toast.LENGTH_SHORT).show()
                            fetchQueueData()
                        } else if (response.code() == 401) {
                            handleUnauthorized()
                        } else {
                            Toast.makeText(this@PatientQueueActivity, "Delete failed: ${response.code()}", Toast.LENGTH_SHORT).show()
                        }
                    }

                    override fun onFailure(call: Call<UpdatePatientResponse>, t: Throwable) {
                        Toast.makeText(this@PatientQueueActivity, "Error: ${t.message}", Toast.LENGTH_SHORT).show()
                    }
                })
            }
            .setNegativeButton("Cancel", null)
            .show()
    }

    private fun handleUnauthorized() {
        Toast.makeText(this, "Session expired. Please login again.", Toast.LENGTH_LONG).show()
        tokenManager.clearToken()
        finish()
    }
}
package com.example.myapplication.features.patient.adapters

import android.view.LayoutInflater
import android.view.ViewGroup
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.google.android.material.chip.Chip
import com.example.myapplication.R
import com.example.myapplication.features.patient.models.PatientEntity
import java.text.SimpleDateFormat
import java.util.*

class PatientWaitingAdapter(
    private var patients: List<PatientEntity>
) : RecyclerView.Adapter<PatientWaitingAdapter.PatientWaitingViewHolder>() {

    private var filteredList = patients.toList()

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): PatientWaitingViewHolder {
        val view = LayoutInflater.from(parent.context)
            .inflate(R.layout.item_patient, parent, false)
        return PatientWaitingViewHolder(view)
    }

    override fun onBindViewHolder(holder: PatientWaitingViewHolder, position: Int) {
        val patient = filteredList[position]
        holder.bind(patient)
    }

    override fun getItemCount(): Int = filteredList.size

    fun filter(query: String) {
        filteredList = if (query.isEmpty()) {
            patients
        } else {
            patients.filter {
                (it.fname?.contains(query, ignoreCase = true) == true) ||
                        (it.lname?.contains(query, ignoreCase = true) == true)
            }
        }
        notifyDataSetChanged()
    }

    fun updateData(newPatients: List<PatientEntity>) {
        patients = newPatients
        filteredList = patients
        notifyDataSetChanged()
    }

    class PatientWaitingViewHolder(view: android.view.View) : RecyclerView.ViewHolder(view) {
        private val tvInitials: TextView = view.findViewById(R.id.tvInitials)
        private val tvPatientName: TextView = view.findViewById(R.id.tvPatientName)
        private val chipStatus: Chip = view.findViewById(R.id.chipStatus)
        private val tvAge: TextView = view.findViewById(R.id.tvAge)
        private val tvGender: TextView = view.findViewById(R.id.tvGender)
        private val tvDoctor: TextView = view.findViewById(R.id.tvDoctor)
        private val tvArrivalTime: TextView = view.findViewById(R.id.tvArrivalTime)
        private val tvQueueNumber: TextView = view.findViewById(R.id.tvQueueNumber)

        fun bind(patient: PatientEntity) {
            val firstName = patient.fname ?: ""
            val lastName = patient.lname ?: ""
            val fullName = if (firstName.isNotEmpty() || lastName.isNotEmpty()) {
                "$firstName $lastName".trim()
            } else {
                "Patient"
            }

            // Set initials (first letter of first and last name)
            val initials = "${firstName.take(1)}${lastName.take(1)}".uppercase()
            tvInitials.text = if (initials.isNotEmpty()) initials else "P"

            tvPatientName.text = fullName
            tvAge.text = "${patient.age ?: 0} years"
            tvGender.text = patient.gender ?: "Not specified"
            tvDoctor.text = patient.assignedDoctor ?: "Dr. Cruz"

            // Format arrival time
            val arrivalTime = patient.arrivalTime ?: patient.createdAt ?: "N/A"
            tvArrivalTime.text = formatTime(arrivalTime)

            // Set status chip
            val statusText = when(patient.status) {
                "waiting" -> "Waiting"
                "consulting" -> "Consulting"
                "completed" -> "Completed"
                else -> patient.status ?: "Waiting"
            }
            chipStatus.text = statusText

            // Set status chip background color
            val chipColor = when(patient.status) {
                "waiting" -> R.color.status_waiting_bg
                "consulting" -> R.color.status_consulting_bg
                "completed" -> R.color.status_completed_bg
                else -> R.color.status_waiting_bg
            }
            chipStatus.setChipBackgroundColorResource(chipColor)

            // Set queue number
            tvQueueNumber.text = "#${String.format("%02d", patient.queueNumber ?: 0)}"
        }

        private fun formatTime(timeString: String?): String {
            if (timeString.isNullOrEmpty()) return "N/A"
            return try {
                val isoFormat = SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss", Locale.US)
                val date = isoFormat.parse(timeString.take(19))
                val timeFormat = SimpleDateFormat("hh:mm a", Locale.US)
                timeFormat.format(date ?: Date())
            } catch (e: Exception) {
                if (timeString.length >= 16) timeString.substring(11, 16) else timeString
            }
        }
    }
}
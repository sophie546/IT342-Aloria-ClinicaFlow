package com.example.myapplication.features.patient.adapters

import android.graphics.Color
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ImageView
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.example.myapplication.R
import com.example.myapplication.features.patient.models.PatientQueueItem

class PatientQueueAdapter(
    private val onItemClick: (PatientQueueItem) -> Unit,
    private val onDeleteClick: (PatientQueueItem) -> Unit
) : RecyclerView.Adapter<PatientQueueAdapter.ViewHolder>() {

    private var items = listOf<PatientQueueItem>()

    fun submitList(newItems: List<PatientQueueItem>) {
        items = newItems
        notifyDataSetChanged()
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        val view = LayoutInflater.from(parent.context)
            .inflate(R.layout.item_patient_queue, parent, false)
        return ViewHolder(view)
    }

    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        holder.bind(items[position])
    }

    override fun getItemCount() = items.size

    inner class ViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        private val tvPatientName: TextView = itemView.findViewById(R.id.tvPatientName)
        private val tvPatientId: TextView = itemView.findViewById(R.id.tvPatientId)
        private val tvAge: TextView = itemView.findViewById(R.id.tvAge)
        private val tvStatus: TextView = itemView.findViewById(R.id.tvStatus)
        private val tvDoctor: TextView = itemView.findViewById(R.id.tvDoctor)
        private val tvArrivalTime: TextView = itemView.findViewById(R.id.tvArrivalTime)
        private val btnDelete: ImageView = itemView.findViewById(R.id.btnDelete)

        fun bind(item: PatientQueueItem) {
            tvPatientName.text = item.patientName
            tvPatientId.text = item.patientId
            tvAge.text = item.age.toString()
            tvDoctor.text = item.assignedDoctor
            tvArrivalTime.text = item.arrivalTime

            // Status styling
            when (item.status.uppercase()) {
                "WAITING" -> {
                    tvStatus.text = "Waiting"
                    tvStatus.setTextColor(Color.parseColor("#b45309"))
                    tvStatus.setBackgroundResource(R.drawable.bg_status_waiting)
                }
                "CONSULTING" -> {
                    tvStatus.text = "Consulting"
                    tvStatus.setTextColor(Color.parseColor("#5b21b6"))
                    tvStatus.setBackgroundResource(R.drawable.bg_status_consulting)
                }
                "COMPLETED" -> {
                    tvStatus.text = "Completed"
                    tvStatus.setTextColor(Color.parseColor("#065f46"))
                    tvStatus.setBackgroundResource(R.drawable.bg_status_completed)
                }
                else -> {
                    tvStatus.text = item.status
                    tvStatus.setTextColor(Color.parseColor("#6b7280"))
                    tvStatus.setBackgroundResource(R.drawable.bg_status_waiting)
                }
            }

            // Click listeners
            itemView.setOnClickListener { onItemClick(item) }
            btnDelete.setOnClickListener { onDeleteClick(item) }
        }
    }
}
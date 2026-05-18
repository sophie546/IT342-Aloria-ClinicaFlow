package com.example.myapplication.activities

import android.os.Bundle
import android.widget.ImageButton
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.fragment.app.Fragment
import androidx.viewpager2.adapter.FragmentStateAdapter
import androidx.viewpager2.widget.ViewPager2
import com.example.myapplication.R
import com.example.myapplication.TokenManager
import com.example.myapplication.fragments.ProfileInfoFragment
import com.example.myapplication.fragments.ProfileSecurityFragment
import com.example.myapplication.network.RetrofitClient
import com.google.android.material.tabs.TabLayout
import com.google.android.material.tabs.TabLayoutMediator

class ProfileActivity : AppCompatActivity() {

    lateinit var tokenManager: TokenManager
    lateinit var apiService: com.example.myapplication.network.ApiService
    var currentAccountId: Int = -1

    private lateinit var tabLayout: TabLayout
    private lateinit var viewPager: ViewPager2
    private lateinit var btnBack: ImageButton

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_profile)

        tokenManager = TokenManager(this)

        if (!tokenManager.hasToken()) {
            Toast.makeText(this, "Please login first", Toast.LENGTH_SHORT).show()
            finish()
            return
        }

        apiService = RetrofitClient.getAuthenticatedApi(tokenManager)
        currentAccountId = tokenManager.getAccountId()

        // Initialize views
        tabLayout = findViewById(R.id.tabLayout)
        viewPager = findViewById(R.id.viewPager)
        btnBack = findViewById(R.id.btnBack)

        // Set up back button
        setupBackButton()

        // Set up ViewPager with tabs
        setupViewPager()
    }

    private fun setupBackButton() {
        btnBack.setOnClickListener {
            // Go back to previous activity
            onBackPressedDispatcher.onBackPressed()
            // Alternative: finish() if you want to close the activity
            // finish()
        }
    }

    private fun setupViewPager() {
        val adapter = ProfilePagerAdapter(this)
        viewPager.adapter = adapter

        TabLayoutMediator(tabLayout, viewPager) { tab, position ->
            tab.text = when (position) {
                0 -> "Personal Info"
                1 -> "Security"
                else -> ""
            }
        }.attach()
    }

    private inner class ProfilePagerAdapter(activity: AppCompatActivity) :
        FragmentStateAdapter(activity) {

        override fun getItemCount() = 2

        override fun createFragment(position: Int): Fragment {
            return when (position) {
                0 -> ProfileInfoFragment()
                1 -> ProfileSecurityFragment()
                else -> ProfileInfoFragment()
            }
        }
    }
}
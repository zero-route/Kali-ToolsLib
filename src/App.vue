<script setup>
import { ref, provide } from 'vue'

// Import semua komponen section
import InformationGathering from './sections/InformationGathering.vue'
import PasswordAttack from './sections/PasswordAttack.vue'
import WirelessAttacks from './sections/WirelessAttacks.vue'
import WebApplication from './sections/WebApplication.vue'
import ExploitationTools from './sections/ExploitationTools.vue'
import VulnerabilityAnalysis from './sections/VulnerabilityAnalysis.vue'
import SniffingSpoofing from './sections/SniffingSpoofing.vue'
import DigitalForensics from './sections/DigitalForensics.vue'
import ReverseEngineering from './sections/ReverseEngineering.vue'
import PostExploitation from './sections/PostExploitation.vue'
import NetworkingPivoting from './sections/NetworkingPivoting.vue'
import CryptographySteganography from './sections/CryptographySteganography.vue'
import ReportingDocumentation from './sections/ReportingDocumentation.vue'
import CloudSecurity from './sections/CloudSecurity.vue'

// State query pencarian
const searchQuery = ref('')

// Provide searchQuery ke semua child component agar bisa dipakai filter internal
provide('searchQuery', searchQuery)

const clearSearch = () => {
  searchQuery.value = ''
}
</script>

<template>
  <div class="min-h-screen px-4 py-8 md:px-8 max-w-7xl mx-auto flex flex-col justify-between font-sans">
    <div>
      <!-- Header -->
      <header class="text-center my-10 animate-fade-in">
        <div class="inline-block px-4 py-1.5 mb-4 text-xs font-semibold tracking-wider text-[#42b883] bg-[#42b883]/10 border border-[#42b883]/30 rounded-full uppercase">
          Cybersecurity Tools Repository
        </div>
        <h1 class="text-4xl md:text-6xl font-black tracking-tight text-white mb-4">
          Kali <span class="text-[#42b883]">ToolsLib</span>
        </h1>
        <p class="text-gray-400 text-sm md:text-base max-w-xl mx-auto leading-relaxed">
          Kumpulan tools penetration testing & digital forensics terorganisir.
        </p>

        <!-- Search Bar Input Box -->
        <div class="max-w-xl mx-auto mt-8 relative">
          <div class="relative flex items-center">
            <span class="absolute left-4 text-gray-400">
              🔍
            </span>
            <input 
              v-model="searchQuery"
              type="text"
              placeholder="Cari tool, deskripsi, tag (cth: nmap, aws, offensive)..."
              class="w-full pl-11 pr-10 py-3.5 bg-[#161616] border border-gray-800 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#42b883] focus:ring-1 focus:ring-[#42b883] transition-all text-sm shadow-lg"
            />
            <button 
              v-if="searchQuery" 
              @click="clearSearch"
              class="absolute right-3.5 text-gray-400 hover:text-white bg-gray-800 hover:bg-gray-700 rounded-full w-6 h-6 flex items-center justify-center text-xs transition-colors"
            >
              ✕
            </button>
          </div>
          <div v-if="searchQuery" class="text-left mt-2 px-2 text-xs text-emerald-400 font-mono">
            Filtering tools dengan kata kunci: "<span class="font-bold">{{ searchQuery }}</span>"
          </div>
        </div>
      </header>

      <!-- Sections List -->
      <main class="space-y-8 my-10">
        <InformationGathering />
        <PasswordAttack />
        <WirelessAttacks />
        <WebApplication />
        <ExploitationTools />
        <VulnerabilityAnalysis />
        <SniffingSpoofing />
        <DigitalForensics />
        <ReverseEngineering />
        <PostExploitation />
        <NetworkingPivoting />
        <CryptographySteganography />
        <ReportingDocumentation />
        <CloudSecurity />
      </main>
    </div>

    <!-- Footer -->
    <footer class="text-center text-gray-600 text-xs py-8 border-t border-gray-900/80 mt-16">
      Built with Vue.js, Vite & Tailwind CSS
    </footer>
  </div>
</template>

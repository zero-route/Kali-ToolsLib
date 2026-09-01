<script setup>
// Import semua komponen dari folder sections
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
import NetworkingPivoting from './sections/Networking&Pivoting.vue'
import CryptographySteganography from './sections/Cryptography&Steganography.vue'
import ReportingDocumentation from './sections/Reporting&Documentation.vue'
import CloudSecurity from './sections/CloudSecurity.vue'
</script>

<template>
  <div class="min-h-screen px-4 py-8 md:px-8 max-w-7xl mx-auto flex flex-col justify-between">
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
      </header>

      <!-- Sections List -->
      <main class="space-y-12 my-10">
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

<script setup>
import Background from './components/Background.vue'

// Import semua section
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
</script>

<template>
  <div class="relative min-h-screen bg-[#09070d] overflow-hidden">
    <!-- Canvas Background -->
    <div class="fixed inset-0 z-0 pointer-events-auto">
      <Background />
    </div>

    <!-- Main Content Container -->
    <div class="relative z-10 px-4 py-8 md:px-8 max-w-7xl mx-auto flex flex-col justify-between min-h-screen">
      <div>
        <!-- Header -->
        <header class="text-center my-10 animate-slide-up">
          <h1 class="font-['Audiowide',sans-serif] text-5xl md:text-7xl font-bold tracking-wider mb-6 flex flex-col gap-2 items-center">
            <!-- Baris Atas: Kali Tools (Warna Putih) -->
            <span class="text-white drop-shadow-md">
              Kali Tools
            </span>
            
            <!-- Baris Bawah: Library (Gradient Putih ke Hijau Vue) -->
            <span class="bg-gradient-to-b from-white via-white/90 to-[#42b883] bg-clip-text text-transparent">
              Library
            </span>
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
  </div>
</template>

<style scoped>
@keyframes slideUpFade {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-slide-up {
  animation: slideUpFade 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
</style>

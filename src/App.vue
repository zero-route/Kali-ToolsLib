<script setup>
import { ref } from 'vue'
import ToolCard from './components/ToolCard.vue'

// Array daftar tools (bisa ditambah bertahap)
const tools = ref([
  {
    id: 1,
    title: 'Placeholder Tool',
    description: 'Tool pertama kamu bakal ditaruh di sini. Kirim detail kodenya kapan saja.',
    category: 'Development',
    link: '#'
  }
])
</script>

<template>
  <div class="min-h-screen px-4 py-12 md:px-8 max-w-6xl mx-auto flex flex-col justify-between">
    <div>
      <!-- Header -->
      <header class="text-center my-10 animate-fade-in">
        <div class="inline-block px-4 py-1.5 mb-4 text-xs font-medium text-[#42b883] bg-[#42b883]/10 border border-[#42b883]/30 rounded-full">
          Vue 3 + Vite Workspace
        </div>
        <h1 class="text-4xl md:text-6xl font-black tracking-tight text-white mb-4">
          Tools<span class="text-[#42b883]">Hub</span>
        </h1>
        <p class="text-gray-400 text-base md:text-lg max-w-lg mx-auto leading-relaxed">
          Kumpulan tools interaktif berbasis web dengan performa tinggi.
        </p>
      </header>

      <!-- Grid list tools -->
      <main class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 my-8">
        <ToolCard 
          v-for="(tool, index) in tools" 
          :key="tool.id" 
          :tool="tool" 
          :index="index" 
        />
      </main>
    </div>

    <!-- Footer -->
    <footer class="text-center text-gray-600 text-xs py-8 border-t border-gray-900 mt-12">
      Built with Vue.js & Tailwind CSS
    </footer>
  </div>
</template>

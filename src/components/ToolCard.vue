<script setup>
defineProps({
  tool: {
    type: Object,
    required: true
  },
  index: {
    type: Number,
    default: 0
  }
})
</script>

<template>
  <div 
    class="animate-fade-in group relative bg-[#141414] border border-gray-800/80 rounded-xl p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[#42b883] hover:shadow-[0_0_25px_rgba(66,184,131,0.25)] flex flex-col justify-between"
    :style="{ animationDelay: `${index * 100}ms` }"
  >
    <div>
      <div class="flex items-center justify-between mb-4">
        <span class="px-3 py-1 text-xs font-semibold text-[#42b883] bg-[#42b883]/10 border border-[#42b883]/20 rounded-full">
          {{ tool.category }}
        </span>
      </div>

      <h3 class="text-xl font-bold text-white group-hover:text-[#42b883] transition-colors mb-2">
        {{ tool.title }}
      </h3>
      
      <p class="text-gray-400 text-sm leading-relaxed mb-6">
        {{ tool.description }}
      </p>
    </div>

    <a 
      :href="tool.link" 
      class="inline-flex items-center justify-between text-sm font-semibold text-white group-hover:text-[#42b883] transition-colors pt-4 border-t border-gray-800/50"
    >
      <span>Buka Tool</span>
      <span class="transform group-hover:translate-x-1.5 transition-transform duration-200">→</span>
    </a>
  </div>
</template>

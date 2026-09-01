<script setup>
import { ref } from 'vue'

const isExpanded = ref(true)
const copiedIndex = ref(null)

const copyCommand = (cmd, index) => {
  if (!cmd) return
  navigator.clipboard.writeText(cmd)
  copiedIndex.value = index
  setTimeout(() => {
    copiedIndex.value = null
  }, 2000)
}

const getTagStyle = (tag) => {
  switch (tag.toLowerCase()) {
    case 'offensive':
      return 'bg-red-500/10 text-red-400 border-red-500/20'
    case 'defensive':
      return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
    case 'analysis':
      return 'bg-amber-500/10 text-amber-400 border-amber-500/20'
    case 'active':
      return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
    case 'passive':
      return 'bg-blue-500/10 text-blue-400 border-blue-500/20'
    default:
      return 'bg-gray-500/10 text-gray-400 border-gray-500/20'
  }
}

const tools = ref([
  // Note Taking & Documentation
  { name: 'cherrytree', desc: 'Note-taking hierarkis untuk pentester — menyimpan temuan, command, screenshot, dan kode dalam satu database terenkripsi dengan struktur pohon yang rapi.', cmd: 'cherrytree', tag: 'Defensive' },
  { name: 'metagoofil', desc: 'Information gathering tool yang didesain untuk mengekstrak metadata dari dokumen publik milik organisasi (pdf, doc, xls) — berguna untuk mendokumentasikan data yang dikumpulkan dari target.', cmd: 'metagoofil -d target.com -t pdf -o output/', tag: 'Analysis' },
  { name: 'pipal', desc: 'Analisis statistik wordlist dan password — mengungkap pola, karakter paling umum, dan tren dalam dataset password untuk keperluan dokumentasi hasil audit password.', cmd: 'pipal wordlist.txt', tag: 'Analysis' },
  { name: 'faraday', desc: 'IDE penetration testing kolaboratif — mengagregasi temuan dari berbagai tools secara otomatis ke dalam satu laporan terpusat yang dapat diakses tim melalui antarmuka web.', cmd: 'faraday-server', tag: 'Defensive' },
  { name: 'recordmydesktop', desc: 'Screen recording untuk Linux — merekam demonstrasi eksploitasi sebagai bukti (Proof of Concept) dalam laporan pentest dalam format video OGV yang dapat dikonversi.', cmd: 'recordmydesktop --output demo.ogv', tag: 'Defensive' },
  { name: 'cutycapt', desc: 'Mengambil screenshot halaman web dari command line menggunakan WebKit rendering — berguna untuk mendokumentasikan temuan web vulnerability secara otomatis tanpa membuka browser manual.', cmd: 'cutycapt --url=https://target.com --out=screenshot.png', tag: 'Analysis' },

  // Collaboration & Reporting Platforms
  { name: 'dradis', desc: 'Platform kolaborasi dan pelaporan untuk tim pentesting — import hasil scan Nmap/Nessus/Burp, buat laporan profesional, dan share temuan antar anggota tim secara real-time.', cmd: 'dradis', tag: 'Defensive' },
  { name: 'magictree', desc: 'Tool pengumpulan data dan pelaporan pentesting — import XML dari berbagai scanner seperti Nmap dan Nessus lalu generate laporan terstruktur dalam format yang dapat dikustomisasi.', cmd: 'magictree', tag: 'Defensive' },
  { name: 'casefile', desc: 'Saudara Maltego yang dirancang spesifik untuk intelijen luring — memungkinkan visualisasi jaringan relasi entitas tanpa memerlukan koneksi internet atau interaksi API online.', cmd: 'casefile', tag: 'Defensive' },
  { name: 'pwnedcheck', desc: 'Script untuk mengecek apakah daftar kredensial yang ditemukan selama pentest pernah bocor pada database Have I Been Pwned (HIBP) — berguna sebagai bagian dari dokumentasi temuan.', cmd: 'pwnedcheck -f credentials.txt', tag: 'Defensive' },
  { name: 'pwndoc', desc: 'Platform penulisan laporan penetration testing berbasis web — menyediakan template laporan profesional, manajemen vulnerability, dan kolaborasi tim untuk menghasilkan laporan pentest yang konsisten dan berkualitas tinggi secara efisien.', cmd: 'docker-compose up -d', tag: 'Defensive' },
  { name: 'ghostwriter', desc: 'Platform manajemen pentest dan pelaporan dari SpecterOps — mengelola seluruh siklus engagement dari scoping hingga laporan akhir, terintegrasi dengan tools populer dan menyediakan dashboard tracking temuan secara kolaboratif.', cmd: 'python3 manage.py runserver', tag: 'Defensive' },
  { name: 'serpico', desc: 'Tool generate laporan pentest otomatis berbasis Ruby — menggunakan template Microsoft Word yang dapat dikustomisasi untuk menghasilkan laporan profesional secara konsisten dengan manajemen finding dan rekomendasi remediation.', cmd: 'ruby serpico.rb', tag: 'Defensive' },
  { name: 'plextrac', desc: 'Platform pelaporan dan manajemen kerentanan berbasis cloud — memudahkan dokumentasi temuan, tracking remediation, dan komunikasi dengan klien melalui dashboard interaktif yang dapat dibagikan secara aman.', cmd: 'plextrac-cli import --file findings.csv', tag: 'Defensive' },
  { name: 'writehat', desc: 'Tool pelaporan pentest berbasis web open source — menyediakan editor markdown untuk dokumentasi temuan, manajemen template laporan, dan ekspor ke format PDF atau DOCX profesional untuk keperluan pelaporan klien.', cmd: 'python3 manage.py runserver 0.0.0.0:8000', tag: 'Defensive' },

  // Screenshot & Screen Capture
  { name: 'flameshot', desc: 'Tool screenshot canggih untuk Linux dengan fitur anotasi built-in — menambahkan panah, kotak, teks, dan blur langsung pada screenshot sebelum disimpan, sangat efisien untuk mendokumentasikan temuan vulnerability secara visual.', cmd: 'flameshot gui', tag: 'Defensive' },
  { name: 'scrot', desc: 'Command-line screenshot utility ringan untuk Linux — mengambil screenshot layar penuh, jendela tertentu, atau area yang dipilih secara otomatis, cocok untuk diintegrasikan dalam skrip otomatisasi dokumentasi pentest.', cmd: 'scrot -s screenshot.png', tag: 'Defensive' },

  // Evidence & PoC
  { name: 'asciinema', desc: 'Merekam sesi terminal sebagai teks berbasis waktu — menghasilkan replay sesi command line yang ringan dan dapat dibagikan sebagai bukti PoC eksploitasi tanpa memerlukan file video berukuran besar.', cmd: 'asciinema rec demo.cast', tag: 'Defensive' },
  { name: 'peek', desc: 'GIF screen recorder sederhana untuk Linux — merekam area layar yang dipilih menjadi file GIF animasi atau WebM/MP4 yang ringan, ideal untuk membuat bukti PoC yang dapat langsung disisipkan ke dalam laporan pentest.', cmd: 'peek', tag: 'Defensive' },

  // Export & Format
  { name: 'pandoc', desc: 'Swiss army knife konversi dokumen — mengkonversi file Markdown, HTML, dan format lain menjadi laporan PDF, DOCX, atau EPUB profesional, sangat berguna untuk menghasilkan laporan pentest akhir dari catatan yang ditulis dalam Markdown.', cmd: 'pandoc report.md -o report.pdf --pdf-engine=xelatex', tag: 'Defensive' },
  { name: 'wkhtmltopdf', desc: 'Konverter HTML ke PDF menggunakan WebKit rendering engine — mengubah laporan HTML dari tools seperti Nikto, Faraday, atau ScoutSuite menjadi file PDF yang dapat dibagikan kepada klien secara profesional.', cmd: 'wkhtmltopdf https://target.com/report.html output.pdf', tag: 'Defensive' }
])
</script>

<template>
  <section class="bg-[#121212] border border-gray-800/80 rounded-xl overflow-hidden transition-all duration-300">
    <button 
      @click="isExpanded = !isExpanded"
      class="w-full flex items-center justify-between p-5 bg-[#161616] hover:bg-[#1a1a1a] transition-colors border-b border-gray-800/50"
    >
      <div class="flex items-center gap-3">
        <span class="text-xl">⚙️</span>
        <h2 class="text-lg md:text-xl font-bold text-white tracking-wide">
          Reporting & Documentation
        </h2>
        <span class="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-[#42b883]/10 text-[#42b883] border border-[#42b883]/20">
          {{ tools.length }} tools
        </span>
      </div>
      <span class="text-gray-400 text-sm transform transition-transform duration-200" :class="{ 'rotate-180': isExpanded }">
        ▼
      </span>
    </button>

    <div v-show="isExpanded" class="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      <div 
        v-for="(tool, index) in tools" 
        :key="index"
        class="group relative bg-[#181818] border border-gray-800 rounded-lg p-5 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:border-[#42b883] hover:shadow-[0_0_20px_rgba(66,184,131,0.2)]"
      >
        <div>
          <div class="flex items-center justify-between mb-3">
            <h3 class="font-bold text-lg text-white group-hover:text-[#42b883] transition-colors font-mono truncate mr-2">
              {{ tool.name }}
            </h3>
            <span 
              class="text-[10px] px-2 py-0.5 font-bold uppercase rounded tracking-wider border flex-shrink-0"
              :class="getTagStyle(tool.tag)"
            >
              {{ tool.tag }}
            </span>
          </div>

          <p class="text-gray-400 text-xs leading-relaxed mb-4">
            {{ tool.desc }}
          </p>
        </div>

        <div v-if="tool.cmd" class="mt-2 pt-3 border-t border-gray-800/60">
          <div class="flex items-center justify-between bg-[#0e0e0e] border border-gray-800 rounded p-2 text-xs font-mono">
            <code class="text-emerald-400 truncate mr-2 font-mono" :title="tool.cmd">
              {{ tool.cmd }}
            </code>
            <button 
              @click="copyCommand(tool.cmd, index)"
              class="text-gray-400 hover:text-white px-2 py-1 rounded bg-gray-800/50 hover:bg-gray-700 text-[10px] transition-colors flex-shrink-0"
            >
              {{ copiedIndex === index ? 'Copied!' : 'Copy' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

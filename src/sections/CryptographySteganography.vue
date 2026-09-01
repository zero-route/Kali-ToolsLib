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
  { name: 'openssl', desc: 'Toolkit SSL/TLS lengkap — enkripsi file, generate sertifikat, test koneksi SSL, dan analisis protokol kriptografi.', cmd: 'openssl enc -aes-256-cbc -in file.txt -out file.enc', tag: 'Analysis' },
  { name: 'cryptcat', desc: 'Netcat dengan kemampuan enkripsi Twofish — memastikan sesi bind/reverse shell di jaringan tidak bisa di-sniff.', cmd: 'cryptcat -l -p 4444 -k secretkey', tag: 'Defensive' },
  { name: 'ccrypt', desc: 'Utilitas command line handal untuk enkripsi dan dekripsi file atau stream dengan menggunakan algoritma Rijndael (AES).', cmd: 'ccrypt -e file.txt', tag: 'Defensive' },
  { name: 'stegosuite', desc: 'Tool steganografi GUI untuk menyembunyikan informasi pada gambar secara mudah dengan memanfaatkan algoritma AES.', cmd: 'stegosuite', tag: 'Analysis' },
  { name: 'zsteg', desc: 'Mendeteksi dan mengekstrak data steganografi yang tersembunyi pada gambar berformat PNG dan BMP.', cmd: 'zsteg image.png', tag: 'Analysis' },
  { name: 'stegols', desc: 'Analisis steganografi command line untuk mendeteksi teknik LSB (Least Significant Bit) pada gambar.', cmd: 'stegols image.png', tag: 'Analysis' },
  { name: 'gpg', desc: 'GNU Privacy Guard — enkripsi asimetris berbasis OpenPGP untuk mengamankan file dan komunikasi email.', cmd: 'gpg -c file.txt', tag: 'Defensive' },
  { name: 'veracrypt', desc: 'Enkripsi disk dan container — membuat volume terenkripsi dengan deniability plausibel menggunakan AES, Serpent, Twofish.', cmd: 'veracrypt', tag: 'Defensive' },
  { name: 'steghide', desc: 'Menyembunyikan data rahasia di dalam file gambar (JPEG, BMP) dan audio (WAV) menggunakan steganografi.', cmd: 'steghide embed -cf image.jpg -ef secret.txt', tag: 'Analysis' },
  { name: 'stegcracker', desc: 'Brute force password steganografi untuk mengekstrak data tersembunyi dari file yang dilindungi steghide.', cmd: 'stegcracker image.jpg wordlist.txt', tag: 'Offensive' },
  { name: 'outguess', desc: 'Deteksi dan embedding steganografi pada file JPEG — lebih tahan statistikal analysis dibanding metode sederhana.', cmd: 'outguess -k "secret" -d secret.txt image.jpg out.jpg', tag: 'Analysis' },
  { name: 'snow', desc: 'Whitespace steganografi — menyembunyikan pesan dalam whitespace (tab dan spasi) di akhir baris teks.', cmd: 'snow -C -m "secret message" file.txt', tag: 'Analysis' },
  { name: 'rsatool', desc: 'Tool analisis dan eksploitasi kelemahan implementasi RSA — menghitung private key dari parameter yang lemah, mengeksploitasi small exponent attack, common modulus attack, dan kelemahan matematis RSA lainnya yang sering muncul di CTF.', cmd: 'python3 rsatool.py -n <modulus> -p <p> -q <q> -e <e>', tag: 'Offensive' },
  { name: 'xortool', desc: 'Tool analisis XOR cipher — menentukan panjang kunci XOR dan mendekripsi data yang dienkripsi dengan XOR berdasarkan analisis frekuensi karakter, sangat berguna untuk CTF dan analisis malware yang menggunakan XOR sebagai obfuskasi.', cmd: 'xortool cipher.bin', tag: 'Analysis' },
  { name: 'ciphey', desc: 'Tool dekripsi otomatis berbasis AI — mendeteksi dan mendekripsi berbagai jenis enkripsi, encoding, dan cipher secara otomatis tanpa perlu tahu metode yang digunakan, mendukung 50+ cipher termasuk Caesar, Base64, dan hash cracking.', cmd: 'ciphey -t "SGVsbG8gV29ybGQ="', tag: 'Analysis' },
  { name: 'stegoveritas', desc: 'Tool analisis steganografi komprehensif — menjalankan puluhan teknik deteksi steganografi sekaligus pada file gambar, audio, dan video untuk menemukan data tersembunyi menggunakan berbagai metode analisis statistik dan visual.', cmd: 'stegoveritas image.png', tag: 'Analysis' },
  { name: 'binvis', desc: 'Visualisasi binary untuk analisis malware dan kriptografi — mengubah file binary menjadi representasi visual yang membantu mengidentifikasi pola enkripsi, kompresi, dan struktur data tersembunyi dalam file secara intuitif.', cmd: 'binvis', tag: 'Analysis' },
  { name: 'age', desc: 'Tool enkripsi file modern yang sederhana dan aman — mengenkripsi file menggunakan kriptografi modern berbasis X25519, ChaCha20-Poly1305, dan HMAC-SHA256 dengan antarmuka yang jauh lebih sederhana dari GPG.', cmd: 'age -r age1ql3z7hjy54pwczhyww5e37m5yq8ys20a6mff98yqgkljtpw70e7s5f8j3g file.txt > file.age', tag: 'Defensive' },
  { name: 'silenteye', desc: 'Platform steganografi cross-platform dengan GUI — menyembunyikan data dalam file gambar dan audio menggunakan berbagai algoritma steganografi dengan opsi enkripsi tambahan menggunakan AES untuk keamanan berlapis.', cmd: 'silenteye', tag: 'Analysis' },
  { name: 'openstego', desc: 'Tool steganografi open source untuk menyembunyikan pesan rahasia dalam file gambar — mendukung enkripsi data sebelum disembunyikan dan watermarking digital untuk perlindungan hak cipta pada gambar digital.', cmd: 'openstego embed -mf secret.txt -cf image.jpg -out output.jpg', tag: 'Analysis' }
])
</script>

<template>
  <section class="bg-[#121212] border border-gray-800/80 rounded-xl overflow-hidden transition-all duration-300">
    <!-- Header Section (Accordion Toggle) -->
    <button 
      @click="isExpanded = !isExpanded"
      class="w-full flex items-center justify-between p-5 bg-[#161616] hover:bg-[#1a1a1a] transition-colors border-b border-gray-800/50"
    >
      <div class="flex items-center gap-3">
        <span class="text-xl">🔒</span>
        <h2 class="text-lg md:text-xl font-bold text-white tracking-wide">
          Cryptography & Steganography
        </h2>
        <span class="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-[#42b883]/10 text-[#42b883] border border-[#42b883]/20">
          {{ tools.length }} tools
        </span>
      </div>
      <span class="text-gray-400 text-sm transform transition-transform duration-200" :class="{ 'rotate-180': isExpanded }">
        ▼
      </span>
    </button>

    <!-- Grid Card Tools -->
    <div v-show="isExpanded" class="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      <div 
        v-for="(tool, index) in tools" 
        :key="index"
        class="group relative bg-[#181818] border border-gray-800 rounded-lg p-5 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:border-[#42b883] hover:shadow-[0_0_20px_rgba(66,184,131,0.2)]"
      >
        <div>
          <!-- Header Card (Nama + Tag) -->
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

          <!-- Deskripsi Tool -->
          <p class="text-gray-400 text-xs leading-relaxed mb-4">
            {{ tool.desc }}
          </p>
        </div>

        <!-- Terminal Command Box -->
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

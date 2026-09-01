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
  { name: 'autopsy', desc: 'Platform forensik digital GUI berbasis The Sleuth Kit — analisis disk image, recovery file, dan timeline investigation.', cmd: 'autopsy', tag: 'Defensive' },
  { name: 'sleuthkit', desc: 'Kumpulan command line tools forensik untuk menyelidiki volume disk dan sistem file (NTFS, FAT, ext, UFS).', cmd: 'fls -r -p image.dd', tag: 'Defensive' },
  { name: 'mac-robber', desc: 'Data collector yang mengumpulkan waktu akses, modifikasi, dan perubahan (MAC) file untuk membangun timeline investigasi.', cmd: 'sudo mac-robber /dev/sda1 > timeline.txt', tag: 'Analysis' },
  { name: 'extundelete', desc: 'Utilitas canggih untuk memulihkan file yang tidak sengaja terhapus pada partisi berformat ext3 atau ext4 di Linux.', cmd: 'sudo extundelete /dev/sdb1 --restore-all', tag: 'Defensive' },
  { name: 'recoverjpeg', desc: 'Mengekstrak gambar JPEG dari file sistem atau block device mentah (seperti SD card rusak) dengan mengabaikan struktur direktori.', cmd: 'recoverjpeg /dev/sdb -o /path/to/output', tag: 'Defensive' },
  { name: 'chkrootkit', desc: 'Scanner lokal yang memeriksa tanda-tanda kehadiran rootkit secara umum pada sistem Linux melalui anomali binary.', cmd: 'sudo chkrootkit', tag: 'Defensive' },
  { name: 'rkhunter', desc: 'Rootkit Hunter — scanner komprehensif yang membandingkan hash file penting dengan database online untuk deteksi backdoor.', cmd: 'sudo rkhunter --check', tag: 'Defensive' },
  { name: 'galleta', desc: 'Internet Explorer cookie forensic analysis tool — mengekstrak data dari file cookie IE untuk melihat histori pengguna.', cmd: 'galleta cookie.txt', tag: 'Analysis' },
  { name: 'pasco', desc: 'Mengekstrak histori aktivitas web dari file index.dat pada sistem Windows yang lebih lama.', cmd: 'pasco index.dat > history.txt', tag: 'Analysis' },
  { name: 'volafox', desc: 'Mac OS X Memory Analysis Toolkit — framework forensik memori spesifik untuk OS X berbasis Python.', cmd: 'python volafox.py -f osx_memory.dmp --info', tag: 'Analysis' },
  { name: 'binwalk', desc: 'Analisis dan ekstraksi firmware — mendeteksi file tersembunyi, filesystem, dan data terkompresi dalam binary.', cmd: 'binwalk -e firmware.bin', tag: 'Analysis' },
  { name: 'foremost', desc: 'File carving — memulihkan file yang terhapus berdasarkan header, footer, dan struktur data internal dari disk image.', cmd: 'foremost -i image.dd -o /path/to/output', tag: 'Defensive' },
  { name: 'volatility', desc: 'Framework analisis memory forensics — menganalisis RAM dump untuk menemukan proses, koneksi, dan artefak malware.', cmd: 'volatility -f memdump.raw imageinfo', tag: 'Analysis' },
  { name: 'bulk-extractor', desc: 'Mengekstrak informasi penting (email, URL, kartu kredit, domain) dari disk image tanpa parse filesystem terlebih dahulu.', cmd: 'bulk_extractor -o /path/to/output image.dd', tag: 'Analysis' },
  { name: 'dc3dd', desc: 'Forensic disk imaging dengan hashing otomatis, logging, dan wiping — versi enhanced dari dd untuk keperluan forensik.', cmd: 'sudo dc3dd if=/dev/sdb of=evidence.dd hash=sha256', tag: 'Defensive' },
  { name: 'scalpel', desc: 'File carving tool berbasis signature — lebih cepat dari foremost dengan konfigurasi file type yang fleksibel.', cmd: 'scalpel image.dd -o /path/to/output', tag: 'Defensive' },
  { name: 'guymager', desc: 'Forensic disk imager GUI — membuat forensic image (EWF, AFF, dd) dengan verifikasi hash yang cepat dan dapat dipercaya.', cmd: 'sudo guymager', tag: 'Defensive' },
  { name: 'pdf-parser', desc: 'Analisis struktur file PDF — menemukan object tersembunyi, JavaScript berbahaya, dan stream terenkripsi.', cmd: 'pdf-parser document.pdf', tag: 'Analysis' },
  { name: 'exiftool', desc: 'Ekstraksi dan manipulasi metadata dari berbagai format file: gambar, dokumen, audio, video — berguna untuk OSINT.', cmd: 'exiftool image.jpg', tag: 'Analysis' },
  { name: 'strings', desc: 'Mengekstrak string teks yang dapat dibaca dari file binary — langkah awal analisis malware dan binary forensics.', cmd: 'strings malware.exe', tag: 'Analysis' },

  // Memory Forensics
  { name: 'volatility3', desc: 'Versi terbaru dari Volatility Framework — analisis memory forensics generasi baru dengan arsitektur plugin yang diperbarui total, mendukung Windows 10/11, Linux kernel modern, dan macOS terbaru dengan performa yang jauh lebih cepat.', cmd: 'python3 vol.py -f memdump.raw windows.info', tag: 'Analysis' },
  { name: 'rekall', desc: 'Framework memory forensics advanced berbasis Python yang dikembangkan dari Volatility — memiliki kemampuan live memory analysis langsung dari sistem yang berjalan tanpa perlu dump RAM terlebih dahulu ke file.', cmd: 'rekall -f memdump.raw pslist', tag: 'Analysis' },
  { name: 'lime', desc: 'Linux Memory Extractor — loadable kernel module untuk mengakuisisi memory Linux secara forensik dari sistem yang sedang berjalan, menghasilkan dump RAM dalam format yang kompatibel dengan Volatility dan Rekall.', cmd: 'sudo insmod lime.ko "path=tcp:4444 format=raw"', tag: 'Analysis' },

  // Disk & File Forensics
  { name: 'testdisk', desc: 'Tool recovery partisi dan boot sector yang powerful — memulihkan partisi yang terhapus, memperbaiki partition table rusak, dan merekonstruksi MBR/GPT dari disk yang mengalami kerusakan logis maupun akibat serangan ransomware.', cmd: 'sudo testdisk', tag: 'Defensive' },
  { name: 'photorec', desc: 'File recovery tool yang berjalan bersama TestDisk — memulihkan ratusan jenis file yang terhapus dari hard disk, memory card, USB flash drive berdasarkan signature file tanpa bergantung pada filesystem yang mungkin sudah rusak.', cmd: 'sudo photorec', tag: 'Defensive' },
  { name: 'ddrescue', desc: 'Tool forensik untuk mengkloning media penyimpanan yang rusak secara fisik — menggunakan algoritma cerdas untuk mencoba membaca setiap sektor berulang kali dan melewati bad sector secara otomatis untuk memaksimalkan data yang terselamatkan.', cmd: 'sudo ddrescue -d -r3 /dev/sdb image.dd rescue.log', tag: 'Defensive' },
  { name: 'safecopy', desc: 'Tool recovery data dari media penyimpanan yang rusak atau tidak stabil — mencoba berbagai strategi pembacaan untuk mengekstrak data dari disk, CD/DVD, dan flash drive yang mengalami bad sector atau kerusakan fisik ringan.', cmd: 'sudo safecopy /dev/sdb image.dd', tag: 'Defensive' },
  { name: 'dcfldd', desc: 'Versi enhanced dari dd khusus forensik dari DoD Computer Forensics Lab — menambahkan fitur on-the-fly hashing, status output real-time, split output, dan pattern wiping yang tidak tersedia di dd standar.', cmd: 'sudo dcfldd if=/dev/sdb of=evidence.dd hash=sha256', tag: 'Defensive' },

  // Network Forensics
  { name: 'networkminer', desc: 'Network forensic analysis tool (NFAT) pasif — menganalisis file PCAP untuk merekonstruksi sesi jaringan, mengekstrak file yang ditransfer, gambar, email, kredensial, dan sertifikat SSL dari capture traffic jaringan.', cmd: 'mono NetworkMiner.exe', tag: 'Analysis' },
  { name: 'xplico', desc: 'Network forensics tool open source untuk rekonstruksi konten dari traffic yang di-capture — mengekstrak email, HTTP, VoIP, FTP, dan konten aplikasi lain dari file PCAP dengan antarmuka web yang memudahkan investigasi.', cmd: 'sudo xplico -f capture.pcap', tag: 'Analysis' },
  { name: 'chaosreader', desc: 'Tool untuk mengekstrak dan merekonstruksi session dari file PCAP — memisahkan setiap koneksi TCP/UDP menjadi file terpisah dan merekonstruksi halaman web, gambar, dan transfer file yang terjadi selama capture.', cmd: 'chaosreader capture.pcap', tag: 'Analysis' },

  // Log & Timeline Analysis
  { name: 'log2timeline / plaso', desc: 'Framework pembuatan super timeline forensik — mengumpulkan artefak timestamp dari ratusan sumber berbeda (registry, log, filesystem, browser, email) lalu menyatukannya menjadi satu timeline kronologis untuk analisis insiden.', cmd: 'log2timeline.py timeline.plaso image.dd', tag: 'Analysis' },
  { name: 'timesketch', desc: 'Platform kolaboratif berbasis web untuk analisis timeline forensik — memvisualisasikan super timeline dari Plaso dalam antarmuka interaktif yang memudahkan investigator menemukan pola serangan dan menandai artefak penting.', cmd: 'timesketch --help', tag: 'Analysis' },
  { name: 'chainsaw', desc: 'Tool cepat untuk hunting ancaman di Windows Event Logs — menggunakan aturan Sigma dan deteksi built-in untuk menemukan artefak serangan seperti lateral movement, persistence, dan eksekusi payload berbahaya dari log Windows.', cmd: 'chainsaw hunt /path/to/logs -r rules/', tag: 'Analysis' },
  { name: 'hayabusa', desc: 'Windows event log fast forensics dan threat hunting tool berbasis Rust — menganalisis event log Windows menggunakan ribuan aturan Sigma dan deteksi built-in untuk merekonstruksi aktivitas penyerang secara cepat dan akurat.', cmd: 'hayabusa csv-dump -d /path/to/logs', tag: 'Analysis' },

  // Malware Analysis
  { name: 'clamav', desc: 'Antivirus engine open source untuk deteksi malware — memindai file, direktori, dan memory dump untuk mendeteksi virus, trojan, dan malware menggunakan database signature yang terus diperbarui, sering digunakan dalam forensik untuk triage awal.', cmd: 'clamscan -r /path/to/target', tag: 'Analysis' },
  { name: 'yara', desc: 'Tool pattern matching untuk identifikasi dan klasifikasi malware — menggunakan aturan berbasis string dan kondisi logis untuk mendeteksi malware berdasarkan karakteristik kode, string, dan struktur file yang telah diketahui sebelumnya.', cmd: 'yara rules.yar /path/to/target', tag: 'Analysis' },
  { name: 'pestudio', desc: 'Tool analisis statis malware untuk file PE Windows — memeriksa imports, strings, entropy, certificate, dan indikator berbahaya lainnya dari executable Windows tanpa perlu menjalankannya, ideal untuk triage malware awal yang aman.', cmd: 'pestudio.exe malware.exe', tag: 'Analysis' },
  { name: 'cuckoo sandbox', desc: 'Automated malware analysis system — menjalankan file mencurigakan dalam lingkungan virtual terisolasi dan merekam seluruh perilakunya: API calls, koneksi jaringan, perubahan registry, file yang dibuat, dan screenshot eksekusi.', cmd: 'cuckoo submit malware.exe', tag: 'Analysis' },
  { name: 'floss', desc: 'FLARE Obfuscated String Solver dari Mandiant — mengekstrak string yang diobfuskasi dari malware secara otomatis menggunakan teknik emulasi, jauh lebih efektif dari tool strings biasa untuk analisis malware yang menyembunyikan IOC.', cmd: 'floss malware.exe', tag: 'Analysis' },

  // Browser & Email Forensics
  { name: 'dumpzilla', desc: 'Tool forensik khusus untuk browser Firefox, Iceweasel, dan Seamonkey — mengekstrak riwayat browsing, cookies, bookmark, download, form data, password tersimpan, cache, dan session dari profil browser untuk keperluan investigasi.', cmd: 'python3 dumpzilla.py --profile /path/to/profile --All', tag: 'Analysis' },
  { name: 'hindsight', desc: 'Tool forensik komprehensif untuk browser Google Chrome dan Chromium — menganalisis profil browser untuk mengekstrak riwayat, download, cookies, login tersimpan, cache, ekstensi, dan preferensi pengguna dari database SQLite internal.', cmd: 'python3 hindsight.py -i /path/to/chrome/profile -o /output/dir', tag: 'Analysis' },
  { name: 'offlineregistryview', desc: 'Membaca dan menganalisis file registry Windows offline dari disk image atau backup — memungkinkan investigator mengekstrak konfigurasi sistem, aktivitas pengguna, program yang pernah dijalankan, dan artefak forensik dari registry tanpa booting sistem.', cmd: 'offline-registry-view.exe', tag: 'Analysis' },

  // Steganography Detection
  { name: 'stegdetect', desc: 'Tool deteksi steganografi pada file gambar JPEG — menggunakan analisis statistik untuk mendeteksi keberadaan data tersembunyi yang disisipkan menggunakan tools steganografi umum seperti JSteg, JPHide, dan Invisible Secrets.', cmd: 'stegdetect image.jpg', tag: 'Analysis' },
  { name: 'foremost-ng', desc: 'Versi modern dari foremost dengan dukungan format file yang lebih luas — melakukan file carving dari disk image atau raw device berdasarkan header dan footer file untuk memulihkan dokumen, gambar, video, dan arsip yang terhapus.', cmd: 'foremost-ng -i image.dd -o /output/dir', tag: 'Defensive' }
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
        <span class="text-xl">🕵️</span>
        <h2 class="text-lg md:text-xl font-bold text-white tracking-wide">
          Digital Forensics
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

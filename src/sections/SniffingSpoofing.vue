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
  { name: 'wireshark', desc: 'Packet analyzer GUI terpopuler — capture dan analisis traffic jaringan secara real-time dengan filter yang powerful.', cmd: 'sudo wireshark', tag: 'Analysis' },
  { name: 'dsniff', desc: 'Kumpulan tools jaringan untuk password sniffing pada protokol clear-text seperti FTP, Telnet, SMTP, HTTP, POP.', cmd: 'sudo dsniff -i eth0', tag: 'Offensive' },
  { name: 'netsniff-ng', desc: 'Swiss army knife untuk network sniffing tingkat kernel zero-copy yang sangat cepat untuk analisis packet capture besar.', cmd: 'sudo netsniff-ng --in eth0 --out dump.pcap', tag: 'Analysis' },
  { name: 'mitmproxy', desc: 'Interactive HTTPS proxy berbasis console — mencegat, memodifikasi, dan mereplay traffic web secara on-the-fly.', cmd: 'mitmproxy -p 8080', tag: 'Offensive' },
  { name: 'hexinject', desc: 'Packet injector serbaguna — dapat menyuntikkan paket custom atau file pcap mentah kembali ke dalam jaringan.', cmd: 'sudo hexinject -i eth0 -p packet.hex', tag: 'Offensive' },
  { name: 'sslsplit', desc: 'Tool intersepsi transparan TLS/SSL untuk melangsungkan MITM attack terhadap traffic aplikasi tanpa mengubah konfigurasi client.', cmd: 'sudo sslsplit -D -k ca.key -c ca.crt https 0.0.0.0 8443 http 0.0.0.0 8080', tag: 'Offensive' },
  { name: 'scapy', desc: 'Library Python untuk manipulasi paket jaringan tingkat rendah — memungkinkan pembuatan, pengiriman, capture, dan analisis paket dari berbagai protokol secara custom untuk riset keamanan dan pengembangan tools serangan jaringan.', cmd: 'sudo python3 -c "from scapy.all import *; send(IP(dst=\'192.168.1.1\')/ICMP())"', tag: 'Offensive' },
  { name: 'netsed', desc: 'Network stream editor real-time — memodifikasi konten paket TCP/UDP yang melewati koneksi secara on-the-fly menggunakan substitusi string atau regex, berguna untuk manipulasi traffic dan testing aplikasi jaringan.', cmd: 'netsed tcp 2222 192.168.1.50 22 s/old_string/new_string/', tag: 'Offensive' },
  { name: 'hamster', desc: 'Tool session hijacking berbasis cookie — bekerja bersama Ferret untuk menangkap dan mereplay cookie session HTTP dari traffic yang di-sniff, memungkinkan pengambilalihan sesi web korban di jaringan yang sama.', cmd: 'sudo hamster', tag: 'Offensive' },
  { name: 'ferret', desc: 'Pasangan dari Hamster — menangkap paket WiFi dan mengekstrak cookie session HTTP untuk digunakan dalam session hijacking, bekerja di jaringan WiFi terbuka atau setelah berhasil melakukan MITM attack.', cmd: 'sudo ferret -i wlan0', tag: 'Offensive' },
  { name: 'zaproxy (MITM)', desc: 'OWASP ZAP dalam mode proxy MITM — mencegat seluruh traffic HTTP/HTTPS antara browser dan server untuk analisis mendalam, modifikasi request/response secara manual, dan pengujian keamanan aplikasi web secara interaktif.', cmd: 'zaproxy', tag: 'Offensive' },
  { name: 'netfuke', desc: 'Tool manipulasi konten jaringan secara transparan — mengubah teks, gambar, dan konten lain dalam traffic HTTP yang melewati MITM secara real-time untuk demonstrasi risiko keamanan di jaringan tanpa enkripsi.', cmd: 'sudo netfuke -i eth0 -r', tag: 'Offensive' },
  { name: 'tcpflow', desc: 'Tool capture dan rekonstruksi aliran TCP — memisahkan dan menyimpan setiap koneksi TCP sebagai file terpisah untuk analisis forensik traffic jaringan, lebih mudah dibaca daripada file pcap mentah dari tcpdump.', cmd: 'sudo tcpflow -i eth0 -o /path/to/output_dir', tag: 'Analysis' },
  { name: 'tshark', desc: 'Versi command line dari Wireshark — capture dan analisis paket jaringan dari terminal dengan kemampuan filter, decode protokol, dan ekspor data yang sama seperti Wireshark namun cocok untuk automasi dan scripting.', cmd: 'tshark -i eth0 -f "port 80"', tag: 'Analysis' },
  { name: 'p0f', desc: 'Passive OS fingerprinting tool — mengidentifikasi sistem operasi, browser, dan konfigurasi jaringan host hanya dari traffic yang melewati tanpa mengirim satu paket pun, ideal untuk reconnaissance yang benar-benar tersembunyi.', cmd: 'sudo p0f -i eth0', tag: 'Passive' },
  { name: 'ngrep', desc: 'Network grep — mencari pola string atau regex dalam paket jaringan secara real-time seperti grep pada file teks, sangat berguna untuk menemukan kredensial, token, atau data sensitif dalam traffic plaintext.', cmd: 'sudo ngrep -d eth0 -i "pass" tcp port 80', tag: 'Analysis' },
  { name: 'tcpreplay', desc: 'Suite tool untuk memutar ulang file pcap ke jaringan — memungkinkan replay traffic yang telah di-capture untuk pengujian IDS/IPS, load testing, dan simulasi serangan berdasarkan traffic nyata yang sebelumnya direkam.', cmd: 'sudo tcpreplay --intf1=eth0 traffic.pcap', tag: 'Active' },
  { name: 'tcpdump', desc: 'Packet capture CLI legendaris — filter dan dump traffic jaringan langsung dari terminal dengan syntax BPF.', cmd: 'sudo tcpdump -i eth0 -nnv', tag: 'Analysis' },
  { name: 'ettercap', desc: 'Suite lengkap untuk Man-in-the-Middle attack — ARP poisoning, sniffing credentials, dan injeksi konten.', cmd: 'sudo ettercap -G', tag: 'Offensive' },
  { name: 'bettercap', desc: 'Framework MITM modern pengganti ettercap — WiFi, BLE, HID, dan network attack dalam satu tool yang extensible.', cmd: 'sudo bettercap -iface eth0', tag: 'Offensive' },
  { name: 'arpspoof', desc: 'ARP cache poisoning untuk mengalihkan traffic jaringan melalui attacker sebagai langkah awal MITM.', cmd: 'sudo arpspoof -i eth0 -t 192.168.1.10 192.168.1.1', tag: 'Offensive' },
  { name: 'dnsspoof', desc: 'DNS spoofing untuk memalsukan respons DNS dan mengarahkan traffic ke server attacker (DNS poisoning).', cmd: 'sudo dnsspoof -i eth0 -f hosts.txt', tag: 'Offensive' },
  { name: 'yersinia', desc: 'Serangan pada protokol Layer 2: STP, CDP, DHCP, 802.1Q, VTP — berguna untuk audit keamanan jaringan switch.', cmd: 'sudo yersinia -G', tag: 'Offensive' },
  { name: 'macchanger', desc: 'Mengubah MAC address network interface untuk anonymisasi atau bypass MAC filtering pada jaringan.', cmd: 'sudo macchanger -r eth0', tag: 'Active' },
  { name: 'netsnoop', desc: 'Tool monitoring traffic jaringan real-time berbasis CLI — menampilkan koneksi aktif, bandwidth per proses, dan konten paket secara ringkas tanpa overhead GUI seperti Wireshark.', cmd: 'sudo netsnoop', tag: 'Analysis' },
  { name: 'packetsled', desc: 'Platform analisis traffic jaringan enterprise — merekam, mengindeks, dan menganalisis metadata paket dalam skala besar untuk investigasi insiden dan threat hunting berbasis anomali jaringan.', cmd: 'sudo packetsled --start', tag: 'Analysis' },
  { name: 'sslstrip', desc: 'Downgrade koneksi HTTPS ke HTTP secara transparan selama MITM untuk mengekspos credential yang dikirim.', cmd: 'sudo sslstrip -l 8080', tag: 'Offensive' }
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
        <span class="text-xl">📶</span>
        <h2 class="text-lg md:text-xl font-bold text-white tracking-wide">
          Sniffing & Spoofing
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

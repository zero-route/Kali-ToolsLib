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
  { name: 'proxychains', desc: 'Memaksa koneksi aplikasi melalui rantai proxy (SOCKS4/5, HTTP) untuk anonymisasi atau pivoting melalui jaringan internal.', cmd: 'proxychains nmap -sT 192.168.2.10', tag: 'Active' },
  { name: 'ligolo-ng', desc: 'Tool tunneling/pivoting tingkat lanjut yang bekerja di Layer 2 (menggunakan interface TUN), memungkinkan pentester melakukan routing otomatis ke jaringan dalam tanpa proxychains.', cmd: './proxy -selfcert', tag: 'Active' },
  { name: 'proxychains4', desc: 'Versi modern dari proxychains — mendukung multiple DNS resolution dan routing dinamis lebih baik.', cmd: 'proxychains4 -f proxy.conf curl http://internal-site', tag: 'Active' },
  { name: 'miredo', desc: 'Teredo IPv6 tunneling daemon — memberikan konektivitas IPv6 pada host di balik router NAT IPv4 untuk menghindari filter.', cmd: 'sudo miredo', tag: 'Active' },
  { name: 'sslh', desc: 'Multiplexer protokol aplikatif — memungkinkan HTTPS, SSH, OpenVPN, dan HTTP dibagikan dalam port 443 yang sama.', cmd: 'sudo sslh -v -p 0.0.0.0:443 --ssh 127.0.0.1:22 --ssl 127.0.0.1:8443', tag: 'Active' },
  { name: 'tinc', desc: 'Virtual Private Network (VPN) daemon yang menggunakan enkripsi kuat untuk merutekan traffic terdesentralisasi (mesh network).', cmd: 'sudo tincd -n netname', tag: 'Active' },
  { name: 'ngrok', desc: 'Mengekspos port localhost ke internet publik melalui secure tunnel (berguna untuk menerima reverse shell pada mesin NAT).', cmd: 'ngrok tcp 4444', tag: 'Active' },
  { name: 'frp', desc: 'Fast Reverse Proxy berbasis Go — membangun tunnel reverse proxy dari jaringan internal ke server publik dengan konfigurasi sederhana, sangat berguna untuk mengekspos service internal melalui firewall tanpa modifikasi konfigurasi jaringan.', cmd: './frpc -c frpc.ini', tag: 'Offensive' },
  { name: 'rpivot', desc: 'Tool pivoting reverse SOCKS proxy berbasis Python — membangun tunnel SOCKS dari mesin target ke attacker untuk mengakses jaringan internal yang tidak dapat dijangkau langsung, bekerja bahkan di balik NAT dan firewall ketat.', cmd: 'python3 client.py --server-ip <ip> --server-port 9999', tag: 'Offensive' },
  { name: 'revsocks', desc: 'Reverse SOCKS5 proxy tool lintas platform — membuat tunnel SOCKS5 dari target ke attacker untuk pivoting ke segmen jaringan internal yang terisolasi, mendukung autentikasi dan enkripsi traffic tunnel.', cmd: './revsocks -listen 0.0.0.0:1080 -connect <attacker_ip>:8443', tag: 'Offensive' },
  { name: 'sshuttle', desc: 'Transparent proxy VPN melalui SSH — merutekan seluruh traffic dari mesin attacker melalui server SSH tanpa memerlukan akses root di remote server, ideal untuk pivoting cepat saat sudah memiliki akses SSH ke target.', cmd: 'sshuttle -r user@target_ip 192.168.2.0/24', tag: 'Offensive' },
  { name: '3proxy', desc: 'Proxy server serbaguna yang mendukung HTTP, HTTPS, SOCKS4, SOCKS5, dan FTP proxy — sering digunakan dalam skenario post-exploitation untuk membuat proxy di mesin yang dikompromis sebagai titik pivot ke jaringan internal.', cmd: '3proxy conf/3proxy.cfg', tag: 'Offensive' },
  { name: 'dnscat2-client', desc: 'Client untuk dnscat2 server — membangun channel C2 tersembunyi menggunakan protokol DNS yang hampir selalu diizinkan melewati firewall, memungkinkan kontrol penuh atas mesin target melalui traffic DNS yang terlihat normal.', cmd: 'ruby dnscat2.rb domain.local', tag: 'Offensive' },
  { name: 'plink', desc: 'Command line SSH client dari PuTTY untuk Windows — sering digunakan dalam post-exploitation untuk membuat SSH tunnel dan port forwarding dari mesin Windows target ke attacker tanpa perlu install software tambahan yang mencurigakan.', cmd: 'plink.exe -l user -pw password -R 9050:127.0.0.1:9050 attacker_ip', tag: 'Offensive' },
  { name: 'htran', desc: 'Connection bouncer tool — memforward koneksi TCP dari satu host ke host lain melalui serangkaian proxy untuk menyembunyikan sumber asli traffic dan membuat jalur komunikasi C2 yang sulit dilacak oleh defender.', cmd: './htran -tran 80 192.168.1.50 443', tag: 'Offensive' },
  { name: 'netsh', desc: 'Windows built-in network configuration tool yang sering disalahgunakan untuk port forwarding — membuat aturan portproxy Windows untuk meneruskan koneksi ke host lain tanpa software tambahan, teknik living-off-the-land yang populer.', cmd: 'netsh interface portproxy add v4tov4 listenport=80 connectaddress=192.168.1.100 connectport=8080', tag: 'Offensive' },
  { name: 'nmap-script-pivot', desc: 'Kumpulan NSE script Nmap untuk scanning melalui pivot host — memungkinkan network discovery dan port scanning terhadap segmen jaringan internal yang hanya bisa diakses melalui mesin yang sudah dikompromis sebagai hop perantara.', cmd: 'nmap -sS -p 80 --script http-title 192.168.2.0/24', tag: 'Active' },
  { name: 'chisel', desc: 'TCP/UDP tunneling cepat melalui HTTP menggunakan SSH — membangun tunnel ke jaringan internal yang terisolasi.', cmd: './chisel server -p 8080 --reverse', tag: 'Offensive' },
  { name: 'socat', desc: 'Multipurpose relay tool — membuat koneksi dua arah antara berbagai jenis socket, pipe, file, dan protokol.', cmd: 'socat TCP-LISTEN:4444,fork TCP:192.168.1.50:80', tag: 'Active' },
  { name: 'netcat', desc: 'Network Swiss Army knife — membuat koneksi TCP/UDP, port scanning, file transfer, dan reverse shell sederhana.', cmd: 'nc -lvnp 4444', tag: 'Active' },
  { name: 'ncat', desc: 'Versi modern netcat dari Nmap project — tambahan SSL support, connection brokering, dan proxy chaining.', cmd: 'ncat -lvnp 4444 --ssl', tag: 'Active' },
  { name: 'ssh', desc: 'Secure Shell dengan kemampuan tunneling — local/remote/dynamic port forwarding untuk pivoting jaringan.', cmd: 'ssh -D 9050 user@target_ip', tag: 'Active' },
  { name: 'iodine', desc: 'DNS tunneling — mengenkapsulasi traffic IP melalui protokol DNS untuk bypass firewall ketat yang hanya izinkan DNS.', cmd: 'sudo iodine -f -c 10.0.0.1 tunnel.domain.local', tag: 'Offensive' },
  { name: 'ptunnel', desc: 'ICMP tunneling — mengirim data melalui paket ICMP echo (ping) untuk bypass firewall yang blokir TCP/UDP.', cmd: 'sudo ptunnel -p proxy_ip -lp 8000 -da target_ip -dp 22', tag: 'Offensive' },
  { name: 'gost', desc: 'GO Simple Tunnel — tool tunneling serbaguna berbasis Go yang mendukung HTTP, HTTPS, SOCKS5, dan relay chain untuk membangun jalur komunikasi tersembunyi melalui berbagai protokol secara fleksibel.', cmd: './gost -L=:8080 -F=socks5://192.168.1.50:1080', tag: 'Offensive' },
  { name: 'tun2socks', desc: 'Tool untuk merutekan seluruh traffic sistem melalui proxy SOCKS5 di level TUN interface — memungkinkan pivoting transparan tanpa perlu menggunakan proxychains pada setiap aplikasi secara individual.', cmd: 'sudo ./tun2socks -device tun0 -proxy socks5://127.0.0.1:1080', tag: 'Active' },
  { name: 'stunnel', desc: 'Membungkus koneksi non-SSL dengan enkripsi TLS/SSL — mengamankan protokol lama atau membuat SSL tunnel.', cmd: 'stunnel /etc/stunnel/stunnel.conf', tag: 'Active' }
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
        <span class="text-xl">🌐</span>
        <h2 class="text-lg md:text-xl font-bold text-white tracking-wide">
          Networking & Pivoting
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

<script setup>
import { ref } from 'vue'

const isExpanded = ref(true)
const copiedIndex = ref(null)

const copyCommand = (cmd, index) => {
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
  // Aircrack-ng Suite
  { name: 'airmon-ng', desc: 'Mengaktifkan/menonaktifkan monitor mode pada wireless interface dan mematikan proses yang dapat mengganggu capture paket.', cmd: 'sudo airmon-ng start wlan0', tag: 'Active' },
  { name: 'airodump-ng', desc: 'Capture paket WiFi raw dan menampilkan info AP sekitar: SSID, BSSID, channel, enkripsi, power signal, dan daftar client terhubung.', cmd: 'sudo airodump-ng wlan0mon', tag: 'Active' },
  { name: 'aireplay-ng', desc: 'Injeksi paket WiFi untuk berbagai serangan: deauthentication, fake authentication, ARP replay, fragmentation, dan chopchop attack.', cmd: 'sudo aireplay-ng -0 10 -a [BSSID] wlan0mon', tag: 'Offensive' },
  { name: 'aircrack-ng', desc: 'Crack WEP/WPA/WPA2 dari file capture handshake menggunakan dictionary attack — inti dari aircrack-ng suite.', cmd: 'sudo aircrack-ng -w wordlist.txt capture.cap', tag: 'Offensive' },
  { name: 'airbase-ng', desc: 'Membuat software access point palsu — digunakan untuk Evil Twin attack, honeypot, dan menangkap kredensial client.', cmd: 'sudo airbase-ng -e "FreeWifi" -c 6 wlan0mon', tag: 'Offensive' },
  { name: 'airdecap-ng', desc: 'Mendekripsi file capture WEP/WPA/WPA2 yang sudah diketahui keynya — berguna untuk analisis traffic terenkripsi.', cmd: 'airdecap-ng -p passphrase -e SSID capture.cap', tag: 'Analysis' },
  { name: 'airtun-ng', desc: 'Membuat virtual tunnel interface untuk memonitor traffic terenkripsi secara real-time atau injeksi paket ke jaringan WiFi.', cmd: 'sudo airtun-ng -a [BSSID] -p passphrase wlan0mon', tag: 'Active' },
  { name: 'packetforge-ng', desc: 'Membuat paket terenkripsi custom untuk injeksi — digunakan bersama aireplay-ng dalam serangan ARP replay dan fragmentation.', cmd: 'packetforge-ng -0 -a [BSSID] -h [src_mac] -k 255.255.255.255 -l 255.255.255.255 -y fragment.xor -w arp.cap', tag: 'Offensive' },
  { name: 'airserv-ng', desc: 'Server wireless card — memungkinkan akses ke wireless interface melalui jaringan sehingga bisa digunakan dari mesin lain.', cmd: 'sudo airserv-ng -p 666 -d wlan0mon', tag: 'Active' },
  { name: 'airolib-ng', desc: 'Mengelola dan menggunakan database ESSID/password untuk pre-compute PMK — mempercepat proses cracking WPA/WPA2.', cmd: 'airolib-ng db.sqlite --import essid ssid.txt && airolib-ng db.sqlite --batch', tag: 'Analysis' },
  { name: 'eaphammer', desc: 'Framework khusus untuk menyerang jaringan WiFi perusahaan (WPA2/WPA3 Enterprise) dengan membuat Rogue AP guna mencuri kredensial lewat EAP-TTLS atau PEAP.', cmd: 'sudo ./eaphammer -i wlan0 --eap-mode ttls --essid Enterprise_WiFi', tag: 'Offensive' },
  { name: 'fluxion', desc: 'Menjalankan serangan sosial engineering berbasis wireless (Evil Twin) dengan memutus koneksi target asli dan memaksa mereka memasukkan password di halaman login tiruan.', cmd: 'sudo ./fluxion.sh', tag: 'Offensive' },
  { name: 'besside-ng', desc: 'Bagian otomatis dari aircrack suite yang bekerja secara mandiri untuk memburu seluruh handshake WPA di sekitar secara massal tanpa intervensi user.', cmd: 'sudo besside-ng wlan0mon', tag: 'Active' },
  { name: 'pwnagotchi', desc: 'Alat berbasis AI (Deep Reinforcement Learning) yang secara pasif atau aktif mempelajari lingkungan radio untuk mengoptimalkan penangkapan handshake WPA/PMKID.', cmd: 'sudo pwnagotchi --manual', tag: 'Active' },
  { name: 'ghost-phisher', desc: 'Aplikasi berbasis GUI untuk meluncurkan pengujian keamanan wireless berupa fake DNS server, fake DHCP server, dan area phishing terintegrasi.', cmd: 'sudo ghost-phisher', tag: 'Offensive' },

  // PMKID & Capture
  { name: 'hcxdumptool', desc: 'Capture PMKID dari AP dan EAPOL handshake tanpa perlu menunggu client connect — metode paling efisien saat ini untuk WPA2.', cmd: 'sudo hcxdumptool -i wlan0mon -o capture.pcapng --active_beacon', tag: 'Active' },
  { name: 'hcxtools', desc: 'Suite konversi file capture WiFi: .cap → .hc22000 untuk hashcat, filtering, merging, dan analisis file pcap/pcapng.', cmd: 'hcxpcapngtool -o hashes.22000 capture.pcapng', tag: 'Analysis' },
  { name: 'hcxhashtool', desc: 'Filter, konversi, dan kelola hash WPA hasil hcxdumptool — menyortir hash berdasarkan ESSID, BSSID, dan status.', cmd: 'hcxhashtool -i hashes.22000 --info', tag: 'Analysis' },

  // Wireless Tambahan
  { name: 'airgeddon', desc: 'Framework audit WiFi all-in-one berbasis bash — menggabungkan semua serangan wireless populer dalam menu interaktif yang mudah digunakan, mencakup Evil Twin, PMKID attack, handshake capture, dan WPS attack secara terotomasi.', cmd: 'sudo bash airgeddon.sh', tag: 'Offensive' },
  { name: 'wigle', desc: 'Tool dan platform untuk wardriving — mencatat, mengupload, dan mencari data jaringan WiFi yang ditemukan secara geografis menggunakan database terbesar di dunia dengan lebih dari 900 juta jaringan yang telah dipetakan.', cmd: 'wigle-cmd --search --ssids "TargetWiFi"', tag: 'Passive' },
  { name: 'gqrx', desc: 'Software Defined Radio (SDR) receiver berbasis GNU Radio — memantau frekuensi radio secara real-time dari 50MHz hingga 2GHz menggunakan dongle RTL-SDR murah untuk monitoring spektrum wireless dan signal intelligence.', cmd: 'gqrx', tag: 'Passive' },
  { name: 'gr-gsm', desc: 'GNU Radio toolset untuk memonitor dan mendekode sinyal jaringan GSM — memungkinkan sniffing traffic GSM 2G menggunakan SDR untuk analisis protokol seluler dan keamanan jaringan telepon seluler generasi lama.', cmd: 'grgsm_livemon -f 935.2M', tag: 'Passive' },
  { name: 'ubertooth', desc: 'Platform open source untuk eksperimen dan riset Bluetooth — memungkinkan sniffing traffic Bluetooth Classic dan BLE secara pasif menggunakan hardware Ubertooth One untuk analisis protokol dan security research.', cmd: 'ubertooth-btle -f -c capture.pcap', tag: 'Passive' },
  { name: 'blueranger', desc: 'Script Python untuk menentukan jarak perangkat Bluetooth menggunakan RSSI (Received Signal Strength Indicator) — berguna untuk melacak dan memperkirakan posisi perangkat Bluetooth di sekitar lokasi pengujian.', cmd: 'sudo ./blueranger.sh hci0 [MAC_ADDRESS]', tag: 'Active' },
  { name: 'bluesnarfer', desc: 'Tool untuk melakukan BlueSnarf attack pada perangkat Bluetooth yang rentan — mengakses kontak, kalender, dan pesan dari perangkat yang tidak mengimplementasikan autentikasi Bluetooth dengan benar.', cmd: 'bluesnarfer -b [MAC_ADDRESS] -C 17', tag: 'Offensive' },
  { name: 'bluepot', desc: 'Bluetooth honeypot yang menarik koneksi Bluetooth masuk dan mencatat semua interaksi — membantu mengidentifikasi perangkat yang melakukan scanning atau serangan Bluetooth di sekitar area pengujian.', cmd: 'sudo java -jar bluepot.jar', tag: 'Defensive' },
  { name: 'rtl_433', desc: 'Tool decoder untuk sinyal radio 433MHz menggunakan RTL-SDR — mendekode transmisi dari sensor cuaca, remote pintu garasi, sensor IoT, dan perangkat wireless 433MHz lainnya yang banyak digunakan di rumah pintar.', cmd: 'rtl_433 -f 433.92M', tag: 'Passive' },
  { name: 'hackrf', desc: 'Software Defined Radio platform open source untuk transmisi dan penerimaan sinyal radio dari 1MHz hingga 6GHz — memungkinkan replay attack, signal jamming research, dan analisis protokol wireless pada berbagai frekuensi.', cmd: 'hackrf_info', tag: 'Active' },
  { name: 'rfcat', desc: 'Tool untuk penelitian sub-GHz RF menggunakan dongle YardStick One — mengirim dan menerima sinyal radio untuk analisis dan replay attack pada remote control, alarm, dan perangkat IoT yang beroperasi di frekuensi sub-GHz.', cmd: 'rfcat -i', tag: 'Offensive' },
  { name: 'nzyme', desc: 'WiFi defense system yang memonitor udara secara terus-menerus untuk mendeteksi ancaman wireless — mengenali rogue AP, evil twin, deauth flood, dan aktivitas mencurigakan lainnya di jaringan WiFi secara real-time.', cmd: 'sudo nzyme -c /etc/nzyme/nzyme.conf', tag: 'Defensive' },
  { name: 'lorcon', desc: 'Library C untuk injeksi paket WiFi tingkat rendah — menyediakan antarmuka generik untuk packet injection pada berbagai driver wireless, sering digunakan sebagai backend untuk tools wireless security testing lainnya.', cmd: 'lorcon-example -i wlan0mon -c 6', tag: 'Offensive' },
  { name: 'scapy-wifi', desc: 'Ekstresi Scapy untuk manipulasi paket WiFi — memungkinkan pembuatan, pengiriman, dan analisis frame 802.11 secara custom untuk riset keamanan wireless dan pengembangan tools serangan WiFi yang disesuaikan.', cmd: 'python3 -c "from scapy.all import *; pkt = RadioTap()/Dot11()/Dot11Beacon(); sendp(pkt, iface=\'wlan0mon\')"', tag: 'Offensive' },
  { name: 'wifi-pumpkin', desc: 'Framework rogue AP yang komprehensif — membuat access point palsu dengan fitur lengkap seperti captive portal, DHCP server, DNS spoofing, dan berbagai modul serangan MITM yang terintegrasi dalam satu platform.', cmd: 'sudo python3 wifi-pumpkin3.py', tag: 'Offensive' },

  // WPS Attack
  { name: 'reaver', desc: 'Eksploitasi kelemahan desain protokol WPS — brute force PIN 8 digit untuk mendapatkan passphrase WPA/WPA2 dalam hitungan jam.', cmd: 'sudo reaver -i wlan0mon -b [BSSID] -vv', tag: 'Offensive' },
  { name: 'bully', desc: 'WPS brute force alternatif Reaver dengan penanganan error lebih baik, recovery otomatis, dan kompatibilitas router lebih luas.', cmd: 'sudo bully wlan0mon -b [BSSID] -d', tag: 'Offensive' },
  { name: 'pixiewps', desc: 'Eksploitasi WPS Pixie Dust attack — memanfaatkan kelemahan entropi rendah pada beberapa chipset untuk crack WPS offline dalam detik.', cmd: 'sudo pixiewps -e [PKE] -r [PKR] -s [E-Hash1] -z [E-Hash2] -a [AuthKey]', tag: 'Offensive' },
  { name: 'oneshot', desc: 'WPS Pixie Dust dan PIN brute force dalam satu tool — tidak memerlukan monitor mode, lebih mudah digunakan dari Reaver.', cmd: 'python3 oneshot.py -i wlan0 -b [BSSID] -K', tag: 'Offensive' },
  { name: 'cowpatty', desc: 'Offline dictionary attack terhadap WPA/WPA2 menggunakan pre-computed hash tables untuk percepatan proses cracking.', cmd: 'cowpatty -f wordlist.txt -r capture.cap -s SSID', tag: 'Offensive' },
  { name: 'asleap', desc: 'Recovery password dari protokol LEAP Cisco dan traffic PPTP dengan mengeksploitasi kelemahan hash MS-CHAPv2.', cmd: 'asleap -r capture.cap -W wordlist.txt', tag: 'Offensive' },
  { name: 'wifiphisher', desc: 'Rogue Access Point framework untuk melancarkan serangan phising kredensial WiFi tanpa melakukan cracking.', cmd: 'sudo wifiphisher -aI wlan0 -jI wlan1 -p firmware-upgrade', tag: 'Offensive' },
  { name: 'bluelog', desc: 'Bluetooth scanner dan logger yang didesain untuk surveilans perangkat statis dengan output yang mudah dibaca mesin.', cmd: 'sudo bluelog -i hci0 -o log.txt -v', tag: 'Passive' },

  // Automation & GUI
  { name: 'wifite', desc: 'Otomasi serangan WiFi — scan, pilih target, capture handshake WPA/WPA2, serang WPS, dan crack secara otomatis tanpa intervensi.', cmd: 'sudo wifite --wpa', tag: 'Offensive' },
  { name: 'wifite2', desc: 'Versi rewrite modern dari wifite dengan dukungan PMKID attack, pixiedust, dan integrasi hashcat yang lebih baik.', cmd: 'sudo wifite2 --wpa --dict wordlist.txt', tag: 'Offensive' },
  { name: 'fern wifi cracker', desc: 'GUI tool Python/Qt untuk audit WiFi — menyederhanakan seluruh workflow cracking WEP/WPA/WPS melalui antarmuka visual.', cmd: 'sudo fern-wifi-cracker', tag: 'Offensive' },
  { name: 'waidps', desc: 'Wireless Auditing, Intrusion Detection, dan Prevention System — memonitor jaringan WiFi dan mendeteksi serangan secara pasif.', cmd: 'sudo python3 waidps.py', tag: 'Defensive' },

  // Detection & Monitoring
  { name: 'kismet', desc: 'Wireless network detector, sniffer, dan IDS pasif — mendeteksi AP tersembunyi (hidden SSID), probe request, dan anomali jaringan.', cmd: 'sudo kismet -c wlan0', tag: 'Passive' },
  { name: 'wavemon', desc: 'Monitor wireless interface secara real-time di terminal — menampilkan signal strength, noise, bitrate, dan statistik koneksi.', cmd: 'wavemon', tag: 'Passive' },
  { name: 'iw', desc: 'Utility konfigurasi wireless Linux modern — mengelola interface, scan jaringan, set channel, dan konfigurasi monitor mode.', cmd: 'iw dev wlan0 scan | grep SSID', tag: 'Active' },
  { name: 'wifi-honey', desc: 'Membuat multiple fake AP honeypot secara bersamaan untuk menangkap probe request dan menganalisis device di sekitarnya.', cmd: 'sudo wifi-honey "FreeWifi" 6 wlan0', tag: 'Passive' },

  // DoS & Flooding
  { name: 'mdk4', desc: 'WiFi stress testing komprehensif: beacon flood, deauth DoS massal, SSID confusion, WIDS confusion, dan Michael MIC exploit.', cmd: 'sudo mdk4 wlan0mon b', tag: 'Offensive' },
  { name: 'mdk3', desc: 'Versi sebelumnya dari mdk4 — beacon flooding, authentication DoS, dan probing untuk stress test jaringan WiFi.', cmd: 'sudo mdk3 wlan0mon b -s 100', tag: 'Offensive' },

  // Bluetooth
  { name: 'btscanner', desc: 'Scanner Bluetooth untuk menemukan perangkat di sekitar — mengekstrak informasi nama, kelas, dan layanan yang tersedia.', cmd: 'sudo btscanner', tag: 'Passive' },
  { name: 'bluez', desc: 'Stack Bluetooth Linux resmi — menyediakan tools seperti hciconfig, hcitool, sdptool untuk interaksi dan audit perangkat Bluetooth.', cmd: 'sudo hciconfig hci0 up && sudo hcitool scan', tag: 'Active' },
  { name: 'spooftooph', desc: 'Spoofing nama dan kelas perangkat Bluetooth — menyamar sebagai perangkat lain untuk menghindari deteksi atau mengelabui target.', cmd: 'sudo spooftooph -i hci0 -n "Target Device" -a 00:11:22:33:44:55', tag: 'Offensive' },
  { name: 'crackle', desc: 'Crack enkripsi Bluetooth Low Energy (BLE) — mengeksploitasi kelemahan key exchange pada pairing BLE untuk dekripsi traffic.', cmd: 'crackle -i ble_capture.pcap -o decrypted.pcap', tag: 'Offensive' }
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
        <span class="text-xl">📡</span>
        <h2 class="text-lg md:text-xl font-bold text-white tracking-wide">
          Wireless Attacks
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
        <div class="mt-2 pt-3 border-t border-gray-800/60">
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

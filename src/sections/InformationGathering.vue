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

const tools = ref([
  // Network Scanning
  { name: 'nmap', desc: 'Network scanner utama — menemukan host aktif, port terbuka, service version, OS detection, dan scripting engine (NSE) untuk audit jaringan.', cmd: 'sudo nmap -sV -O 192.168.1.1', tag: 'Active' },
  { name: 'masscan', desc: 'Port scanner tercepat — mampu scan seluruh internet dalam hitungan menit menggunakan transmisi paket asinkron tanpa menunggu respons.', cmd: 'sudo masscan -p1-65535 192.168.1.0/24 --rate=1000', tag: 'Active' },
  { name: 'naabu', desc: 'Port scanner tertulis dalam Go yang fokus pada kecepatan luar biasa dan keandalan tinggi, sangat mudah diintegrasikan dengan tools recon lainnya.', cmd: 'naabu -host target.com -p 80,443,8080', tag: 'Active' },
  { name: 'katana', desc: 'Web crawling dan spidering framework modern generasi baru yang sangat cepat, mendukung headless browser crawling untuk aplikasi web berbasis SPA/Javascript.', cmd: 'katana -u https://target.com -d 3 -o output.txt', tag: 'Active' },
  { name: 'netdiscover', desc: 'ARP scanner aktif/pasif untuk menemukan host di jaringan lokal. Bekerja efektif di jaringan tanpa DHCP sekalipun.', cmd: 'sudo netdiscover -r 192.168.1.0/24', tag: 'Active' },
  { name: 'unicornscan', desc: 'Port scanner asinkron dengan kemampuan fingerprinting OS dan service — lebih ringan dari nmap untuk scan skala besar.', cmd: 'sudo unicornscan -mT 192.168.1.1:a', tag: 'Active' },
  { name: 'angry ip scanner', desc: 'Scanner IP dan port GUI yang ringan dan cepat — mudah digunakan untuk scanning jaringan lokal secara visual.', cmd: 'ipscan 192.168.1.1-192.168.1.254', tag: 'Active' },
  { name: 'zmap', desc: 'Internet-wide network scanner single-packet yang dirancang untuk riset keamanan skala besar dengan kecepatan tinggi.', cmd: 'sudo zmap -p 80 192.168.1.0/24 -o results.txt', tag: 'Active' },
  { name: 'hping3', desc: 'Packet crafter TCP/IP yang dapat digunakan untuk port scanning, firewall testing, OS fingerprinting, dan traceroute lanjutan.', cmd: 'sudo hping3 -S -p 80 target.com', tag: 'Active' },
  { name: 'p0f', desc: 'OS fingerprinting pasif — mengidentifikasi OS dan konfigurasi host tanpa mengirim satu paket pun ke target.', cmd: 'sudo p0f -i eth0 -p', tag: 'Passive' },

  // DNS Tools
  { name: 'dnsenum', desc: 'Enumerasi DNS lengkap: zone transfer, MX/NS records, subdomain brute force, dan reverse lookup otomatis.', cmd: 'dnsenum target.com', tag: 'Active' },
  { name: 'dnsrecon', desc: 'Reconnaissance DNS lanjutan: SRV records, zone walking DNSSEC, cache snooping, wildcard detection, dan Google enumeration.', cmd: 'dnsrecon -d target.com -t std', tag: 'Active' },
  { name: 'fierce', desc: 'DNS brute force semi-lightweight untuk menemukan subdomain dan non-contiguous IP space yang tidak terdaftar publik.', cmd: 'fierce --domain target.com', tag: 'Active' },
  { name: 'dnsx', desc: 'DNS toolkit cepat multi-purpose — bulk resolution, wildcard filtering, dan query berbagai record type secara bersamaan.', cmd: 'cat subdomains.txt | dnsx -a -cname', tag: 'Active' },
  { name: 'dnsmap', desc: 'Subdomain brute force menggunakan built-in wordlist — menemukan host tersembunyi yang terkait dengan domain target.', cmd: 'dnsmap target.com', tag: 'Active' },
  { name: 'dnstracer', desc: 'Melacak rantai DNS resolver dari root hingga authoritative server untuk debugging dan analisis infrastruktur DNS.', cmd: 'dnstracer target.com', tag: 'Passive' },
  { name: 'dnstwist', desc: 'Deteksi domain phishing dan typosquatting — menghasilkan variasi nama domain dan cek mana yang sudah didaftarkan.', cmd: 'dnstwist target.com', tag: 'Passive' },

  // WHOIS & Domain
  { name: 'whois', desc: 'Mengambil informasi registrasi domain: pemilik, registrar, tanggal expiry, name server, dan detail kontak admin/teknis.', cmd: 'whois target.com', tag: 'Passive' },
  { name: 'dmitry', desc: 'Deepmagic Information Gathering Tool — whois, uptime, subdomain, email, dan port scan dalam satu tool terintegrasi.', cmd: 'dmitry -winsepo output.txt target.com', tag: 'Passive' },
  { name: 'domainfy', desc: 'Enumerasi domain menggunakan berbagai TLD dan ccTLD untuk menemukan semua variasi domain yang dimiliki suatu entitas.', cmd: 'domainfy -n target -t all', tag: 'Passive' },

  // OSINT Frameworks
  { name: 'maltego', desc: 'Platform visual intelligence untuk memetakan relasi antara domain, IP, email, sosmed, dan entitas lainnya secara grafis interaktif.', cmd: 'maltego', tag: 'Passive' },
  { name: 'recon-ng', desc: 'Framework web reconnaissance modular seperti Metasploit — otomasi pengumpulan OSINT dari berbagai sumber dengan modul yang dapat dikembangkan.', cmd: 'recon-ng -w workspace1', tag: 'Passive' },
  { name: 'spiderfoot', desc: 'Otomasi OSINT dengan 200+ modul — mengumpulkan data dari ratusan sumber publik dan menghasilkan laporan visualisasi relasi.', cmd: 'spiderfoot -s target.com -t all', tag: 'Passive' },
  { name: 'osrframework', desc: 'Framework OSINT untuk username enumeration di 300+ platform sosial media dan situs web secara bersamaan.', cmd: 'usufy -n username -p twitter facebook', tag: 'Passive' },
  { name: 'sherlock', desc: 'Mencari username di 300+ situs sosial media sekaligus — menemukan akun yang dimiliki seseorang di berbagai platform.', cmd: 'sherlock username', tag: 'Passive' },
  { name: 'holehe', desc: 'Cek apakah email terdaftar di 120+ website seperti Twitter, Instagram, GitHub tanpa mengirim email verifikasi.', cmd: 'holehe target@email.com', tag: 'Passive' },

  // Email & People
  { name: 'theHarvester', desc: 'Mengumpulkan email, subdomain, nama, IP, dan URL dari search engine publik: Google, Bing, Shodan, Hunter, dan lainnya.', cmd: 'theHarvester -d target.com -b google', tag: 'Passive' },
  { name: 'emailharvester', desc: 'Harvest email address dari domain tertentu menggunakan berbagai search engine dan teknik scraping.', cmd: 'emailharvester -d target.com -e all', tag: 'Passive' },
  { name: 'infoga', desc: 'Pengumpulan informasi email menggunakan berbagai sumber publik — cek validitas, server, dan informasi terkait alamat email.', cmd: 'infoga --domain target.com --source all', tag: 'Passive' },
  
  // Network Discovery Tambahan
  { name: 'rustscan', desc: 'Port scanner ultra-cepat berbasis Rust yang bisa scan semua 65535 port dalam hitungan detik — dirancang sebagai wrapper Nmap modern.', cmd: 'rustscan -a 192.168.1.1 -- -sV', tag: 'Active' },
  { name: 'sx', desc: 'Network scanner asinkron generasi baru berbasis Go yang fokus pada kecepatan ekstrem untuk ARP, ICMP, TCP SYN, dan UDP scanning.', cmd: 'sx arp 192.168.1.0/24', tag: 'Active' },
  { name: 'netcat (nc)', desc: 'Swiss army knife jaringan klasik yang juga bisa digunakan untuk banner grabbing dan identifikasi service.', cmd: 'nc -v target.com 80', tag: 'Active' },
  { name: 'knock', desc: 'Tool port knocking untuk membuka port tersembunyi di firewall dengan mengirimkan sequence paket ke port tertentu secara berurutan.', cmd: 'knock target.com 1234 5678 9012', tag: 'Active' },

  // OSINT Tambahan
  { name: 'maigret', desc: 'OSINT username checker generasi baru yang lebih canggih dari Sherlock — mencari akun di 3000+ situs web sekaligus.', cmd: 'maigret username', tag: 'Passive' },
  { name: 'socialscan', desc: 'Cek ketersediaan username dan email di berbagai platform media sosial secara akurat menggunakan API resmi.', cmd: 'socialscan username email@target.com', tag: 'Passive' },
  { name: 'blackbird', desc: 'OSINT tool untuk pencarian akun berdasarkan username di 500+ platform secara bersamaan.', cmd: 'python3 blackbird.py -u username', tag: 'Passive' },
  { name: 'ghunt', desc: 'OSINT tool khusus untuk menginvestigasi akun Google — mengekstrak informasi tersembunyi dari akun Gmail.', cmd: 'ghunt email target@gmail.com', tag: 'Passive' },
  { name: 'twint', desc: 'Twitter OSINT tool tanpa API — scraping tweet, follower, following, dan informasi akun Twitter secara mendalam.', cmd: 'twint -u username --tweets', tag: 'Passive' },
  { name: 'instaloader', desc: 'Download dan analisis konten Instagram secara mendalam — mengunduh foto, video, stories, highlights, dan metadata.', cmd: 'instaloader profile username', tag: 'Passive' },
  { name: 'phoneinfoga', desc: 'Framework OSINT khusus untuk investigasi nomor telepon — mencari informasi operator, negara asal, dan keberadaan nomor.', cmd: 'phoneinfoga scan -n +6281234567890', tag: 'Passive' },
  { name: 'email2phonenumber', desc: 'Teknik OSINT untuk menemukan nomor telepon yang terhubung ke alamat email target.', cmd: 'python3 email2phonenumber.py -e target@email.com', tag: 'Passive' },

  // DNS & Domain Tambahan
  { name: 'puredns', desc: 'DNS resolver dan brute force tool yang sangat cepat dan akurat dengan kemampuan wildcard filtering otomatis.', cmd: 'puredns bruteforce wordlist.txt target.com', tag: 'Active' },
  { name: 'massdns', desc: 'DNS resolver massal berkecepatan tinggi yang mampu melakukan jutaan query DNS per menit.', cmd: 'massdns -r resolvers.txt -t A domains.txt -o S', tag: 'Active' },
  { name: 'alterx', desc: 'Generator permutasi subdomain yang cerdas — membuat variasi nama subdomain berdasarkan pola yang ditemukan.', cmd: 'cat subdomains.txt | alterx | dnsx', tag: 'Active' },
  { name: 'dnsprobe', desc: 'DNS probing tool cepat berbasis Go untuk memvalidasi dan mengumpulkan informasi DNS record dari daftar domain.', cmd: 'cat domains.txt | dnsprobe -r A', tag: 'Active' },
  { name: 'subzy', desc: 'Subdomain takeover checker — memverifikasi apakah subdomain yang ditemukan rentan terhadap subdomain takeover.', cmd: 'subzy run --targets subdomains.txt', tag: 'Passive' },
  { name: 'subjack', desc: 'Tool deteksi subdomain takeover yang cepat — mengecek apakah subdomain yang mengarah ke layanan pihak ketiga sudah tidak diklaim.', cmd: 'subjack -w subdomains.txt -t 100 -o output.txt', tag: 'Passive' },

  // Web Recon Tambahan
  { name: 'httpx', desc: 'HTTP toolkit serbaguna berbasis Go yang sangat cepat — melakukan probing massal terhadap daftar URL.', cmd: 'cat domains.txt | httpx -status-code -title -tech-detect', tag: 'Active' },
  { name: 'gowitness', desc: 'Web screenshot utility berbasis Chrome headless — mengambil screenshot otomatis dari ratusan URL sekaligus.', cmd: 'gowitness file -f urls.txt', tag: 'Active' },
  { name: 'urlhunter', desc: 'Recon tool yang memanfaatkan arsip URL publik dari berbagai sumber seperti Common Crawl.', cmd: 'urlhunter -keywords keywords.txt -date 2024-01-01', tag: 'Passive' },
  { name: 'photon', desc: 'Web crawler OSINT yang cepat dan powerful — mengekstrak URL, endpoint, email, nomor telepon, dan data sensitif.', cmd: 'python3 photon.py -u https://target.com -l 3', tag: 'Passive' },
  { name: 'linkfinder', desc: 'Menemukan endpoint dan URL tersembunyi di dalam file JavaScript — menganalisis kode JS dari aplikasi web.', cmd: 'python3 linkfinder.py -i https://target.com/app.js -o cli', tag: 'Passive' },
  { name: 'secretfinder', desc: 'Scanner file JavaScript untuk menemukan informasi sensitif seperti API key, token, dan password.', cmd: 'python3 secretfinder.py -i https://target.com/app.js -o cli', tag: 'Passive' },

  // Infrastructure Recon
  { name: 'cloudrecon', desc: 'Reconnaissance tool untuk mengidentifikasi infrastruktur cloud yang digunakan target.', cmd: 'cloudrecon -d target.com', tag: 'Passive' },
  { name: 'asnmap', desc: 'Tool mapping Autonomous System Number (ASN) ke rentang IP yang dimiliki suatu organisasi.', cmd: 'asnmap -org "Target Company"', tag: 'Passive' },
  { name: 'metabigor', desc: 'Tool OSINT untuk mendapatkan informasi jaringan tanpa memerlukan API key.', cmd: 'echo "target" | metabigor net --org', tag: 'Passive' },
  { name: 'bgp-toolkit', desc: 'Investigasi infrastruktur jaringan menggunakan data BGP publik.', cmd: 'bgp-toolkit -a AS12345', tag: 'Passive' },

  // Windows & SMB Recon
  { name: 'enum4linux-ng', desc: 'Versi rewrite modern dari enum4linux berbasis Python — enumerasi informasi dari sistem Windows dan Samba.', cmd: 'enum4linux-ng -A 192.168.1.1', tag: 'Active' },
  { name: 'nbtscan', desc: 'Scanner NetBIOS untuk jaringan lokal — menemukan nama NetBIOS, workgroup, dan MAC address.', cmd: 'nbtscan 192.168.1.0/24', tag: 'Active' },
  { name: 'ldapsearch', desc: 'Tool query LDAP untuk enumerasi informasi dari server Active Directory dan LDAP lainnya.', cmd: 'ldapsearch -x -H ldap://192.168.1.1 -b "dc=target,dc=com"', tag: 'Active' },
  { name: 'rpcclient', desc: 'Client untuk Microsoft RPC interface — memungkinkan enumerasi user, grup, share, dan printer.', cmd: 'rpcclient -U "" -N 192.168.1.1', tag: 'Active' },

  // Subdomain Discovery
  { name: 'amass', desc: 'Attack surface mapping komprehensif — subdomain enumeration aktif/pasif menggunakan DNS, scraping, dan CT logs.', cmd: 'amass enum -d target.com', tag: 'Passive' },
  { name: 'subfinder', desc: 'Subdomain discovery cepat menggunakan passive sources: VirusTotal, Censys, Shodan, CertSpotter, dll.', cmd: 'subfinder -d target.com -o output.txt', tag: 'Passive' },
  { name: 'assetfinder', desc: 'Menemukan domain dan subdomain yang terkait dengan target menggunakan berbagai sumber pasif.', cmd: 'assetfinder --subs-only target.com', tag: 'Passive' },
  { name: 'findomain', desc: 'Subdomain enumerator tercepat menggunakan certificate transparency dan berbagai API.', cmd: 'findomain -t target.com -u output.txt', tag: 'Passive' },
  { name: 'knockpy', desc: 'Subdomain scanner berbasis wordlist dengan kemampuan deteksi wildcard DNS dan integrasi VirusTotal.', cmd: 'knockpy target.com', tag: 'Active' },
  { name: 'enum4linux', desc: 'Enumerasi data dari sistem Windows dan Samba secara spesifik untuk menemukan user, share, dan policy.', cmd: 'enum4linux -a 192.168.1.1', tag: 'Active' },
  { name: 'smbmap', desc: 'Memetakan share SMB di seluruh domain, menampilkan izin akses drive, dan eksekusi command remote.', cmd: 'smbmap -H 192.168.1.1 -u guest', tag: 'Active' },
  { name: 'arp-scan', desc: 'Command-line tool untuk melakukan pemindaian jaringan lokal menggunakan paket ARP.', cmd: 'sudo arp-scan --localnet', tag: 'Active' },
  { name: 'snmp-check', desc: 'Otomasi pengumpulan informasi perangkat via protokol SNMP untuk membaca routing dan device info.', cmd: 'snmp-check 192.168.1.1 -c public', tag: 'Active' },
  { name: 'amap', desc: 'Application mapper generasi baru untuk mengidentifikasi aplikasi yang berjalan di port tertentu.', cmd: 'amap -bq 192.168.1.1 80 443', tag: 'Active' },

  // IoT & Internet Scanning
  { name: 'shodan', desc: 'CLI untuk Shodan search engine — menemukan perangkat IoT, server, kamera, ICS/SCADA.', cmd: 'shodan search "apache" --fields ip_str,port', tag: 'Passive' },
  { name: 'censys', desc: 'CLI untuk Censys search engine — pencarian sertifikat SSL, host, dan website.', cmd: 'censys search "target.com" --index-type hosts', tag: 'Passive' },
  { name: 'onesixtyone', desc: 'SNMP scanner cepat untuk menemukan device dengan community string default.', cmd: 'onesixtyone -c community.txt 192.168.1.0/24', tag: 'Active' },
  { name: 'snmpwalk', desc: 'Enumerasi SNMP untuk mengumpulkan informasi detail dari network device.', cmd: 'snmpwalk -v2c -c public 192.168.1.1', tag: 'Active' },

  // Web Recon
  { name: 'httprobe', desc: 'Mengambil daftar domain dan memvalidasi mana yang menjalankan HTTP/HTTPS server aktif.', cmd: 'cat domains.txt | httprobe', tag: 'Active' },
  { name: 'aquatone', desc: 'Visual inspection tool untuk domain — screenshot otomatis ratusan halaman web.', cmd: 'cat urls.txt | aquatone -out ./report', tag: 'Active' },
  { name: 'eyewitness', desc: 'Screenshot otomatis website, RDP, dan VNC endpoints.', cmd: 'eyewitness --web -f urls.txt --no-prompt', tag: 'Active' },
  { name: 'gospider', desc: 'Web spider cepat berbasis Go — crawling link, form, endpoint JS, dan subdomains.', cmd: 'gospider -s https://target.com -d 3', tag: 'Active' },
  { name: 'hakrawler', desc: 'Crawler web sederhana dan cepat untuk menemukan endpoint, parameter, dan link.', cmd: 'echo https://target.com | hakrawler -depth 3', tag: 'Active' },

  // Certificate & Infrastructure
  { name: 'sslscan', desc: 'Scan konfigurasi SSL/TLS server — mendeteksi cipher lemah, protokol usang, dan heartbleed.', cmd: 'sslscan target.com', tag: 'Active' },
  { name: 'sslyze', desc: 'Analisis konfigurasi SSL/TLS secara mendalam dengan output terstruktur.', cmd: 'sslyze target.com --regular', tag: 'Active' },
  { name: 'traceroute', desc: 'Melacak jalur paket dari sumber ke tujuan — mengidentifikasi hop dan latency.', cmd: 'traceroute target.com', tag: 'Active' },
  { name: 'ike-scan', desc: 'Menemukan dan fingerprint VPN server IPsec — mendeteksi konfigurasi IKE.', cmd: 'sudo ike-scan 192.168.1.1', tag: 'Active' }
])
</script>

<template>
  <section class="bg-[#121212] border border-gray-800/80 rounded-xl overflow-hidden transition-all duration-300">
    <!-- Header Section (Bisa di-toggle accordion) -->
    <button 
      @click="isExpanded = !isExpanded"
      class="w-full flex items-center justify-between p-5 bg-[#161616] hover:bg-[#1a1a1a] transition-colors border-b border-gray-800/50"
    >
      <div class="flex items-center gap-3">
        <span class="text-xl">🔍</span>
        <h2 class="text-lg md:text-xl font-bold text-white tracking-wide">
          Information Gathering
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
            <h3 class="font-bold text-lg text-white group-hover:text-[#42b883] transition-colors font-mono">
              {{ tool.name }}
            </h3>
            <span 
              class="text-[10px] px-2 py-0.5 font-bold uppercase rounded tracking-wider border"
              :class="tool.tag === 'Active' 
                ? 'bg-red-500/10 text-red-400 border-red-500/20' 
                : 'bg-blue-500/10 text-blue-400 border-blue-500/20'"
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

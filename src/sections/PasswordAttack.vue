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
    case 'analysis':
      return 'bg-amber-500/10 text-amber-400 border-amber-500/20'
    case 'active':
      return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
    default:
      return 'bg-blue-500/10 text-blue-400 border-blue-500/20'
  }
}

const tools = ref([
  // Hash Crackers & Utilities
  { name: 'hashcat', desc: 'GPU-accelerated password hash cracker. Mendukung 300+ algoritma hash dengan berbagai mode: dictionary, brute-force, rule-based, mask, dan combinator attack.', cmd: 'hashcat -m 0 hash.txt wordlist.txt', tag: 'Offensive' },
  { name: 'princeprocessor', desc: 'PRINCE algorithm wordlist generator untuk hashcat — kombinasi kata lebih cerdas dari brute force biasa.', cmd: 'pp64.bin --pw-min=8 < wordlist.txt | hashcat -m 0 hash.txt', tag: 'Analysis' },
  { name: 'kwprocessor', desc: 'Generate keyboard walk pattern (qwerty/azerty) sebagai kandidat password untuk hashcat.', cmd: 'kwp basechars/tiny.base keymaps/en-us.keymap routes/2-to-10-max-3-direction-changes.route', tag: 'Analysis' },
  { name: 'acccheck', desc: 'Brute force autentikasi Windows SMB share menggunakan wordlist username & password.', cmd: 'acccheck -t 192.168.1.1 -u admin -P wordlist.txt', tag: 'Offensive' },
  { name: 'gsecdump', desc: 'Dump credential dari Windows SAM, Active Directory, dan LSA secrets.', cmd: 'gsecdump -a', tag: 'Offensive' },
  { name: 'wce', desc: 'Windows Credential Editor — dump & modify autentikasi Windows langsung dari memori.', cmd: 'wce.exe -l', tag: 'Offensive' },
  { name: 'pcredz', desc: 'Ekstrak kredensial dari traffic jaringan live atau file pcap: FTP, HTTP, SMTP, NTLM, dll.', cmd: 'python3 PCredz.py -f capture.pcap', tag: 'Offensive' },
  { name: 'pack', desc: 'Analisis pola password dari wordlist & generate mask otomatis untuk hashcat.', cmd: 'python3 statsgen.py wordlist.txt -o masks.hcmask', tag: 'Analysis' },
  { name: 'maskprocessor', desc: 'Generate semua kombinasi karakter berdasarkan mask pattern untuk hashcat.', cmd: 'mp64.bin ?u?l?l?l?d?d?d?d', tag: 'Analysis' },
  { name: 'hashdeep', desc: 'Hashing massal file dengan MD5/SHA1/SHA256 & audit integritas.', cmd: 'hashdeep -r /target/directory -l', tag: 'Analysis' },
  { name: 'name-that-hash', desc: 'Identifikasi tipe hash modern, lebih akurat dari hashid, dengan confidence score.', cmd: 'nth -t "5f4dcc3b5aa765d61d8327deb882cf99"', tag: 'Analysis' },
  { name: 'haiti', desc: 'CLI hash identifier dengan output langsung kompatibel format hashcat/john.', cmd: 'haiti 5f4dcc3b5aa765d61d8327deb882cf99', tag: 'Analysis' },
  { name: 'kerbrute', desc: 'Melakukan brute force dan enumerasi akun secara cepat melalui protokol Kerberos di Active Directory tanpa memicu account lockout jika dikonfigurasi dengan benar.', cmd: 'kerbrute userenum users.txt -d domain.local', tag: 'Offensive' },
  { name: 'keepass2dump', desc: 'Mengekstrak master password secara langsung dari memori aplikasi pengelola kata sandi KeePass yang sedang terbuka (eksploitasi CVE spesifik).', cmd: 'python3 poc.py -d KeePass.DMP', tag: 'Offensive' },
  { name: 'statsprocessor', desc: 'Generator wordlist berbasis statistik posisi karakter dari orientasi bahasa untuk menyusun kandidat password dengan probabilitas tertinggi.', cmd: 'sp64.bin markov.hcstat2 ?u?l?l?l?d?d', tag: 'Analysis' },
  { name: 'zip2Jhon / 7z2Jhon', desc: 'Ekstraktor nilai hash dari file arsip yang terproteksi password (ZIP/7z) agar teks hash-nya bisa di-crack secara offline menggunakan John the Ripper.', cmd: 'zip2john archive.zip > hash.txt && john hash.txt', tag: 'Analysis' },
  { name: 'hashcat-utils', desc: 'Kumpulan utilitas pembantu untuk memanipulasi wordlist, menghitung kandidat password, dan melakukan optimasi mask attack pada hashcat.', cmd: 'combinator.bin wordlist1.txt wordlist2.txt', tag: 'Analysis' },
  { name: 'john', desc: 'John the Ripper — CPU-based password cracker klasik dengan auto-detection tipe hash, mode incremental, dan dukungan ratusan format hash.', cmd: 'john --wordlist=wordlist.txt hash.txt', tag: 'Offensive' },
  { name: 'ophcrack', desc: 'Windows password cracker berbasis rainbow table untuk hash LM dan NTLM. Tersedia versi LiveCD bootable.', cmd: 'ophcrack -t tables/ -f hashes.txt', tag: 'Offensive' },
  { name: 'rainbowcrack', desc: 'Crack password hash menggunakan pre-computed rainbow table — jauh lebih cepat dari brute force untuk hash tanpa salt.', cmd: 'rcrack . -h 5f4dcc3b5aa765d61d8327deb882cf99', tag: 'Offensive' },
  { name: 'hash-identifier', desc: 'Mengidentifikasi tipe algoritma hash dari string yang diberikan — membantu menentukan tool dan mode yang tepat untuk cracking.', cmd: 'hash-identifier', tag: 'Analysis' },
  { name: 'hashid', desc: 'Identifikasi tipe hash dengan akurasi lebih tinggi dari hash-identifier — mendukung 275+ jenis hash termasuk algoritma modern.', cmd: 'hashid -m 5f4dcc3b5aa765d61d8327deb882cf99', tag: 'Analysis' },
  { name: 'brutespray', desc: 'Menerima output Nmap GNMAP/XML dan secara otomatis meluncurkan brute force terhadap layanan yang ditemukan menggunakan Medusa.', cmd: 'brutespray --file nmap.gnmap', tag: 'Offensive' },
  { name: 'keimpx', desc: 'Mengecek validitas kredensial SMB dan melakukan pass-the-hash melintasi jaringan Windows.', cmd: 'python3 keimpx.py -f creds.txt -t 192.168.1.0/24', tag: 'Offensive' },
  { name: 'pth-toolkit', desc: 'Kumpulan tools untuk menjalankan perintah pada sistem Windows menggunakan metode Pass-The-Hash tanpa perlu password plaintext.', cmd: 'pth-winexe -U domain/user%aad3b:hash //192.168.1.1 cmd.exe', tag: 'Offensive' },
  { name: 'mimi-penguins', desc: 'Versi eksperimental terinspirasi mimikatz untuk mengekstrak kredensial dan kata sandi dari memori pada sistem operasi Linux.', cmd: 'python3 mimi-penguins.py --dump', tag: 'Offensive' },

  // Credential Dumping
  { name: 'lazagne', desc: 'Dump password tersimpan dari 60+ aplikasi: browser, wifi, database, git.', cmd: 'lazagne all', tag: 'Offensive' },
  { name: 'secretdump (impacket)', desc: 'Dump NTLM hash, LSA secrets, dan DPAPI secrets via SMB tanpa agent.', cmd: 'impacket-secretsdump domain/user:pass@192.168.1.1', tag: 'Offensive' },
  { name: 'dumpntlm', desc: 'Ekstrak NTLM hash dari traffic jaringan yang di-capture.', cmd: 'dumpntlm capture.pcap', tag: 'Offensive' },
  { name: 'pypykatz', desc: 'Implementasi Python dari mimikatz — parse LSASS dump secara offline.', cmd: 'pypykatz lsa minidump lsass.dmp', tag: 'Offensive' },
  { name: 'lsassy', desc: 'Remote dump LSASS dari memory secara otomatis via berbagai metode.', cmd: 'lsassy -d domain -u admin -p pass 192.168.1.1', tag: 'Offensive' },
  { name: 'donpapi', desc: 'Dump DPAPI secrets (wifi password, credential manager, browser) dari remote host.', cmd: 'donpapi collect -u admin -p pass -t 192.168.1.1', tag: 'Offensive' },

  // File & Archive Password
  { name: 'bruteforce-luks', desc: 'Brute force enkripsi disk LUKS Linux via dictionary atau brute force.', cmd: 'bruteforce-luks -f wordlist.txt /dev/sda1', tag: 'Offensive' },
  { name: 'bruteforce-salted-openSSL', desc: 'Crack file yang dienkripsi dengan openssl enc menggunakan wordlist.', cmd: 'bruteforce-salted-openssl -f wordlist.txt -c aes-256-cbc file.enc', tag: 'Offensive' },
  { name: 'bruteforce-wallet', desc: 'Brute force wallet Bitcoin/Ethereum yang terlupakan passwordnya.', cmd: 'bruteforce-wallet -f wordlist.txt wallet.dat', tag: 'Offensive' },
  { name: 'office2jhon', desc: 'Ekstrak hash dari file Word/Excel/PowerPoint untuk di-crack dengan John.', cmd: 'office2john document.docx > hash.txt && john hash.txt', tag: 'Analysis' },
  { name: 'pdf2jhon', desc: 'Ekstrak hash dari file PDF terproteksi untuk John the Ripper.', cmd: 'pdf2john protected.pdf > hash.txt && john hash.txt', tag: 'Analysis' },
  { name: 'ssh2jhon', desc: 'Konversi private key SSH yang terenkripsi ke format hash untuk John.', cmd: 'ssh2john id_rsa > hash.txt && john hash.txt', tag: 'Analysis' },
  { name: 'keepass2jhon', desc: 'Ekstrak hash dari database KeePass .kdbx untuk di-crack offline.', cmd: 'keepass2john database.kdbx > hash.txt && john hash.txt', tag: 'Analysis' },
  { name: 'bitlocker2jhon', desc: 'Ekstrak hash dari volume BitLocker untuk cracking dengan John.', cmd: 'bitlocker2john -i /dev/sda1 | head -1 > hash.txt && john hash.txt', tag: 'Analysis' },

  // Network Login Brute Force
  { name: 'hydra', desc: 'Network login brute force tercepat dan paling paralel. Mendukung 50+ protokol: SSH, FTP, HTTP, RDP, SMB, MySQL, Telnet, SMTP, dan lainnya.', cmd: 'hydra -l admin -P wordlist.txt ssh://192.168.1.1', tag: 'Offensive' },
  { name: 'thc-pptp-bruter', desc: 'Brute force autentikasi VPN PPTP secara paralel.', cmd: 'thc-pptp-bruter -u admin -w wordlist.txt 192.168.1.1', tag: 'Offensive' },
  { name: 'legba', desc: 'Multi-protocol credential tester modern (SSH, HTTP, FTP, dll) berbasis Rust.', cmd: 'legba ssh --username admin --password wordlist.txt --target 192.168.1.1:22', tag: 'Offensive' },
  { name: 'snmpbrute', desc: 'Brute force SNMP community string pada network device.', cmd: 'python3 snmpbrute.py -t 192.168.1.1 -f community.txt', tag: 'Offensive' },
  { name: 'smtp-user-enum', desc: 'Enumerasi username valid di SMTP server via VRFY/EXPN/RCPT.', cmd: 'smtp-user-enum -M VRFY -U users.txt -t 192.168.1.1', tag: 'Active' },
  { name: 'finger-user-enum', desc: 'Enumerasi username via protokol Finger yang masih aktif di sistem lama.', cmd: 'finger-user-enum -U users.txt -t 192.168.1.1', tag: 'Active' },
  { name: 'medusa', desc: 'Parallel brute force login modular dengan fokus kecepatan dan reliability — alternatif hydra untuk network authentication testing.', cmd: 'medusa -h 192.168.1.1 -u admin -P wordlist.txt -M ssh', tag: 'Offensive' },
  { name: 'ncrack', desc: 'Network authentication cracker dari tim Nmap — dirancang untuk kecepatan dan fleksibilitas testing RDP, SSH, FTP, dan layanan lainnya.', cmd: 'ncrack -p 22 --user admin -P wordlist.txt 192.168.1.1', tag: 'Offensive' },
  { name: 'patator', desc: 'Multi-purpose brute force tool modular — lebih fleksibel dari hydra dengan dukungan berbagai protokol dan opsi kustomisasi tinggi.', cmd: 'patator ssh_login host=192.168.1.1 user=admin password=FILE0 0=wordlist.txt', tag: 'Offensive' },
  { name: 'crowbar', desc: 'Brute force tool untuk protokol yang tidak didukung hydra — spesialisasi di OpenVPN, SSH key, RDP dengan NLA, dan VNC.', cmd: 'crowbar -b rdp -s 192.168.1.1/32 -u admin -C wordlist.txt', tag: 'Offensive' },
  { name: 'spray', desc: 'Password spraying tool — mencoba satu password ke banyak akun untuk menghindari account lockout policy.', cmd: 'spray -s ldap://192.168.1.1 -u users.txt -p Password123', tag: 'Offensive' },

  // Wordlist & Generator
  { name: 'expander', desc: 'Ekspansi wordlist dengan substitusi karakter dan kombinasi aturan.', cmd: 'expander -f wordlist.txt -o expanded.txt', tag: 'Analysis' },
  { name: 'duplicut', desc: 'Deduplikasi wordlist besar secara cepat tanpa load ke RAM penuh.', cmd: 'duplicut -t 4 wordlist.txt output.txt', tag: 'Analysis' },
  { name: 'lyricpass', desc: 'Buat wordlist dari lirik lagu berdasarkan artis — efektif untuk targeted attack.', cmd: 'python3 lyricpass.py -a "Artist Name" -o wordlist.txt', tag: 'Analysis' },
  { name: 'weakpass-tools', desc: 'Tools pendukung project Weakpass untuk download & kelola wordlist terbesar.', cmd: 'weakpass download --list rockyou2024', tag: 'Analysis' },
  { name: 'shortscan', desc: 'Generate variasi nama pendek (8.3 format) dari nama file/user sebagai wordlist.', cmd: 'shortscan https://target.com/', tag: 'Analysis' },
  { name: 'crunch', desc: 'Generator wordlist custom — membuat kombinasi karakter sesuai pola, panjang, charset, dan template yang ditentukan secara exhaustive.', cmd: 'crunch 8 8 abc123 -o wordlist.txt', tag: 'Analysis' },
  { name: 'cewl', desc: 'Spider website target dan buat custom wordlist dari kata-kata ditemukan. Efektif untuk targeted attack terhadap organisasi tertentu.', cmd: 'cewl https://target.com -w wordlist.txt', tag: 'Analysis' },
  { name: 'rsmangler', desc: 'Manipulasi dan permutasi wordlist — leet speak, append angka/simbol, reverse, duplicate, case variation, dan kombinasinya.', cmd: 'rsmangler --file wordlist.txt --output mangled.txt --leet', tag: 'Analysis' },
  { name: 'mentalist', desc: 'GUI tool untuk membuat wordlist dengan logika aturan — menyusun kombinasi kata berdasarkan pola yang dapat dikustomisasi.', cmd: 'mentalist', tag: 'Analysis' },
  { name: 'wordlistctl', desc: 'Fetch, install, update, dan kelola koleksi wordlist dari berbagai sumber — termasuk rockyou, seclist, dan ratusan wordlist populer.', cmd: 'wordlistctl fetch -l rockyou', tag: 'Analysis' },
  { name: 'cupp', desc: 'Common User Password Profiler — membuat wordlist targeted berdasarkan informasi personal target (nama, tanggal lahir, hewan peliharaan, dll).', cmd: 'cupp -i', tag: 'Analysis' },
  { name: 'pydictor', desc: 'Generator wordlist powerful — membuat dictionary dari kata dasar dengan aturan kombinasi leet, case, append, dan berbagai transformasi.', cmd: 'python3 pydictor.py -base d -len 6 8 -o wordlist.txt', tag: 'Analysis' },

  // Windows & File Specific
  { name: 'chntpw', desc: 'Reset atau bypass password akun Windows langsung dari registry SAM tanpa perlu tahu password lama — efektif via LiveCD.', cmd: 'chntpw -i SAM', tag: 'Offensive' },
  { name: 'samdump2', desc: 'Dump password hash dari file SAM Windows — mengekstrak hash NTLM untuk kemudian di-crack secara offline.', cmd: 'samdump2 SYSTEM SAM', tag: 'Offensive' },
  { name: 'fcrackzip', desc: 'Crack password file ZIP yang terenkripsi menggunakan brute force atau dictionary attack — mendukung ZIP enkripsi klasik.', cmd: 'fcrackzip -u -D -p wordlist.txt file.zip', tag: 'Offensive' },
  { name: 'pdfcrack', desc: 'Crack password proteksi file PDF dengan brute force atau dictionary — memulihkan user password dan owner password.', cmd: 'pdfcrack -f file.pdf -w wordlist.txt', tag: 'Offensive' },
  { name: 'rarcrack', desc: 'Crack password arsip RAR, ZIP, dan 7-ZIP menggunakan brute force — mendukung multi-thread untuk percepatan.', cmd: 'rarcrack archive.rar --threads 4 --type rar', tag: 'Offensive' },
  { name: 'truecrack', desc: 'Brute force password volume TrueCrypt menggunakan GPU NVIDIA CUDA untuk akselerasi cracking enkripsi disk.', cmd: 'truecrack -t volume.tc -w wordlist.txt', tag: 'Offensive' },

  // WiFi Password
  { name: 'aircrack-ng', desc: 'Suite audit WiFi — crack WEP/WPA/WPA2 dari file capture handshake menggunakan dictionary attack berbasis CPU.', cmd: 'aircrack-ng -w wordlist.txt capture.cap', tag: 'Offensive' }
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
        <span class="text-xl">🔐</span>
        <h2 class="text-lg md:text-xl font-bold text-white tracking-wide">
          Password Attacks
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

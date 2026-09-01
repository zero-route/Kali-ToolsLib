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
  { name: 'pacu', desc: 'Framework eksploitasi AWS open-source yang dirancang untuk menguji ketahanan modul kebijakan, eskalasi hak akses, dan kompromi data di cloud.', cmd: 'pacu', tag: 'Offensive' },
  { name: 'awscli', desc: 'Interface command-line resmi dari AWS; penting digunakan oleh pentester cloud untuk manajemen dan eksploitasi layanan.', cmd: 'aws s3 ls s3://bucket-name && aws iam list-users', tag: 'Analysis' },
  { name: 's3scanner', desc: 'Memindai daftar bucket AWS S3 publik, menilai konfigurasi izin aksesnya, dan mengunduh konten yang terekspos secara massal.', cmd: 's3scanner scan --buckets buckets.txt', tag: 'Active' },
  { name: 'cloudsplaining', desc: 'Tool evaluasi IAM (Identity and Access Management) AWS untuk mengidentifikasi celah privilege escalation melalui kebijakan.', cmd: 'cloudsplaining download --profile default', tag: 'Analysis' },
  { name: 'prowler', desc: 'Tool CLI untuk AWS, Azure, dan GCP guna melakukan penilaian keamanan, audit kepatuhan standar industri (CIS), serta pengerasan sistem.', cmd: 'prowler -g cislevel2', tag: 'Defensive' },
  { name: 'scoutsuite', desc: 'Multi-cloud security auditing tool yang memindai postur keamanan lingkungan cloud publik dan menyusun hasilnya dalam laporan HTML interaktif.', cmd: 'python3 scout.py aws --profile default', tag: 'Analysis' },
  { name: 'cloudbrute', desc: 'Mencari infrastruktur perusahaan yang terekspos di penyedia cloud besar (AWS, Azure, Google) seperti bucket penyimpanan, aplikasi, dan fungsi API.', cmd: 'cloudbrute -d target.com -k keyword', tag: 'Active' },
  { name: 'cloudfox', desc: 'Tool otomatisasi reconnaissance untuk lingkungan cloud publik, membantu penetrasi tester menemukan jalur penyerangan potensial dengan cepat.', cmd: 'cloudfox aws --profile default all-checks', tag: 'Analysis' },
  { name: 'trufflehog', desc: 'Memindai repositori dan file konfigurasi cloud untuk menemukan rahasia yang tidak sengaja bocor, seperti kunci API, token, dan kata sandi.', cmd: 'trufflehog git https://github.com/target/repo', tag: 'Defensive' },
  { name: 'azurehound', desc: 'BloodHound collector untuk Azure Active Directory — mengumpulkan data relasi antara user, grup, service principal, dan resource Azure untuk divisualisasikan sebagai jalur serangan privilege escalation di lingkungan cloud Microsoft.', cmd: 'python3 azurehound.py -u user@domain.com -p pass', tag: 'Offensive' },
  { name: 'stormspotter', desc: 'Tool visualisasi attack surface Azure dari Microsoft — memetakan relasi antara resource Azure AD dan Azure Resource Manager untuk menemukan jalur privilege escalation dan lateral movement di lingkungan cloud Azure.', cmd: 'python3 stormspotter.py --tenant tenant-id', tag: 'Analysis' },
  { name: 'gcp-scanner', desc: 'Scanner keamanan untuk Google Cloud Platform — mendeteksi misconfiguration pada resource GCP seperti bucket storage yang terbuka, IAM permission berlebihan, firewall rules lemah, dan service account yang tidak aman.', cmd: 'python3 gcp-scanner.py --project project-id', tag: 'Active' },
  { name: 'cartography', desc: 'Tool pemetaan infrastruktur cloud menggunakan graph database Neo4j — mengumpulkan dan memvisualisasikan relasi antara semua resource AWS, GCP, dan Azure untuk menemukan jalur serangan dan misconfiguration tersembunyi.', cmd: 'cartography --neo4j-uri bolt://localhost:7687', tag: 'Analysis' },
  { name: 'cloud-custodian', desc: 'Rules engine untuk cloud security dan compliance — mendefinisikan kebijakan keamanan sebagai kode YAML untuk secara otomatis mendeteksi dan meremediation misconfiguration pada AWS, Azure, dan GCP secara real-time.', cmd: 'custodian run --output-dir output policy.yml', tag: 'Defensive' },
  { name: 'enumerate-iam', desc: 'Tool enumerasi permission IAM AWS — menguji setiap permission yang tersedia menggunakan kredensial yang ditemukan untuk menentukan hak akses apa saja yang dimiliki, langkah kritis setelah mendapatkan AWS access key dari target.', cmd: 'enumerate-iam --access-key AKIA... --secret-key ...', tag: 'Offensive' },
  { name: 'weirdaalhound', desc: 'Tool untuk menemukan jalur privilege escalation di AWS IAM — menganalisis kebijakan IAM yang kompleks dan menemukan kombinasi permission yang secara tidak langsung memungkinkan eskalasi hak akses ke admin.', cmd: 'python3 weirdAALhound.py -a access-key -s secret-key', tag: 'Analysis' },
  { name: 'cloud_enum', desc: 'Multi-cloud OSINT tool — mencari resource cloud yang terpublik dari AWS, Azure, dan GCP berdasarkan nama perusahaan atau keyword target, menemukan bucket S3, blob storage, dan cloud function yang terekspos.', cmd: 'cloud_enum -k targetcompany', tag: 'Passive' },
  { name: 'lambda-guard', desc: 'Security scanner untuk AWS Lambda functions — menganalisis kode Lambda dan konfigurasinya untuk menemukan kerentanan seperti injection vulnerability, excessive permissions, hardcoded credentials, dan insecure dependencies.', cmd: 'lambda-guard scan --function function-name --region us-east-1', tag: 'Analysis' },
  { name: 'kubernetes-goat', desc: 'Platform pembelajaran keamanan Kubernetes — menyediakan environment Kubernetes yang sengaja rentan untuk mempelajari berbagai teknik serangan container dan Kubernetes seperti escape, privilege escalation, dan lateral movement.', cmd: 'kubectl apply -f kubernetes-goat.yaml', tag: 'Analysis' },
  { name: 'cloudtrail-anomaly', desc: 'Tool deteksi anomali berbasis AWS CloudTrail — menganalisis log aktivitas AWS untuk menemukan pola akses tidak biasa, API call mencurigakan, dan indikasi kompromis akun cloud secara otomatis.', cmd: 'cloudtrail-anomaly --log-group cloudtrail --region us-east-1', tag: 'Defensive' },
  { name: 'gcp-iam-analyzer', desc: 'Analyzer permission IAM Google Cloud Platform — memetakan seluruh hak akses service account dan user di GCP untuk menemukan overprivileged identity dan jalur privilege escalation tersembunyi.', cmd: 'python3 gcp-iam-analyzer.py --project project-id', tag: 'Analysis' },
  { name: 'kube-hunter', desc: 'Tool hunting kerentanan di cluster Kubernetes — memindai cluster dari perspektif attacker untuk menemukan misconfiguration, API yang terekspos, dan kerentanan yang dapat dieksploitasi untuk eskalasi hak akses atau escape dari container.', cmd: 'kube-hunter --remote 192.168.1.1', tag: 'Active' }
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
        <span class="text-xl">☁️</span>
        <h2 class="text-lg md:text-xl font-bold text-white tracking-wide">
          Cloud Security
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

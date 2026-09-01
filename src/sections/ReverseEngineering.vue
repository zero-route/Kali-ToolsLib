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
  { name: 'ghidra', desc: 'Framework reverse engineering dari NSA — disassembler, decompiler, dan analisis binary untuk berbagai arsitektur CPU.', cmd: 'ghidra', tag: 'Analysis' },
  { name: 'ltrace', desc: 'Memonitor eksekusi program untuk mencegat dan mencatat semua panggilan dinamis ke pustaka (library calls).', cmd: 'ltrace ./program', tag: 'Analysis' },
  { name: 'strace', desc: 'Alat debugging dan diagnostik handal untuk mencegat dan melacak semua panggilan sistem (system calls) dari aplikasi ke kernel.', cmd: 'strace -e trace=file ./program', tag: 'Analysis' },
  { name: 'valgrind', desc: 'Framework instrumentasi program untuk debugging profil memori — sangat berguna mencari memory leaks pada C/C++.', cmd: 'valgrind --leak-check=full ./program', tag: 'Analysis' },
  { name: 'x64dbg', desc: 'Debugger GUI open-source populer untuk Windows (dijalankan via Wine di Kali) yang optimal untuk binary reverse engineering.', cmd: 'wine x64dbg.exe', tag: 'Analysis' },
  { name: 'plasma', desc: 'Interactive disassembler interaktif untuk arsitektur x86/ARM/MIPS, mampu merekonstruksi fungsi dengan pewarnaan sintaks.', cmd: 'plasma ./binary', tag: 'Analysis' },
  
  // Disassembler & Decompiler
  { name: 'binary ninja', desc: 'Platform reverse engineering komersial modern dengan API Python yang sangat powerful — menyediakan disassembler, decompiler tingkat menengah, dan analisis binary otomatis yang banyak digunakan oleh professional malware analyst dan CTF player.', cmd: 'binaryninja', tag: 'Analysis' },
  { name: 'cutter', desc: 'GUI frontend modern untuk Radare2 berbasis Qt — menyediakan antarmuka visual yang intuitif untuk semua fitur Radare2 termasuk disassembly, graph view, debugging, dan scripting tanpa perlu menghafal command Radare2 yang kompleks.', cmd: 'cutter', tag: 'Analysis' },
  { name: 'retdec', desc: 'Open source decompiler dari Avast — mengkonversi binary executable berbagai arsitektur (x86, ARM, MIPS, PowerPC) kembali ke kode C yang dapat dibaca, sangat berguna untuk analisis firmware IoT dan malware reverse engineering.', cmd: 'retdec-decompiler.py binary.exe', tag: 'Analysis' },
  { name: 'snowman', desc: 'Native code decompiler yang mengkonversi binary x86/x64 dan ARM ke kode C/C++ — bisa digunakan sebagai standalone tool atau plugin IDA/Radare2, menghasilkan output decompilasi yang relatif bersih dan mudah dibaca.', cmd: 'demangler ./binary', tag: 'Analysis' },

  // Dynamic Analysis
  { name: 'pin', desc: 'Dynamic binary instrumentation framework dari Intel — memungkinkan analisis program secara real-time dengan menyisipkan kode analisis tanpa modifikasi binary, digunakan untuk profiling, taint analysis, dan coverage-guided fuzzing.', cmd: 'pin -t obj-intel64/inscount.so -- ./program', tag: 'Analysis' },
  { name: 'dynamorio', desc: 'Runtime code manipulation framework open source — melakukan dynamic binary instrumentation untuk analisis perilaku program secara mendalam, sering digunakan dalam penelitian keamanan untuk code coverage dan taint tracking.', cmd: 'drrun -- ./program', tag: 'Analysis' },
  { name: 'qiling', desc: 'Advanced binary emulation framework — mengemulasikan eksekusi binary dari berbagai OS (Windows, Linux, macOS, FreeBSD) dan arsitektur (x86, ARM, MIPS) tanpa hardware asli, ideal untuk analisis malware dan firmware IoT secara aman.', cmd: 'python3 qlrun.py -rootfs rootfs_folder ./binary', tag: 'Analysis' },

  // Android & iOS
  { name: 'mobsf', desc: 'Mobile Security Framework — platform analisis otomatis untuk aplikasi Android (APK) dan iOS (IPA) yang melakukan static analysis, dynamic analysis, dan web API testing dalam satu framework dengan laporan HTML yang komprehensif.', cmd: './run.sh', tag: 'Analysis' },
  { name: 'androguard', desc: 'Tool analisis APK Android berbasis Python — membongkar, menganalisis, dan membandingkan aplikasi Android secara mendalam termasuk decompilasi DEX, analisis control flow, deteksi obfuskasi, dan ekstraksi permission yang digunakan.', cmd: 'androguard pyinst', tag: 'Analysis' },
  { name: 'apkleaks', desc: 'Scanner secret dan endpoint tersembunyi di dalam file APK Android — mengekstrak URL, API endpoint, kredensial hardcoded, dan informasi sensitif lainnya dari kode yang sudah didecompile tanpa perlu analisis manual yang memakan waktu.', cmd: 'apkleaks -f app.apk', tag: 'Analysis' },
  { name: 'reflutter', desc: 'Tool untuk reverse engineering aplikasi Flutter — memodifikasi binary aplikasi Flutter untuk mem-bypass SSL pinning dan mengaktifkan traffic interception, memudahkan analisis keamanan aplikasi mobile yang dibangun dengan framework Flutter.', cmd: 'reflutter app.apk', tag: 'Offensive' },

  // .NET & Java
  { name: 'dnspy', desc: 'Decompiler dan debugger .NET assembly yang powerful — membaca, memodifikasi, dan mendebug file .NET DLL dan EXE secara langsung tanpa source code asli, sangat efektif untuk analisis malware .NET dan reverse engineering aplikasi Windows modern.', cmd: 'wine dnSpy.exe', tag: 'Analysis' },
  { name: 'ilspy', desc: 'Open source .NET assembly browser dan decompiler — mengkonversi IL bytecode .NET kembali ke source code C# atau VB.NET yang readable, alternatif gratis yang powerful untuk dnSpy dalam analisis aplikasi .NET.', cmd: 'ilspycmd assembly.dll', tag: 'Analysis' },

  // Debugging & Patching
  { name: 'peda', desc: 'Python Exploit Development Assistance untuk GDB — menambahkan fitur visualisasi register, stack, memory map, dan ROP gadget search ke GDB standar, membuat proses exploit development buffer overflow di Linux jauh lebih mudah dan intuitif.', cmd: 'gdb -q ./program', tag: 'Offensive' },
  { name: 'pwndbg', desc: 'GDB plugin modern untuk exploit development dan reverse engineering — menyediakan tampilan yang informatif dengan highlight otomatis pada register penting, disassembly context, heap visualization, dan integrasi pwntools untuk CTF.', cmd: 'gdb -q ./program', tag: 'Offensive' },
  { name: 'radare2', desc: 'Framework analisis binary open source — disassembly, debugging, patching, dan analisis forensik dengan scripting penuh.', cmd: 'r2 ./binary', tag: 'Analysis' },
  { name: 'gdb', desc: 'GNU Debugger — debug program Linux secara interaktif, inspect memori, set breakpoint, dan analisis crash dump.', cmd: 'gdb ./program', tag: 'Analysis' },
  { name: 'edb-debugger', desc: 'GUI debugger untuk Linux mirip OllyDbg — visualisasi register, memory, dan stack selama eksekusi program.', cmd: 'edb', tag: 'Analysis' },
  { name: 'jadx', desc: 'Decompiler APK Android — mengubah file DEX/APK kembali ke kode Java yang dapat dibaca untuk analisis aplikasi.', cmd: 'jadx app.apk', tag: 'Analysis' },
  { name: 'apktool', desc: 'Reverse engineering APK Android — decode resource, smali code, dan rebuild APK untuk modifikasi dan analisis.', cmd: 'apktool d app.apk', tag: 'Analysis' },
  { name: 'dex2jar', desc: 'Konversi file DEX (Dalvik Executable) Android ke JAR untuk kemudian di-decompile dengan Java decompiler.', cmd: 'd2j-dex2jar.sh classes.dex', tag: 'Analysis' },
  { name: 'jd-gui', desc: 'Java Decompiler GUI — menampilkan source code Java dari file .class dan .jar secara visual dan navigable.', cmd: 'jd-gui', tag: 'Analysis' },
  { name: 'frida', desc: 'Dynamic instrumentation toolkit — inject JavaScript ke proses native untuk hook fungsi dan modifikasi behavior real-time.', cmd: 'frida -U -f com.example.app -l script.js', tag: 'Analysis' },
  { name: 'objection', desc: 'Runtime mobile exploration berbasis Frida — bypass SSL pinning, dump credential, dan explore aplikasi mobile tanpa jailbreak.', cmd: 'objection -g com.example.app explore', tag: 'Offensive' }
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
        <span class="text-xl">🔬</span>
        <h2 class="text-lg md:text-xl font-bold text-white tracking-wide">
          Reverse Engineering
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

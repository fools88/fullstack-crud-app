// ==========================
// Socket.IO Client Live Chat
// ==========================

// GANTI dengan URL publik Render lo
const RENDER_URL = "https://fullstack-crud-app-bpsj.onrender.com";  

const socket = io(RENDER_URL, {
    transports: ['polling','websocket']
});

const inputPesan = document.getElementById('input-pesan');
const tombolKirim = document.getElementById('tombol-kirim');
const containerPesan = document.getElementById('container-pesan');

// --------------------------
// Server Terhubung
// --------------------------
socket.on('connect', function() {
    console.log('Terhubung ke server real-time!');
    containerPesan.innerHTML += '<p style="color:green;">— Anda terhubung —</p>';
});

// --------------------------
// Server Gagal Connect
// --------------------------
socket.on('connect_error', (error) => {
    console.error('Gagal terhubung:', error);
    containerPesan.innerHTML += '<p style="color:red;">— GAGAL terhubung ke server —</p>';
});

// --------------------------
// Menerima Pesan dari Server
// --------------------------
socket.on('message_terima', function(msg) {
    containerPesan.innerHTML += `<p class="server">${msg.text}</p>`;
    containerPesan.scrollTop = containerPesan.scrollHeight;
});

// --------------------------
// Fungsi Kirim Pesan
// --------------------------
function kirimPesan() {
    const text = inputPesan.value.trim();
    if(text === '') return;

    // Kirim ke server
    socket.emit('message_kirim', { text: text });

    // Tampilkan pesan user sendiri
    containerPesan.innerHTML += `<p class="user">${text}</p>`;
    containerPesan.scrollTop = containerPesan.scrollHeight;

    inputPesan.value = '';
}

tombolKirim.onclick = kirimPesan;

// Kirim pakai Enter
inputPesan.addEventListener('keypress', function(e) {
    if(e.key === 'Enter') kirimPesan();
});

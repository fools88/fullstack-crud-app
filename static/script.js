// Final Live Chat JavaScript (Socket.IO Client)

// GANTI DENGAN URL PUBLIK RENDER-MU (Sangat penting!)
const RENDER_URL = 'https://fullstack-crud-app-bpsjionrender.com'; 

// Koneksi Socket.IO ke server Render
// Memaksa protokol polling dulu untuk mengatasi masalah koneksi Render
const socket = io(RENDER_URL, {
    transports: ['polling', 'websocket'] 
}); 

const inputPesan = document.getElementById('input-pesan');
const tombolKirim = document.getElementById('tombol-kirim');
const containerPesan = document.getElementById('container-pesan');


// 1. Event Listener: Server Berhasil Terhubung
socket.on('connect', function() {
    console.log('Terhubung ke server real-time!');
    containerPesan.innerHTML += '<p style="color:green;">— Anda terhubung —</p>';
});

// 2. Event Listener: Server Gagal Terhubung
socket.on('connect_error', (error) => {
    console.error('Gagal terhubung:', error);
    containerPesan.innerHTML += '<p style="color:red;">— GAGAL terhubung ke server! (Cek log Render) —</p>';
});

// 3. Event Listener: Server Menerima Pesan
socket.on('message_terima', function(msg) {
    containerPesan.innerHTML += `<p><strong>User:</strong> ${msg.text}</p>`;
    // Scroll ke bawah agar pesan terbaru terlihat
    containerPesan.scrollTop = containerPesan.scrollHeight; 
});

// 4. Event Handler: Tombol Kirim Diklik
tombolKirim.onclick = function() {
    const text = inputPesan.value;
    if (text.trim() === '') return;

    // Kirim pesan ke server dengan Event: 'message_kirim'
    socket.emit('message_kirim', { text: text }); 
    inputPesan.value = ''; // Kosongkan input
};

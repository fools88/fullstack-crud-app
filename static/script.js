// static/script.js (Kode Live Chat Client)

// 1. Inisialisasi koneksi Socket.IO ke server Render
const socket = io('https://fullstack-crud-app-bpsjionrender.com'); // Ganti dengan URL Render-mu!

// Dapatkan elemen
const inputPesan = document.getElementById('input-pesan');
const tombolKirim = document.getElementById('tombol-kirim');
const containerPesan = document.getElementById('container-pesan');

// 2. Event Listener: Server Berhasil Terhubung
socket.on('connect', function() {
    console.log('Terhubung ke server real-time!');
    containerPesan.innerHTML += '<p>— Anda terhubung —</p>';
});

// 3. Event Listener: Server Menerima Pesan (Event: 'message_terima')
socket.on('message_terima', function(msg) {
    // Tampilkan pesan yang diterima tanpa reload
    containerPesan.innerHTML += `<p><strong>User:</strong> ${msg.text}</p>`;
});

// 4. Event Handler: Tombol Kirim Diklik
tombolKirim.onclick = function() {
    const text = inputPesan.value;
    if (text.trim() === '') return;

    // Kirim pesan ke server dengan Event: 'message_kirim'
    socket.emit('message_kirim', { text: text }); 
    inputPesan.value = ''; // Kosongkan input
};
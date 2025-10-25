// static/script.js (Final Fix Socket.IO Client)

const socket = io('https://fullstack-crud-app-bpsjionrender.com', {
    transports: ['websocket', 'polling'] // Tambahkan ini untuk kestabilan koneksi
}); 

const inputPesan = document.getElementById('input-pesan');
const tombolKirim = document.getElementById('tombol-kirim');
const containerPesan = document.getElementById('container-pesan');

// 1. Event Listener: Server Berhasil Terhubung
socket.on('connect', function() {
    console.log('Terhubung ke server real-time!');
    // Tunjukkan koneksi sukses di UI
    containerPesan.innerHTML += '<p style="color:green;">— Anda terhubung —</p>';
});

// 2. Event Listener: Server Gagal Terhubung
socket.on('connect_error', (error) => {
    console.error('Gagal terhubung:', error);
    containerPesan.innerHTML += '<p style="color:red;">— GAGAL terhubung ke server! —</p>';
});

// 3. Event Listener: Server Menerima Pesan
socket.on('message_terima', function(msg) {
    containerPesan.innerHTML += `<p><strong>User:</strong> ${msg.text}</p>`;
    // Scroll ke bawah
    containerPesan.scrollTop = containerPesan.scrollHeight;
});

// 4. Event Handler: Tombol Kirim Diklik
tombolKirim.onclick = function() {
    const text = inputPesan.value;
    if (text.trim() === '') return;

    // Kirim pesan ke server
    socket.emit('message_kirim', { text: text }); 
    inputPesan.value = ''; // Kosongkan input
};
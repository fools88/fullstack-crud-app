const RENDER_URL = "https://YOUR_RENDER_URL";  

const socket = io(RENDER_URL, {
    transports: ['polling','websocket']
});

const inputPesan = document.getElementById('input-pesan');
const tombolKirim = document.getElementById('tombol-kirim');
const containerPesan = document.getElementById('container-pesan');

socket.on('connect', function() {
    console.log('Terhubung ke server real-time!');
    containerPesan.innerHTML += '<p style="color:green;">— Anda terhubung —</p>';
});

socket.on('connect_error', (error) => {
    console.error('Gagal terhubung:', error);
    containerPesan.innerHTML += '<p style="color:red;">— GAGAL terhubung ke server —</p>';
});

socket.on('message_terima', function(msg) {
    const kelas = msg.user === 'me' ? 'user' : 'server';
    containerPesan.innerHTML += `<p class="${kelas}">${msg.text}</p>`;
    containerPesan.scrollTop = containerPesan.scrollHeight;
});

function kirimPesan() {
    const text = inputPesan.value.trim();
    if(text === '') return;

    socket.emit('message_kirim', { text: text });

    containerPesan.innerHTML += `<p class="user">${text}</p>`;
    containerPesan.scrollTop = containerPesan.scrollHeight;

    inputPesan.value = '';
}

tombolKirim.onclick = kirimPesan;

inputPesan.addEventListener('keypress', function(e) {
    if(e.key === 'Enter') kirimPesan();
});

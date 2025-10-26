const socket = io("https://YOUR_RENDER_URL", {transports: ['polling','websocket']});

const inputPesan = document.getElementById('input-pesan');
const tombolKirim = document.getElementById('tombol-kirim');
const containerPesan = document.getElementById('container-pesan');

let username = prompt("Masukkan nama Anda:") || "Anon";

function tambahPesan(teks, sender) {
    const p = document.createElement('p');
    p.textContent = teks;
    p.className = sender === username ? 'user' : 'server';
    containerPesan.appendChild(p);
    containerPesan.scrollTop = containerPesan.scrollHeight;
}

// Terima pesan dari server
socket.on('message_terima', function(msg){
    tambahPesan(`${msg.user}: ${msg.text}`, msg.user);
});

// Kirim pesan
function kirimPesan() {
    const text = inputPesan.value.trim();
    if (!text) return;
    socket.emit('message_kirim', {user: username, text});
    inputPesan.value = '';
}

tombolKirim.addEventListener('click', kirimPesan);
inputPesan.addEventListener('keypress', e => { if(e.key === 'Enter') kirimPesan(); });

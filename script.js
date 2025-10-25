// script.js (Kode Full-Stack CRUD Lengkap)

// Variabel untuk melacak mode (Create atau Update)
let idPostToEdit = null; 

// Dapatkan elemen dari HTML
const form = document.getElementById('form-postingan');
const feedback = document.getElementById('feedback');
const container = document.getElementById('container-postingan');


// ------------------------------------------------------------------
// --- FUNGSI CREATE DAN UPDATE (C & U) ---
// ------------------------------------------------------------------
form.addEventListener('submit', function(e) {
    e.preventDefault(); 
    kirimData();
});

function kirimData() {
    const judul = document.getElementById('judul').value;
    const konten = document.getElementById('konten').value;
    const dataPost = { judul: judul, konten: konten };

    // Tentukan URL dan Metode berdasarkan mode (Create atau Update)
    let url = 'http://127.0.0.1:5000/api/postingan';
    let method = 'POST';
    let successMessage = 'Postingan berhasil disimpan!';

    if (idPostToEdit !== null) { // JIKA DALAM MODE EDIT (UPDATE)
        url = `http://127.0.0.1:5000/api/postingan/${idPostToEdit}`;
        method = 'PUT'; // Metode PUT
        successMessage = 'Postingan berhasil diubah!';
    }

    fetch(url, {
        method: method, 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataPost) 
    })
    .then(response => response.json())
    .then(data => {
        // Tampilkan feedback sukses
        feedback.textContent = `✅ SUKSES: ${successMessage} (ID: ${idPostToEdit || data.id})`;
        feedback.style.color = 'green';
        form.reset(); 
        idPostToEdit = null; // Reset mode ke Create
        muatPostingan(); // Refresh data
    })
    .catch(error => {
        feedback.textContent = '❌ ERROR: Gagal mengirim data ke server. Cek konsol.';
        feedback.style.color = 'red';
        console.error('Error:', error);
    });
}


// ------------------------------------------------------------------
// --- FUNGSI READ DAN DELETE (R & D) ---
// ------------------------------------------------------------------
function muatPostingan() {
    fetch('http://127.0.0.1:5000/api/postingan')
        .then(response => response.json())
        .then(data => {
            container.innerHTML = ''; 
            
            data.forEach(post => {
                const postElement = document.createElement('div');
                postElement.className = 'post-item';
                postElement.innerHTML = `
                    <h4>${post.judul} (ID: ${post.id})</h4>
                    <p class='post-konten'>${post.konten}</p>
                    <button onclick="hapusPostingan(${post.id})">Hapus</button>
                    <button onclick="isiFormEdit(${post.id})">Edit</button> 
                    <hr>
                `;
                container.appendChild(postElement);
            });
        })
        .catch(error => {
            console.error('Error saat memuat postingan:', error);
            container.innerHTML = `<p style="color:red;">Gagal memuat data dari server. Pastikan server Flask berjalan.</p>`;
        });
}

function hapusPostingan(id) {
    if (!confirm(`Yakin ingin menghapus Postingan ID ${id}?`)) return;

    fetch(`http://127.0.0.1:5000/api/postingan/${id}`, {
        method: 'DELETE', 
    })
    .then(response => response.json())
    .then(data => {
        alert(data.pesan);
        muatPostingan();
    })
    .catch(error => {
        alert("Gagal menghapus postingan.");
        console.error('Error delete:', error);
    });
}

// ------------------------------------------------------------------
// --- FUNGSI UPDATE (Mengisi Formulir Saat Tombol Edit Diklik) ---
// ------------------------------------------------------------------
function isiFormEdit(id) {
    // Cari elemen postingan terdekat berdasarkan tombol yang diklik
    const postElement = event.target.closest('.post-item');
    
    // Ambil Judul dan Konten dari elemen yang sudah tampil di halaman
    const judul = postElement.querySelector('h4').textContent.split('(')[0].trim();
    const konten = postElement.querySelector('p').textContent;

    // Isi formulir dengan data yang diambil
    document.getElementById('judul').value = judul;
    document.getElementById('konten').value = konten;
    
    // Atur mode ke Update
    idPostToEdit = id; 
    feedback.textContent = `MODE EDIT: Mengubah Postingan ID ${id}`;
    feedback.style.color = 'orange';

    // Scroll ke atas agar formulir terlihat
    window.scrollTo(0, 0); 
}


// Panggil fungsi ini saat halaman dimuat (untuk menampilkan semua data)
muatPostingan();
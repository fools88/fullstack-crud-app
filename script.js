// script.js (Kode Full-Stack CRUD Lengkap - Final Public URL Fix)

// --- GANTI ALAMAT INI DENGAN URL PUBLIK RENDER-MU ---
const BASE_URL = 'https://fullstack-crud-app-bpsj.onrender.com/api/postingan'; 
// --- GANTI ALAMAT INI DENGAN URL PUBLIK RENDER-MU ---

let idPostToEdit = null; 

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
    let url = BASE_URL;
    let method = 'POST';
    let successMessage = 'Postingan berhasil disimpan!';

    if (idPostToEdit !== null) { // JIKA DALAM MODE EDIT (UPDATE)
        url = `${BASE_URL}/${idPostToEdit}`; // Menggunakan template string untuk ID
        method = 'PUT'; 
        successMessage = 'Postingan berhasil diubah!';
    }

    fetch(url, {
        method: method, 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataPost) 
    })
    .then(response => response.json())
    .then(data => {
        feedback.textContent = `✅ SUKSES: ${successMessage} (ID: ${idPostToEdit || data.id})`;
        feedback.style.color = 'green';
        form.reset(); 
        idPostToEdit = null;
        muatPostingan(); 
    })
    .catch(error => {
        feedback.textContent = '❌ ERROR: Gagal mengirim data. Cek koneksi server Render.';
        feedback.style.color = 'red';
        console.error('Error:', error);
    });
}


// ------------------------------------------------------------------
// --- FUNGSI READ (R) ---
// ------------------------------------------------------------------
function muatPostingan() {
    fetch(BASE_URL) // Menggunakan URL Publik Render
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
            container.innerHTML = `<p style="color:red;">Gagal memuat data dari server Render.</p>`;
        });
}

// ------------------------------------------------------------------
// --- FUNGSI DELETE (D) ---
// ------------------------------------------------------------------
function hapusPostingan(id) {
    if (!confirm(`Yakin ingin menghapus Postingan ID ${id}?`)) return;

    fetch(`${BASE_URL}/${id}`, { // Menggunakan URL Publik Render
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
    const konten = postElement.querySelector('.post-konten').textContent;

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

// Jalankan fungsi ini saat halaman dimuat (untuk menampilkan semua data)
muatPostingan();
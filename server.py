from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy 
import os

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*", "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"]}})

app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY')

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///site.db'
app.config['SQLALCHEMY_ENGINE_OPTIONS'] = {
    "connect_args": {"check_same_thread": False}
}
db = SQLAlchemy(app) 

# --- MODEL HARUS DIDEFINISIKAN DI SINI ---
class Postingan(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    judul = db.Column(db.String(100), nullable=False)
    konten = db.Column(db.Text, nullable=False)

    def __repr__(self):
        return f"Post('{self.judul}')"

# --- PERBAIKAN FATAL: MEMBUAT TABEL SETELAH MODEL DIDEFINISIKAN ---
with app.app_context(): 
    db.create_all() # Sekarang akan membuat tabel Postingan dengan sukses di Render

# --- RUTE API UTAMA ---

@app.route('/')
def home():
    return "Halo, G! Server Python Flask-mu Sudah Berjalan!"

@app.route('/api/status')
def get_status():
    # Cek status database (CRUD: Read)
    jumlah_post = Postingan.query.count()
    data = {
        "status": "online",
        "pesan": f"Server siap! Ada {jumlah_post} postingan di database.",
        "developer": "G"
    }
    return jsonify(data)

# --- CRUD: CREATE (POST) ---
@app.route('/api/postingan', methods=['POST']) 
def create_post():
    data = request.get_json()
    judul_baru = data.get('judul')
    konten_baru = data.get('konten')

    post_baru = Postingan(judul=judul_baru, konten=konten_baru)

    db.session.add(post_baru)
    db.session.commit()

    return jsonify({"pesan": "Postingan berhasil disimpan!", "id": post_baru.id}), 201

# --- CRUD: READ (GET SEMUA) ---
@app.route('/api/postingan', methods=['GET'])
@app.route('/api/postingan', methods=['GET'])
def get_all_posts():
    semua_post = Postingan.query.all()

    posts_list = []
    for post in semua_post:
        posts_list.append({
            'id': post.id,
            'judul': post.judul,
            'konten': post.konten
        })

    return jsonify(posts_list)

# --- CRUD: DELETE ---
@app.route('/api/postingan/<int:post_id>', methods=['DELETE']) 
def delete_post(post_id):
    post_to_delete = Postingan.query.get_or_404(post_id)

    db.session.delete(post_to_delete)
    db.session.commit()

    return jsonify({"pesan": f"Postingan ID {post_id} berhasil dihapus!"})

# --- CRUD: UPDATE (PUT) ---
@app.route('/api/postingan/<int:post_id>', methods=['PUT']) 
def update_post(post_id):
    post_to_update = Postingan.query.get_or_404(post_id)

    data = request.get_json()

    post_to_update.judul = data.get('judul')
    post_to_update.konten = data.get('konten')

    db.session.commit()

    return jsonify({"pesan": f"Postingan ID {post_id} berhasil diubah!"})

if __name__ == '__main__': # <-- HAPUS ATAU INDENTASI INI

    app.run(debug=True)
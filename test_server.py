# test_server.py

# Import library standar Python untuk testing
import unittest 

# Import instance Flask dari file server.py
from server import app, db, Postingan

# test_server.py (Modifikasi class BasicTests)

class BasicTests(unittest.TestCase):
    
    def setUp(self):
        # Membuat klien tes untuk mengirim permintaan palsu
        self.app = app.test_client()
        self.app.testing = True
        
        # SANGAT PENTING: Membuat tabel baru untuk setiap tes
        with app.app_context():
            db.create_all()

    def tearDown(self):
        # SANGAT PENTING: Menghapus semua tabel setelah setiap tes selesai
        with app.app_context():
            db.drop_all()

    def test_create_post(self):
        # 1. Data yang akan dikirim (sama seperti dataPost di JavaScript)
        test_data = {
            "judul": "Tes Postingan Baru",
            "konten": "Ini adalah konten yang diuji coba."
        }
        
        # 2. Mengirim permintaan POST ke API
        response = self.app.post('/api/postingan', 
                                 json=test_data)

        # 3. Memastikan status code yang dikembalikan adalah 201 (Created)
        self.assertEqual(response.status_code, 201)
        
        # 4. Memastikan data tersimpan di database
        with app.app_context():
            self.assertEqual(Postingan.query.count(), 1)
            self.assertEqual(Postingan.query.first().judul, "Tes Postingan Baru")

if __name__ == "__main__":
    unittest.main()
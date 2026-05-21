const express = require('express');
const router = express.Router();
const db = require('../config/database');

// ================= LIST USER =================
router.get('/', (req, res) => {
  db.query("SELECT * FROM users", (err, result) => {
    if (err) return res.send("Error");

    res.render('user/list', { data: result });
  });
});

// ================= FORM TAMBAH USER =================
router.get('/tambah', (req, res) => {
  res.render('user/tambah', {
    user: req.session.user,
    currentPath: '/user/tambah',
    error: null
  });
});
// ================= SIMPAN USER =================
router.post('/tambah', (req, res) => {

  const {
    nama,
    jenis_kelamin,
    email,
    password,
    role_id
  } = req.body;

  // VALIDASI
  if (
    !nama ||
    !jenis_kelamin ||
    !email ||
    !password ||
    !role_id
  ) {
    return res.send("Data belum lengkap");
  }

  // CEK DUPLIKAT
  const cekSql = `
    SELECT * FROM users
    WHERE nama = ?
    OR email = ?
  `;

  db.query(cekSql, [nama, email], (err, result) => {

    if(result.length > 0){
      let errorMessage = "";
      if(result[0].nama === nama){
        errorMessage = "Nama user sudah digunakan";
      }

      if(result[0].email === email){
        errorMessage = "Email sudah digunakan";
      }

      return res.render('user/tambah', {
        user: req.session.user,
        currentPath: '/user/tambah',
        error: errorMessage
      });
    }
    // SIMPAN USER
    const sql = `
      INSERT INTO users
      (nama, jenis_kelamin, email, password, role_id)
      VALUES (?, ?, ?, ?, ?)
    `;
    db.query(
      sql,
      [
        nama,
        jenis_kelamin,
        email,
        password,
        role_id
      ],
      (err) => {
        if(err){
          console.log(err);
          return res.send("Gagal tambah user");
        }
        res.redirect('/dashboard');
      }
    );
  });
});
module.exports = router;
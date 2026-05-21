const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { isLogin, isPimpinan } = require('../middleware/auth');
router.get('/tambah-user', isLogin, isPimpinan, (req, res) => {
  res.render('pengaturan/tambah_user');
});
// HALAMAN PENGATURAN
router.get('/', (req, res) => {

  const userId = req.session.user.id;

  db.query("SELECT * FROM users WHERE id = ?", [userId], (err, result) => {

    if (err) {
      console.log(err);
      return res.send("Gagal mengambil data");
    }

    res.render('pengaturan/index', {
      user: result[0]
    });

  });

});

// UPDATE DATA
router.post('/update', (req, res) => {

  const { username, jenis_kelamin, email } = req.body;
  const userId = req.session.user.id;

  const sql = `
  UPDATE users 
  SET nama = ?, jenis_kelamin = ?, email = ?
  WHERE id = ?
  `;

  db.query(sql, [username, jenis_kelamin, email, userId], (err) => {

    if (err) {
      console.log(err);
      return res.send("Gagal memperbarui data");
    }

    // update session agar langsung berubah
    req.session.user.nama = username;
    req.session.user.jenis_kelamin = jenis_kelamin;
    req.session.user.email = email;

    res.redirect('/pengaturan');

  });

});

module.exports = router;
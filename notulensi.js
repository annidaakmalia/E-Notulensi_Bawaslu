const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { isLogin } = require('../middleware/auth');
const fs = require('fs');
if (!fs.existsSync('public/uploads')) {
  fs.mkdirSync('public/uploads', { recursive: true });
}

const multer = require('multer');
const path = require('path');
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }});
  const upload = multer({ storage });
// ================= LIST NOTULENSI =================

router.get('/', (req, res) => {
  const sql = "SELECT * FROM notulensi ORDER BY tanggal_kegiatan DESC";

  db.query(sql, (err, result) => {
    if (err) {
      console.log(err);
      return res.send("Gagal mengambil data");
    }

    res.render('notulensi/list', {
      data: result,
      user: req.session.user,
      currentPath: '/notulensi'
    });
  });
});
// ================= FORM TAMBAH =================
router.get('/create', isLogin, (req, res) => {
  res.render('notulensi/create', {
    user: req.session.user,
    currentPath: '/notulensi/create'
  });
});

// ================= HAPUS =================
router.get('/delete/:id', (req, res) => {

  const id = req.params.id;

  const sql = "DELETE FROM notulensi WHERE id = ?";

  db.query(sql, [id], (err) => {

    if (err) {
      console.log(err);
      return res.send("Gagal hapus");
    }

    res.redirect('/notulensi');

  });

});

// ================= FORM EDIT =================
router.get('/edit/:id', isLogin, (req, res) => {

  const id = req.params.id;

  const sql = "SELECT * FROM notulensi WHERE id = ?";

  db.query(sql, [id], (err, results) => {

    // ERROR DATABASE
    if (err) {
      console.log(err);
      return res.send("Gagal mengambil data");
    }

    // DATA TIDAK DITEMUKAN
    if (results.length === 0) {
      return res.send("Data tidak ditemukan");
    }

    // AMBIL DATA PERTAMA
    const data = results[0];

    // RENDER
    res.render('notulensi/edit', {
      title: 'Edit Notulensi',
      user: req.session.user,
      currentPath: '/notulensi',
      data: data
    });

  });

});

// ================= UPDATE =================
router.post('/edit/:id', (req, res) => {

  const id = req.params.id;

  const {
    tanggal_kegiatan,
    waktu_mulai,
    waktu_selesai,
    tempat,
    agenda,
    pimpinan,
    notulis,
    peserta,
    isi
  } = req.body;

  const sql = `
    UPDATE notulensi SET
    tanggal_kegiatan = ?,
    waktu_mulai = ?,
    waktu_selesai = ?,
    tempat = ?,
    agenda = ?,
    pimpinan_kegiatan = ?,
    notulis = ?,
    peserta_kegiatan = ?,
    isi_notulensi = ?
    WHERE id = ?
  `;

  const values = [
    tanggal_kegiatan,
    waktu_mulai,
    waktu_selesai,
    tempat,
    agenda,
    pimpinan,
    notulis,
    peserta,
    isi,
    id
  ];

  db.query(sql, values, (err) => {

    if (err) {
      console.log(err);
      return res.send("Gagal update");
    }

    res.redirect('/notulensi');

  });

});

// ================= SIMPAN =================
router.post('/create', upload.single('lampiran'), (req, res) => {
  console.log(req.body);
  const {
    tanggal_kegiatan,
    waktu_mulai,
    waktu_selesai,
    tempat,
    agenda,
    pimpinan,
    notulis,
    peserta,
    isi
  } = req.body;

  const lampiran = req.file
      ? req.file.filename
      : null;

  const sql = `
    INSERT INTO notulensi 
    (tanggal_kegiatan, waktu_mulai, waktu_selesai, tempat, agenda, pimpinan_kegiatan, notulis, peserta_kegiatan, isi_notulensi, lampiran)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    tanggal_kegiatan,
    waktu_mulai,
    waktu_selesai,
    tempat,
    agenda,
    pimpinan || null,
    notulis || null,
    peserta || null,
    isi || null,
    lampiran 
  ];

  db.query(sql, values, (err) => {
    if (err) {
      console.log(err);
      return res.send("Gagal menyimpan notulensi");
    }

    res.redirect('/notulensi');
  });
});

// ================= CETAK NOTULENSI =================
router.get('/cetak/:id', isLogin, (req, res) => {

  const id = req.params.id;

  console.log("Route cetak aktif ID:", id);

  const sql = "SELECT * FROM notulensi WHERE id = ?";

  db.query(sql, [id], (err, results) => {

    if (err) {
      console.log(err);
      return res.send("Gagal mengambil data");
    }

    if (results.length === 0) {
      return res.send("Data tidak ditemukan");
    }

    res.render('notulensi/cetak', {
      data: results[0]
    });

  });

});

// ================= DETAIL NOTULENSI =================
router.get('/detail/:id', isLogin, (req, res) => {

  const id = req.params.id;

  const sql = "SELECT * FROM notulensi WHERE id = ?";

  db.query(sql, [id], (err, results) => {

    if (err) {
      console.log(err);
      return res.send("Gagal mengambil data");
    }

    if (results.length === 0) {
      return res.send("Data tidak ditemukan");
    }

    res.render('notulensi/detail', {
      user: req.session.user,
      currentPath: '/notulensi',
      data: results[0]
    });

  });

});
module.exports = router;
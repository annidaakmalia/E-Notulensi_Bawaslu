const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { isLogin } = require('../middleware/auth');

router.get('/', (req, res) => {
  // Total notulensi
  const sqlTotal = `SELECT COUNT(*) AS total FROM notulensi`;

  // Notulensi bulan ini
  const sqlBulan = `
    SELECT COUNT(*) AS total 
    FROM notulensi 
    WHERE MONTH(tanggal_kegiatan) = MONTH(CURRENT_DATE())
      AND YEAR(tanggal_kegiatan) = YEAR(CURRENT_DATE())
  `;

  // Notulensi hari ini
  const sqlHari = `
    SELECT COUNT(*) AS total 
    FROM notulensi 
    WHERE DATE(tanggal_kegiatan) = CURRENT_DATE()
  `;

  // Data terbaru (limit 5)
  const sqlTerbaru = `
    SELECT tanggal_kegiatan, agenda, tempat, notulis 
    FROM notulensi 
    ORDER BY tanggal_kegiatan DESC 
    LIMIT 5
  `;

  // Grafik per bulan
  const sqlChart = `
    SELECT MONTH(tanggal_kegiatan) AS bulan, COUNT(*) AS total
    FROM notulensi
    GROUP BY MONTH(tanggal_kegiatan)
    ORDER BY bulan
  `;

  db.query(sqlTotal, (errTotal, resultTotal) => {
    if (errTotal) {
        console.log(errTotal);
        return res.send("Error total");
    } 

    db.query(sqlBulan, (errBulan, resultBulan) => {
      if (errBulan) {
        console.log(errBulan);
        return res.send("Error ambil bulan");}

    db.query(sqlHari, (errHari, resultHari) => {
        if (errHari) {
            console.log(errHari);
            return res.send("Error ambil hari");}

    db.query(sqlTerbaru, (errTerbaru, resultTerbaru) => {
        if (errTerbaru) {
            console.log(errTerbaru);
            return res.send("Error ambil terbaru");}

    db.query(sqlChart, (errChart, resultChart) => {
        if (errChart) {
            console.log(errChart);
            return res.send("Error ambil chart");}

            res.render('dashboard/index', {
              user: req.session.user || {},
              total: resultTotal[0].total || 0,
              bulan: resultBulan[0].bulan || 0,
              hari: resultHari[0].hari || 0,
              terbaru: resultTerbaru || [],
              chart: resultChart || [],
            });
          });
        });
      });
    });
  });
});

module.exports = router;
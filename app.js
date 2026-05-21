require('dotenv').config();
const express = require('express');
const session = require('express-session');
const flash = require('connect-flash');
const path = require('path');
const app = express();

/* ================= MIDDLEWARE DASAR ================= */
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));
app.use(session({
    secret: "secretkey",
    resave: false,
    saveUninitialized: true
}));

app.use(flash());

/* ================= GLOBAL FLASH ================= */

app.use((req, res, next) => {
  res.locals.user = req.session.user;
  res.locals.messages = {
    error: req.flash('error'),
    success: req.flash('success')
  };
  res.locals.currentPath = req.path;
  next();
});

/* ================= VIEW & STATIC ================= */
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

/* ================= ROUTES ================= */
const authRoute = require('./routes/auth');
const dashboardRoute = require('./routes/dashboard');
const notulensiRoute = require('./routes/notulensi');
const pengaturanRoute = require('./routes/pengaturan');
const userRoute = require('./routes/user');
const notulensiRoutes = require('./routes/notulensi');

app.use('/', authRoute);
app.use('/dashboard', require('./routes/dashboard'));
app.use('/notulensi', notulensiRoute);
app.use('/pengaturan', pengaturanRoute);
app.use('/notulensi', require('./routes/notulensi'));
app.use('/user', userRoute);
app.use('/notulensi', notulensiRoutes);
/* ================= ROOT ================= */
app.get('/', (req, res) => {
  res.redirect('/login');
});

/* ================= SERVER ================= */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});

module.exports = app;



function isLogin(req, res, next) {
  if (!req.session.user) {
    return res.redirect('/login');
  }
  next();
}

function isPimpinan(req, res, next) {
  if (req.session.user.role !== 'pimpinan') {
    return res.send('Akses ditolak');
  }
  next();
}

module.exports = {
  isLogin,
  isPimpinan
};
const verificarSesion = (req, res, next) => {
    if (!req.session.usuarioId) {
      return res.redirect('/usuarios/login');
    }
    next();
  };
  
  const verificarAdmin = (req, res, next) => {
    if (req.session.perfil !== 'admin') {
      return res.status(403).send('Acceso denegado');
    }
    next();
  };
  
  module.exports = { verificarSesion, verificarAdmin };
  
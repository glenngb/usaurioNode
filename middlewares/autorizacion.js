// Verifica si el usuario es admin
const esAdmin = (req, res, next) => {
    if (req.session && req.session.perfil === 'admin') {
      return next(); // Usuario autorizado, pasa al siguiente middleware
    }
    return res.status(403).send('Acceso denegado: Solo administradores pueden acceder');
  };
  
  // Verifica si el usuario es comprador
  const esComprador = (req, res, next) => {
    if (req.session && req.session.perfil === 'comprador') {
      return next(); // Usuario autorizado, pasa al siguiente middleware
    }
    return res.status(403).send('Acceso denegado: Solo compradores pueden acceder');
  };
  
  module.exports = { esAdmin, esComprador };
  
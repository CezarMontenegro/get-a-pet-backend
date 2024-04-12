const jwt = require('jsonwebtoken');
const getToken = require('./get-token');

//middleware to validate token
const checkToken = (req, res, next) => {

  if (!req.headers.authorization) {
    return res.status(401).json({ msg: 'Acesso negado!' });
  }

  const token = getToken(req)

  if (!token) {
    return res.status(401).json({ msg: 'Acesso negado!' });
  }

  try {
    const verified = jwt.verify(token, 'secret');
    req.user = verified;
    next();

  } catch (error) {
    return res.status(400).json({ msg: 'Token inválido' });
  }

  

}

module.exports = checkToken
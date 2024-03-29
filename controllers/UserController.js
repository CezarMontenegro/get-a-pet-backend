const User = require('../models/User');
const bcrypt = require('bcrypt');

const createUserToken = require('../helpers/create-user-token');

const register = async (req, res) => {
  const { name, email, phone, password, confirmPassword } = req.body;

  //validations
  if (!name) {
    res.status(422).json({ message: 'O nome é obrigatório'})
    return
  }
  if (!email) {
    res.status(422).json({ message: 'O email é obrigatório'})
    return
  }
  if (!phone) {
    res.status(422).json({ message: 'O telefone é obrigatório'})
    return
  }
  if (!password) {
    res.status(422).json({ message: 'A senha é obrigatório'})
    return
  }
  if (!confirmPassword) {
    res.status(422).json({ message: 'A confirmação de senha é obrigatória '})
    return
  }
  if (password !== confirmPassword) {
    res.status(422).json({ message: 'A senha e a confirmação de senha precisam ser iguais' }) 
    return
  }

  const userExists = await User.findOne({ email: email })
  if (userExists) {
    res.status(422).json({
      message: 'O usuário já exites, por favor, utilize outro e-mail'
    })
    return
  }

  // creating password
  const salt = await bcrypt.genSalt(12);
  const passwordHash = await bcrypt.hash(password, salt);

  // creating user
  const user = new User ({
    name,
    email,
    phone,
    password: passwordHash,
  })

  try {
    await user.save();
    await createUserToken(user, req, res);
  } catch (error) {
    return res.status(500).json({ message: error })
  }
}

const login = async (req, res) => {
  const { email, password } = req.body;

  if(!email) {
    res.status(422).json({ message: 'O e-mail é obrigatório' })
  }
  if (!password) {
    res.status(422).json({ message: 'A senha é obrigatório'})
    return
  }

  const user = await User.findOne({ email: email })
  if (!user) {
    res.status(422).json({
      message: 'Não há usuario cadastrado com esse email!'
    })
    return
  }
  // check if password match with db password
  const checkPassword = await bcrypt.compare(password, user.password)

  if(!checkPassword) {
    res.status(422).json({
      message: 'Senha inválida',
    })
    return
  }

  await createUserToken(user, req, res)
}

const checkUser = async (req, res) => {
  let currentUser;

  if(req.headers.authorization) {
    

  } else {

  }
}





module.exports = {
  register,
  login
}
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


//Helpers
const createUserToken = require('../helpers/create-user-token');
const getToken = require('../helpers/get-token');
const getUserByToken = require('../helpers/get-user-by-token');

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
  if (!phone) {ra
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

  //validate if user exists
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

  //Validations
  if(!email) {
    res.status(422).json({ message: 'O e-mail é obrigatório' })
  }
  if (!password) {
    res.status(422).json({ message: 'A senha é obrigatório'})
    return
  }

  //Check if user exists  
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

  //Verify if the token was passed and it`s valid
  if(req.headers.authorization) {
    const token = getToken(req)
    const decoded = jwt.verify(token, 'secret')

    currentUser = await User.findById(decoded.id, '-password');
  } else {
    currentUser = null
  }

  res.status(200).send(currentUser)   
}

const getUserById = async (req, res) => {
  const id = req.params.id

  const user = await User.findById(id).select('-password');

  if (!user) {
    res.status(422).json({ msg: 'Usuário não encontrado' });
    return
  }

  res.status(200).json({ user });
}

const editUser = async (req, res) => {
  const id = req.params.id;

  //check if user exists
  const token = getToken(req);
  const user = await getUserByToken(token);

  const { name, email, phone, password, confirmPassword } = req.body;
  let image = '';

  //Validations
  if (!name) {
    res.status(422).json({ message: 'O nome é obrigatório'})
    return
  }
  user.name = name;

  if (!email) {
    res.status(422).json({ message: 'O email é obrigatório'})
    return
  }

  //Check if emai has already been taken
  const userExists = await User.findOne({ email })

  if (user.email !== email && userExists) {
    res.status(422).json({ msg: 'Por favor utilize outro email' })
    return
  }
  user.email = email;

  if (!phone) {ra
    res.status(422).json({ message: 'O telefone é obrigatório'})
    return
  }
  user.phone = phone;

  if (password != confirmPassword) {
    res.status(422).json({ msg: 'As senhas não conferem!' });
    return

  } else if (password === confirmPassword && password != null) {
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    user.password = passwordHash;
  }

  console.log(user);
  try {
    //Returns user updated data
    const updatedUser = await User.findOneAndUpdate(
      { _id: user._id },
      { $set: user },
      { new: true },
    )

    res.status(200).json({ msg: 'Usuário atualizado com sucesso!' })
  } catch (error) {
    res.status(500).json({ msg: error })
    return
  }
}

module.exports = {
  register,
  login,
  checkUser,
  getUserById,
  editUser,
}
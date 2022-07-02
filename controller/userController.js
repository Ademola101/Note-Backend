const userRouter = require('express').Router();

const bcrypt = require('bcrypt');
const User = require('../models/user');

userRouter.post('/', async (req, res) => {
  const { username, name, password } = req.body;
  const existingUser = await User.findOne({ username });
  if (existingUser) {
    return res.status(409).json({ error: 'username already taken' });
  }
  const saltround = 10;
  const passwordHash = await bcrypt.hash(password, saltround);
  const newUser = new User({
    username,
    name,
    passwordHash,
  });

  const savedUser = await newUser.save();
  res.status(201).json(savedUser);
});

userRouter.get('/', async (req, res) => {
  const users = await User.find({}).populate('notes', { content: 1, date: 1 });
  res.json(users);
});

module.exports = userRouter;

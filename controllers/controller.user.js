const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const z = require('zod');
const userService = require('../services/service.user');
const { signToken } = require("../utils/util.token");

const userSignUpSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  email: z.string().email("Invalid email format"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain an uppercase letter")
    .regex(/[0-9]/, "Password must contain a number")
});

const userSignInSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain an uppercase letter")
    .regex(/[0-9]/, "Password must contain a number")
});

const getAllUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsers();

    if (!users || users.length === 0) {
      return res.status(404).json({ error: "No users found in database." });
    }

    const sanitizedUsers = users.map(u => ({
      name: u.name,
      email: u.email
    }));

    res.json(sanitizedUsers);
  } catch (err) {
    res.status(500).json({ error: "Error occurred while fetching users." });
  }
}

const signUpHandler = async (req, res) => {
  const result = userSignUpSchema.safeParse(req.body);

  if (!result.success) {
    const errors = result.error.format();
    return res.status(400).json({ errors });
  }

  const { name, email, password } = result.data;

  try{
    const salt = crypto.randomBytes(16).toString('hex');

    const hashedPassword = crypto
      .createHash('sha256')
      .update(password + salt)
      .digest('hex');

    const newUser = await userService.createUser(name, email, hashedPassword, salt);

    res.status(201).json({ message: 'User registered successfully', userId: newUser._id });
  }
  catch (error){
    res.status(500).json({ error: error.message });
  }
}

const signInHandler = async (req, res) => {
  try {
    const result = userSignInSchema.safeParse(req.body);

    if (!result.success) {
        const errors = result.error.format();
        return res.status(400).json({ errors });
    }

    const { email, password } = result.data;

    const existingUser = await userService.findUserByEmail(email);
    if (!existingUser) {
      return res.status(401).json({ error: "Email doesn't exist in Database." });
    }

    const hashedInput = crypto
      .createHash('sha256')
      .update(password + existingUser.salt)
      .digest('hex');

    if (hashedInput !== existingUser.password) {
      return res.status(401).json({ error: 'Invalid password.' });
    }

    const token = signToken({ userId: existingUser._id, name: existingUser.name, email: existingUser.email, role: existingUser.role });
    res.status(200).json({ token: token });
  } catch (error) {
    res.status(500).json({ error: 'Server error during sign-in.'});
  }
}

const logOutHandler = async (req, res) => {
  res.cookie("token", "", {
    maxAge: 1
  })
  res.redirect("/");
}

module.exports = { getAllUsers, signUpHandler, signInHandler, logOutHandler };
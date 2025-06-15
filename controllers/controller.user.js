const crypto = require('node:crypto');
const jwt = require('jsonwebtoken');
const z = require('zod');

const User = require("../models/model.user");
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
    const users = await User.find();

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

    const newUser = new User({ name, email, password: hashedPassword, salt });
    await newUser.save();

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

    const existingUser = await User.findOne({ email });
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

    const token = signToken({ userId: existingUser._id, name: existingUser.name, email: existingUser.email });
    res.cookie('token', token, {httpOnly: true}).status(200).json({
      message: 'Login successful.',
      user: {
        name: existingUser.name,
        email: existingUser.email,
        jwtToken: token,
      }
    });

  } catch (error) {
    res.status(500).json({ error: 'Server error during sign-in.'});
  }
}

module.exports = { getAllUsers, signUpHandler, signInHandler };
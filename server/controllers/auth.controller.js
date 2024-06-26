import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import generateTokenAndSetCookie from "../utils/generateToken.js";
import nodemailer from "nodemailer";

// Function to generate OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000); // 6-digit OTP
};

const transporter = nodemailer.createTransport({
  service: "gmail", // Change to your email service provider
  auth: {
    user: "fahimboss31@gmail.com", // Replace with your email
    pass: "ytpykwymugdzhfmv", // Replace with your email password
  },
});

export const signup = async (req, res) => {
  try {
    console.log(req.body);
    const {
      firstName,
      lastName,
      username,
      email,
      password,
    } = req.body;

    // Check if username or email already exists
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ error: "Username or email already exists" });
    }

    // Generate OTP
    const otp = generateOTP();

    // Save OTP and its expiration time to the user document
    const otpExpiration = new Date();
    otpExpiration.setMinutes(otpExpiration.getMinutes() + 10); // OTP expires in 10 minutes

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user with hashed password
    const newUser = new User({
      firstName,
      lastName,
      username,
      email,
      password: hashedPassword,
      otp,
      otpExpires: otpExpiration,
    });

    // Save user to database
    await newUser.save();

    // Send OTP via email
    await transporter.sendMail({
      from: "fahimboss31@gmail.com",
      to: email,
      subject: "OTP for Email Verification",
      text: `Your OTP for email verification is: ${otp}`,
    });

    // Generate JWT token and set cookie
    generateTokenAndSetCookie(newUser._id, res);

    // Respond with success message
    res.status(201).json({ message: "Verification OTP sent to your email" });
  } catch (error) {
    console.log("Error in signup controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username }); // Find user by username

    // Check if user exists
    if (!user) {
      return res.status(400).json({ error: "Invalid username or password" });
    }

    // Check if password is correct
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(400).json({ error: "Invalid username or password" });
    }

    // Generate JWT token and set cookie
    generateTokenAndSetCookie(user._id, res);

    // Respond with user data
    res.status(200).json({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    console.log("Error in login controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


export const verifyOTP = async (req, res) => {
  try {
    const {  otp } = req.body;
    const userId = req.user._id
    console.log(userId,otp);
    // Find user by email
    const user = await User.findById( userId );
    console.log(user);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    console.log(user);
    // Check if OTP is correct and not expired
    if (user.otp !== otp || user.otpExpires < new Date()) {
      return res.status(400).json({ error: "Invalid or expired OTP" });
    }

   
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    // Respond with success message
    res.status(200).json({ message: "Email verified successfully" });
  } catch (error) {
    console.log("Error in verifyOTP controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};



export const forgotPass = async (req, res) => {
  const { email } = req.body;

  try {
    // Find user by 			username,

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate a random password reset token
    const resetToken = Math.random().toString(36);

    // Update user's resetPasswordToken and resetPasswordExpires fields
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

    await user.save();

    // Send password reset email
    await transporter.sendMail({
      from: "fahimboss31@gmail.com",
      to: `${user.email}`,
      subject: "Password Reset",
      text: `You are receiving this email because you (or someone else) have requested the reset of the password for your account.\n\n
		  Please click on the following link, or paste this into your browser to complete the process:\n\n
		  http://localhost:5000/reset/${resetToken}\n\n
		  If you did not request this, please ignore this email and your password will remain unchanged.\n`,
    });

    res.status(200).json({ message: "Password reset email sent" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const resetpass = async (req, res) => {
  const { password, resetToken } = req.body;
  console.log(password, resetToken);
  try {
    // Find user by reset token
    const user = await User.findOne({
      resetPasswordToken: resetToken,
      resetPasswordExpires: { $gt: Date.now() },
    });
    console.log(user);
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    if (!user) {
      return res
        .status(400)
        .json({ message: "Invalid or expired reset token" });
    }

    // Update user's password
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};





export const logout = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.log("Error in logout controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const express = require("express");
const bodyParser = require("body-parser");
const mysql= require("mysql2")
const con = require("./connection");
const SECRET_KEY = "NOTESAPI";

const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require('nodemailer');
const NodeCache = require('node-cache');
const otpCache = new NodeCache();

const app = express();
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.get("/", cors(), (req, res) => {

});


//send otp
app.post('/send-otp', async (req, res) => {
  const { email } = req.body;
  
  // Generate a random OTP
  const otp = Math.floor(100000 + Math.random() * 900000);
  
  otpCache.set(email, otp.toString());

  // Configure the nodemailer transporter
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'nikhilanand73@gmail.com',
      pass: 'fradsmbajjdvbywu',
    },
  });

  const mailOptions = {
    from: 'nikhilanand73@gmail.com',
    to: email,
    subject: 'FoodZoo - OTP Verification',
    text: `Your OTP is: ${otp}. Please enter your OTP to verify your email and create an account.`,
  };

  try {
    // Send the email with the OTP
    await transporter.sendMail(mailOptions);
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Failed to send OTP' });
  } 

});

app.post('/signup', async (req, res) => {
    const { username, password, role, email, otp } = req.body;
  
    try {
      // Check if the username already exists
      con.query('SELECT * FROM collection WHERE username = ?', [username], async (error, results) => {
        if (error) {
          console.error('Error checking existing username:', error);
          return res.status(500).json('Failed to create user');
        }
        
        if (results.length > 0) {
          return res.status(400).json('Username already exists');
        }
  
        // Check if the email already exists
        con.query('SELECT * FROM collection WHERE email = ?', [email], async (error, results) => {
          if (error) {
            console.error('Error checking existing email:', error);
            return res.status(500).json('Failed to create user');
          }
  
          if (results.length > 0) {
            return res.status(400).json('Email already exists');
          }
  
          // Verify the OTP
          const storedOTP = otpCache.get(email);
  
          if (otp !== storedOTP) {
            return res.status(400).json('Invalid OTP');
          }
          otpCache.del(email);
  
          try {
            // Hash the password
            const hashedPassword = await bcrypt.hash(password, 10);
  
            // Insert the new user into the collection table
            const newUser = {
              username,
              password: hashedPassword,
              role,
              email,
            };
  
            con.query('INSERT INTO collection SET ?', newUser, (error) => {
              if (error) {
                console.error('Error inserting new user:', error);
                return res.status(500).json('Failed to create user');
              }
  
              // Generate a token and send the response
              const token = jwt.sign({ username }, SECRET_KEY);
              res.json({ username, token });
            });
          } catch (error) {
            console.error('Error hashing password:', error);
            res.status(500).json('Failed to create user');
          }
        });
      });
    } catch (error) {
      console.error('Error creating user:', error);
      res.status(500).json('Failed to create user');
    }
  });

const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const router = express.Router()

const Admin = require('../models/Admin')


// REGISTER ADMIN
router.post('/register', async (req, res) => {
  try {

    const { email, password } = req.body

    const existingAdmin = await Admin.findOne({ email })

    if (existingAdmin) {
      return res.status(400).json({
        message: 'Admin already exists'
      })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const admin = await Admin.create({
      email,
      password: hashedPassword
    })

    res.status(201).json({
      message: 'Admin registered successfully',
      admin
    })

  } catch (error) {
    console.log(error)

    res.status(500).json({
      message: 'Server Error'
    })
  }
})


// LOGIN
router.post('/login', async (req, res) => {
  try {

    const { email, password } = req.body

    const admin = await Admin.findOne({ email })

    if (!admin) {
      return res.status(400).json({
        message: 'Invalid credentials'
      })
    }

    const isMatch = await bcrypt.compare(password, admin.password)

    if (!isMatch) {
      return res.status(400).json({
        message: 'Invalid credentials'
      })
    }

    const token = jwt.sign(
      { id: admin._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    res.json({
      message: 'Login successful',
      token
    })

  } catch (error) {
    console.log(error)

    res.status(500).json({
      message: 'Server Error'
    })
  }
})

module.exports = router
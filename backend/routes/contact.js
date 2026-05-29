const express = require('express')
const router = express.Router()

const Submission = require('../models/Submission')

// POST form submission
router.post('/', async (req, res) => {
  try {
    const submission = await Submission.create(req.body)

    res.status(201).json({
      message: 'Form submitted successfully',
      submission
    })
  } catch (error) {
    console.log(error)

    res.status(500).json({
      message: 'Server Error'
    })
  }
})

module.exports = router
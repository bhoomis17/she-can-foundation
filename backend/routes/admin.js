const express = require('express')
const router = express.Router()

const Submission = require('../models/Submission')

const authMiddleware = require('../middleware/authMiddleware')

router.get('/submissions', authMiddleware, async (req, res) => {

  try {

    const submissions = await Submission.find()

    res.json(submissions)

  } catch (error) {

    console.log(error)

    res.status(500).json({
      message: 'Server Error'
    })
  }
})

module.exports = router
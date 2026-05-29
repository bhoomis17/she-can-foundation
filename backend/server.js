require('dotenv').config()

const express = require('express')
const cors = require('cors')
const connectDB = require('./db')

const app = express()

connectDB()

app.use(cors())
app.use(express.json())

app.use('/api/contact', require('./routes/contact'))

app.get('/', (req, res) => {
  res.send('API Running')
})

app.listen(5000, () => {
  console.log('Server running on port 5000')
})
app.use('/api/auth', require('./routes/auth'))
app.use('/api/admin', require('./routes/admin'))
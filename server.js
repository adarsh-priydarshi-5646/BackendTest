require('dotenv').config()
const express = require('express')
const cookieParser = require('cookie-parser')


const app = express()

app.use(express.json())
app.use(cookieParser())

// Routes
app.use('/api/auth/users', require('./routes/users/user.route.js'))
app.use('/api/posts', require('../src/routes/posts/post.route.js'))


app.listen(3007, () => {
    console.log('Server chal raha hai port 3007 par')
})
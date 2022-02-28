const path = require('path')
const express = require('express')
const colors = require('colors')
const dotenv = require('dotenv')
const morgan = require('morgan')
const cookieParser = require('cookie-parser')
const fileUpload = require('express-fileupload')
const connectDB = require('./database/db')
const auth = require('./routes/auth')
const user = require('./routes/user')
const product = require('./routes/product')
const review = require('./routes/review')
const errorHandler = require('./middleware/error')

// Security
const cors = require('cors')
const helmet = require('helmet')
const xss = require('xss-clean')
const rateLimit = require('express-rate-limit')
const mongoSanitize = require('express-mongo-sanitize')

// load env var
dotenv.config({path: './config/config.env'})

// Connect Database
connectDB()

const app = express()

app.get('/api/v1', (req, res) => {
    res.send('E-commerce App')
})

// bodyParser
app.use(express.json())
app.use(express.static(path.join(__dirname, 'public')))

app.set('trust proxy', 1)
app.use(rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 60
}))

app.use(helmet())
app.use(cors())
app.use(xss())
app.use(mongoSanitize())

// middleware
app.use(cookieParser())
app.use(fileUpload())

if(process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

// routes
app.use('/api/v1/auth', auth)
app.use('/api/v1/admin', user)
app.use('/api/v1/products', product)
app.use('/api/v1/review', review)
app.use(errorHandler)

// PORT
const PORT = process.env.PORT || 3000

// Executing Server
const server = app.listen(PORT, () => {
    console.log(`Server listening in ${process.env.NODE_ENV} mode on port:${PORT}`.yellow.bold);
})

// unHandleRejection
process.on('unhandledRejection', (err, promise) => {
    console.error(err.message)
    server.close(() => process.exit(1))
})
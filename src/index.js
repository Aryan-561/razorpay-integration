import express from "express"
import 'dotenv/config';
import path from 'path'
import { fileURLToPath } from 'url'


const app = express()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const publicPath = path.join(__dirname, '..', 'public')

app.use(express.json())
app.use(express.static(publicPath))

const PORT = process.env.PORT || 3000

app.get('/', (req, res) => {
    res.sendFile(path.join(publicPath, 'index.html'))
})

import paymentRouter from './routes/payment.js'

app.use('/razorpay-payment', paymentRouter)

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})

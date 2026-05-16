import 'dotenv/config'
import express from 'express'
// import http from 'node:http'
import route from './routes/index.routes.js'
import pinoHttp from 'pino-http'
import logger from './config/logger.config.js'

const app = express()
const port = process.env.PORT || 3000

app.use(pinoHttp()) // Gunakan pino-http untuk logging HTTP request
app.use(express.json())
app.use(route)

// const server = http.createServer(app)

app.listen(port, () => {
    // console.log(`Library API is running url: http://localhost:${port}`)
    logger.info(`Library API is running url: http://localhost:${port}`)
})

// Error handling for server
// server.on('error', (error) => {
//     if (error.code === 'EADDRINUSE') {
//         console.error(`Port ${port} is already in use.`)
//     } else {
//         console.error('Server error:', error)
//     }
//     process.exit(1)
// })
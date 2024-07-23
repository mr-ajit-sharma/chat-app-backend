import express from 'express'
import dotenv from 'dotenv'
import db from './config/database.js'
import userRoute from './routes/user.route.js'
import messageRoute from './routes/message.route.js'
import cookieParser from 'cookie-parser'
import cors from 'cors'
dotenv.config({path:"./.env"})
const PORT= process.env.PORT|| 5001
import {app,server} from './socket/socket.js'
// import { METHODS } from 'http'
// middleware

app.use(express.urlencoded({extended:true}))
app.use(cookieParser())
app.use(express.json())
const corsOption={
    origin:process.env.BASE_URL,
    methods:["GET","POST","PUT","DELETE"],
    credentials:true,
    allowedHeaders:['Content-Type']
}
app.use(cors(corsOption))
// routes
app.use('/api/v1/user',userRoute)
app.use('/api/v1/message',messageRoute)
server.listen(PORT,()=>{
    db()
    console.log(`app listening on the ${PORT}`)
})
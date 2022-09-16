import  express  from "express";
import mongoose from "mongoose";
import cors from "cors"
import morgan from "morgan"
import * as dotenv from 'dotenv'
import userRouter from "./routes/user.js"


dotenv.config()
const app = express()

app.use(morgan("dev"))
app.use(express.json({limit: "30mb", extended: true}))
app.use(express.urlencoded({limit: "30mb", extended: true}))
app.use(cors())
app.use("/users", userRouter)
//signup is called with the url  http://localhost:5000/users/signup


const port = 5000
console.log(process.env.MONGODB_URL)
mongoose
.connect(process.env.MONGODB_URL)
.then(() =>{
    app.listen(port, ()=>{console.log("Listening on port")})
})
.catch((error) => console.log("error"))

app.get("/", (req, res)=>{
    res.send("Hello")
})


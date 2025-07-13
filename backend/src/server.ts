import express, { Request, Response } from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from 'cors'
import cookieParser from "cookie-parser";
import connectDB from "./config/mongoConfig";
import errorMiddleware from './middleware/error'
import authRouter from './routes/auth.route'
import rateLimit from 'express-rate-limit'

let server: ReturnType<typeof app.listen>;

// handling uncaught exception
process.on("uncaughtException", (err: any) => {
    console.log(`Error : ${err.message}`)
    console.log("Shutting down the server due to uncaught exception")
    if (server) {
      server.close(() => process.exit(1));
    } else {
      process.exit(1);
    }
  });

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser())
app.use(cors({
    origin:process.env.FRONTEND_URL,
    methods: ["GET", "POST", "DELETE", "PUT"],
    allowedHeaders: [
        "Content-Type",
        "Authorization",
        "Cache-Control",
        "Expires",
        "Pragma",
      ],
    credentials: true
}))

// rate limit
app.use(rateLimit({
  windowMs: 3 * 60 * 1000, // 5 minutes
  max: 100,
  message: "Too many attempts from this IP, please try again later.",
  })); // Rate limiting




// health check route -->
app.get('/',(req:Request, res:Response)=>{
    res.json({
        "message":"server up and running"
    })
})
// routes -->
app.use('/api/v1/auth',authRouter);


app.use(errorMiddleware)  // error middleware

// server
const startServer = async () => {
    try {
      await connectDB();
      server = app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
      });
    } catch (err) {
      console.error("MongoDB connection failed", err);
      process.exit(1);
    }
  };
  startServer();

// handling unhandled promise rejection
process.on("unhandledRejection",(err:any)=>{
    console.log(`Error : ${err.message}`)
    console.log("Shutting down the server due to unhandled Promise Rejection")

    if (server) {
        server.close(() => process.exit(1));
    } else {
        process.exit(1);
    }
})

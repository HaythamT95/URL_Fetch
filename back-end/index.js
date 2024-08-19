import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import controllerOrder from "./controller/appController.js"
import { globalLimiter, session_ } from "./utils/security.js"
import logger from "./utils/logger.js";

dotenv.config()
const app = express()

app.use(session_);
app.use(globalLimiter)

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())

app.use('/url', controllerOrder)

app.listen(process.env.PORT, () => {
	logger.info(`Running on port ${process.env.PORT}`)
})
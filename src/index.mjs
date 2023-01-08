import express from "express";
import "dotenv/config";
import { routes } from "./routes/index.mjs";

const app = express()

app.use(express.json())
app.use(routes);

app.listen(3333,() => {
    console.log("Server running in port 3333");
})
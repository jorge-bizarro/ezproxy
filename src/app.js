import express from "express";
import helmet from "helmet";
import studentRoutesV1 from "./routes/student.routes.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = 3000;

app.set('trust proxy', true);

app.use(helmet());
app.use(express.json());

app.use('/api/v1/student', studentRoutesV1);

app.use('*', (req, res) => {
    res.send('Welcome to my API Server')
});

app.listen(port, (err) => {
    if (err) throw err;

    console.log(`Server run on port: ${port}`);
})

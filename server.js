require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.DATABASE_URL);
const db = mongoose.connection;
db.on('error', (error)=>console.error(error));
db.once('open',()=>console.log("Connected to database"));

const memberRouter = require("./routes/Router");
app.use('/api/members', memberRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=> console.log(`Server is running on http://localhost:${PORT}`));
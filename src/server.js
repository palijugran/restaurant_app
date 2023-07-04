const dotenv = require('dotenv');
dotenv.config();
const application = require('./app');
const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');

const corsOptions = {
    origin: `${process.env.BASE_URL}`
}
app.use(cors(corsOptions));

mongoose.connect(process.env.DATABASE_URL)
    .then(
        app.listen(process.env.PORT, () => {
            application(app);
            console.log(`database connected, listening to port: ${process.env.PORT} `);
        })
    )

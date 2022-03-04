require('dotenv').config({path:"./config.env"});
const express= require('express');
const res = require('express/lib/response');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/error');

// connect db
connectDB();

const app = express();

app.use(express.json());

 app.use(express.static(__dirname + '/public'));

app.get("/", (req, res, next) => {
    res.send("Api running");
  });


// A url with route /api/auth it will go the file auth file in routes
app.use("/api/auth", require("./rotues/auth"));
app.use("/api/private", require("./rotues/private"));

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT,() => console.log(`Server running on the port ${PORT}`));

process.on("unhandledRejection",(err,promise)=>{
    console.log(`Logged Error:${err.message}`);
    server.close(()=>process.exit(1));
});
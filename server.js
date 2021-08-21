//Importing Express packages
const express = require('express');
const app = express();


//Port Number
const port = 5000;


//Importing Body-Parser
app.use(express.json({ extended: false }));


//Index Routes
var indexRoutes = require('./routes/index');

app.use("/api", indexRoutes);


//Listener
app.listen(port, ()=> console.log("Server has Started"));
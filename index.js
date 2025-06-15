const express = require('express');
const mongoose = require('mongoose');

const userRoute = require('./routes/route.user.js');


const app = express();
const PORT = 5000;
const db_password = "OrZCF2PScyVjjxNK@";

mongoose.connect(`mongodb+srv://vickykumar1998:${db_password}cluster0.khdlhgj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`)
.then(() => console.log('MongoDB is connected'))
.catch((error) => console.error("MongoDB connection error", error));

app.use(express.json());

app.get("/", (req, res) => {
    res.send("Connection is Alive");
})

app.use("/user", userRoute);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');

const userRoute = require('./routes/route.user.js');
const theatreRoute = require('./routes/route.theatre.js');
const movieRoute = require('./routes/route.movie.js');
const bookingRoute = require('./routes/route.booking.js');

const app = express();

mongoose.connect(process.env.MongoDB_URI)
.then(() => console.log('MongoDB is connected'))
.catch((error) => console.error("MongoDB connection error", error));

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
    res.send("Connection is Alive");
});

app.use("/user", userRoute);
app.use("/theatre", theatreRoute);
app.use("/movie", movieRoute);
app.use("/booking", bookingRoute);

app.listen(process.env.PORT, () => {
  console.log(`Server running at https://localhost:${process.env.PORT}`);
});
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const Message = require("./models/Message");

require("dotenv").config();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

mongoose
  .connect(process.env.MONGO_DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });

// Start the server
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

// Socket.io setup
const io = require("socket.io")(server);

io.on("connection", (socket) => {
  console.log("Socket is connected...");
});

app.post("/chats", async (req, res) => {
  try {
    await Message.create({ name: req.body.name, text: req.body.message });
    res.sendStatus(200);
    io.emit("chat", req.body);
  } catch (error) {
    res.sendStatus(500);
    console.error(error);
  }
});

app.get("/chats", async (req, res) => {
    try {
        const chats = await Message.find({});
        res.send(chats);
    } catch (err) {
        res.sendStatus(500);
        console.log(err);
    }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const userEmail = "jahanzaib@test.com";
    const userPass = "test123";
    if (!(email && password)) {
      res.status(400).send("All input is required");
    }
    if (email === userEmail && password === userPass) {
      res.status(200).json({ userName: "jahanzaib", userEmail });
    } else {
      res.status(400).send("Invalid Credentials");
    }
  } catch (err) {
    console.log(err);
  }
});

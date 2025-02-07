const express = require('express');
const multer = require("multer");
const app = express();
const port = 8000;
const cors = require('cors');
const path = require("path");
const bodyParser = require("body-parser");

app.use(
    cors({
        origin: "http://localhost:3000", // Allow only frontend origin
        methods: "GET,POST,PUT,DELETE", // Allowed methods
        credentials: true, // Allow cookies and credentials
    })
);

app.use(bodyParser.json());

//---------Login Concept Start------------------------

const VALID_EMAIL = "admin@123.com";
const VALID_PASSWORD = "password123";

app.post("/login", (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
    }

    if (email === VALID_EMAIL && password === VALID_PASSWORD) {
        return res.status(200).json({ status: 1, message: "Login successful" });
    } else {
        return res.status(200).json({ status: 0, message: "Invalid email or password" });
    }
});

//---------Login Concept End------------------------


//---------Get Method Concept Start------------------------

app.get("/getUsersList", (req, res) => {
    res.status(200).json({ data: storedUsersData });
});

//---------Get Method Concept End------------------------


//---------Post Method Concept Start------------------------

let storedUsersData = [];
app.post("/addUsers", (req, res) => {
    const { firstname, lastname, email, url } = req.body;

    if (!firstname || !lastname || !email || !url) {
        return res.status(400).json({ error: "All fields are required!" });
    }

    const newData = { id: storedUsersData.length + 1, firstname, lastname, email, url };
    storedUsersData.push(newData);

    console.log("Data Stored:", newData);
    res.status(200).json({ status: 1, message: "User added successfully", data: newData });
});

//---------Post Method Concept End------------------------


//---------Put Method Concept Start------------------------

app.put("/updateUsers/:id", (req, res) => {
    const { id } = req.params;
    const { firstname, lastname, email, url } = req.body;

    const index = storedUsersData.findIndex(item => item.id === parseInt(id));

    if (index === -1) {
        return res.status(404).json({ error: "Data not found!" });
    }

    storedUsersData[index] = { id: parseInt(id), firstname, lastname, email, url };

    console.log("Data Updated:", storedUsersData[index]);
    res.status(200).json({ status: 1, message: "User updated successfully", data: storedUsersData[index] });
});

//---------Put Method Concept End------------------------


//---------Delete Method Concept Start------------------------

app.delete("/deleteUsers/:id", (req, res) => {
    const { id } = req.params;

    const index = storedUsersData.findIndex(item => item.id === parseInt(id));

    if (index === -1) {
        return res.status(404).json({ error: "Data not found!" });
    }

    const deletedItem = storedUsersData.splice(index, 1); // Remove item from array

    console.log("Data Deleted:", deletedItem);
    res.status(200).json({ status: 1, message: "User deleted successfully", data: deletedItem });
});

//---------Delete Method Concept End------------------------


//---------File Upload Method Start------------------------

const storage = multer.diskStorage({
    destination: "uploads/", // Save files in the "uploads" folder
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Rename file with timestamp
    },
});

const upload = multer({ storage });

// File upload route
app.post("/upload", upload.single("file"), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
    }

    res.json({
        message: "File uploaded successfully",
        filePath: `http://localhost:8000/uploads/${req.file.filename}`,
    });
});

// Serve uploaded files statically
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

//---------File Upload Method End------------------------


app.listen(port, () => {
    console.log("Server started on port 8000");
});
// const express = require("express");
// const swaggerJsdoc = require("swagger-jsdoc");
// const swaggerUi = require("swagger-ui-express");
// const bodyParser = require("body-parser");
// const cors = require('cors');
// const app = express();
// const port = 8000;

// app.use(bodyParser.json()); // Middleware to parse JSON requests
// app.use(cors({ origin: "http://localhost:8000" }));

// // Sample data (simulating a database)
// let users = [
//   { id: 1, name: "John Doe" },
//   { id: 2, name: "Jane Smith" },
// ];

// // Swagger options
// const swaggerOptions = {
//   definition: {
//     openapi: "3.0.0",
//     info: {
//       title: "User API",
//       version: "1.0.0",
//       description: "A simple CRUD API using Express.js and Swagger",
//     },
//     servers: [
//       {
//         url: "http://localhost:8000",
//       },
//     ],
//   },
//   apis: ["./index.js"], // Path to the API docs
// };

// // Initialize Swagger docs
// const swaggerDocs = swaggerJsdoc(swaggerOptions);
// app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// /**
//  * @swagger
//  * /users:
//  *   get:
//  *     summary: Get all users
//  *     responses:
//  *       200:
//  *         description: A list of users
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: array
//  *               items:
//  *                 type: object
//  *                 properties:
//  *                   id:
//  *                     type: integer
//  *                   name:
//  *                     type: string
//  */
// app.get("/users", (req, res) => {
//   res.json(users);
// });

// /**
//  * @swagger
//  * /users:
//  *   post:
//  *     summary: Create a new user
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               name:
//  *                 type: string
//  *     responses:
//  *       201:
//  *         description: User created
//  *       400:
//  *         description: Invalid input
//  */
// app.post("/users", (req, res) => {
//   const { email } = req.body;
//   if (!email) return res.status(400).json({ message: "Email is required" });

//   const newUser = { id: users.length + 1, email };
//   users.push(newUser);
//   res.status(201).json(newUser);
// });

// /**
//  * @swagger
//  * /users/{id}:
//  *   put:
//  *     summary: Update a user by ID
//  *     parameters:
//  *       - in: path
//  *         name: id
//  *         required: true
//  *         schema:
//  *           type: integer
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               name:
//  *                 type: string
//  *     responses:
//  *       200:
//  *         description: User updated
//  *       400:
//  *         description: Invalid input
//  *       404:
//  *         description: User not found
//  */
// app.put("/users/:id", (req, res) => {
//   const user = users.find((u) => u.id === parseInt(req.params.id));
//   if (!user) return res.status(404).json({ message: "User not found" });

//   const { name } = req.body;
//   if (!name) return res.status(400).json({ message: "Namessput is required" });

//   user.name = name;
//   res.json(user);
// });

// /**
//  * @swagger
//  * /users/{id}:
//  *   delete:
//  *     summary: Delete a user by ID
//  *     parameters:
//  *       - in: path
//  *         name: id
//  *         required: true
//  *         schema:
//  *           type: integer
//  *     responses:
//  *       200:
//  *         description: User deleted
//  *       404:
//  *         description: User not found
//  */
// app.delete("/users/:id", (req, res) => {
//   const userIndex = users.findIndex((u) => u.id === parseInt(req.params.id));
//   if (userIndex === -1) return res.status(404).json({ message: "User not found" });

//   users.splice(userIndex, 1);
//   res.json({ message: "User deleted" });
// });

// app.listen(port, () => {
//   console.log(`Server is running at http://localhost:${port}`);
//   console.log(`Swagger docs available at http://localhost:${port}/api-docs`);
// });




const express = require('express');
const app = express();
const port = 8000;
const cors = require('cors');
const bodyParser = require("body-parser");

app.use(
    cors({
        origin: "http://localhost:3000", // Allow only frontend origin
        methods: "GET,POST,PUT,DELETE", // Allowed methods
        credentials: true, // Allow cookies and credentials
    })
);

app.use(bodyParser.json());

const VALID_EMAIL = "admin@123.com";
const VALID_PASSWORD = "password123";

let users = [];
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

app.get("/users", (req, res) => {
    res.json({ "users": users })
});

app.delete("/users/:id", (req, res) => {
    let id = Number(req.params.id);
    let filteredUsers = users.filter((user) => {
        user.id !== id
    })
});

app.listen(port, () => {
    console.log("Server started on port 8000");
});
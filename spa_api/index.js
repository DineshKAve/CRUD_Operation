const express = require('express');
const app = express();
const port = 8000;
const cors = require('cors');
// const corsOptions ={
//     origin:'http://localhost:8000', 
//     methods: ['GET','POST','PATCH','DELETE'],
//     credentials:true,            //access-control-allow-credentials:true
//     optionSuccessStatus:200
// }
// app.use(cors(corsOptions));
app.use(express.json())
app.use(cors({ origin: "http://localhost:3000" }));

app.get("/users", (req, res) => {
    res.json({ "users": ["One", "Two", "Three", "Four"] })
});

app.delete("/users/:id", (req, res) => {
    let id = Number(req.params.id);
    let filteredUsers = users.filter((user) => {
        user.id !== id
    })
})

app.post("users", (req, res) => {
    let { firstname, lastname } = req.body;
    if (!firstname || !lastname) {
        res.status(400).send({ message: "All Fields Required" })
    }
    return res.json({ data: req.body, response: 'User details added succuessfully' });
})

app.listen(port, () => {
    console.log("Server started on port 8000");
})
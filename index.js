const express = require('express')
const app = express()
app.use(express.json())

let users = []

app.get("/users", (req, res) => {
    res.send('Hello, World!')
})

app.post("/users", (req, res) => {
    console.log(req.body)
    const { name, email } = req.body;
    const newUser = 
})

app.listen(3000, () => {
    console.log("Server is running on port 3000")
})
const express = require('express')
const {PrismaClient} = require('@prisma/client')

const prisma = new PrismaClient()
const app = express()
app.use(express.json())

let users = []
let nextId = 1

// Rota para retorna todos os usuários
app.get("/users", (req, res) => {
    res.json(users)
})

// Rota para criar um usuário
app.post("/users", async (req, res) => {        //acrescento async , assincrona, vai esperar o banco de dados confirmar para continuar
    const { name, email } = req.body;

    if(!name || !email) {
        return res.status(400).json({error: "Name e email são obrigatórios"})
    }

    //const newUser = {
    //    id: nextId++,
    //    name: name,
    //    email: email
    //}

    /// users.push(newUser) vamos retirar esta parte pois vamos salvar direto no banco de dados
    const user = await prisma.user.create({
        data:{
            name,
            email
        }
    })

    res.status(201).json(user)
})

// Rota para busca um usuário pelo ID
app.get("/user/:id", (req, res) => {
    const { id } = req.params
    const user = users.find((u) => u.id === parseInt(id))

    if(!user) {
        return res.status(404).json({error: "Usuário não encontrado"})
    }

    res.json(user)
})

// Rota para deletar um usuário pelo ID
app.delete("/user/:id", (req, res) => {
    const { id } = req.params

    const user = users.find((u) => u.id === parseInt(id))

    if(!user) {
        return res.status(404).json({error: "Usuário não encontrado"})
    }

    users = users.filter((u) => u.id != id)
    res.status(204).send()
})

// Rota para atualizar o usuário pelo ID
app.put("/user/:id", (req, res) => {
    const { id } = req.params
    const user = users.find((u) => u.id == id)

    if(!user) {
        return res.status(404).json({error: "Usuário não encontrado"})
    }

    const {name, email } = req.body

    if(name){
        user.name = name
    }

    if(email) {
        user.email = email
    }

    res.json(user)
})



app.listen(3000, () => {
    console.log("Server is running on port 3000")
})

/// comando para rodar aplicação automaticamente após qualquer alteração no código: npx nodemon index.js
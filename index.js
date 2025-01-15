const express = require('express')
const {PrismaClient} = require('@prisma/client')

const prisma = new PrismaClient()
const app = express()
app.use(express.json())

//let users = [] // não precisamos mais destas variaveis, pois alteramos para banco de dados
//let nextId = 1 // não precisamos mais destas variaveis, pois alteramos para banco de dados


// Rota para busca de usuário conectado com banco de dados
app.get("/users", async (req, res) => {                 //async porque banco assincrono. Aguarda o banco responder para continuar
    const users = await prisma.user.findMany()

   /* const { id } = req.params
    const user = users.find((u) => u.id === parseInt(id))

    if(!user) {
        return res.status(404).json({error: "Usuário não encontrado"})
    }*/

    res.json(users)
})


// Rota para busca um usuário pelo ID - Where id = 1
app.get("/users/:id", async (req, res) => {             //async porque banco assincrono. Aguarda o banco responder para continuar
    const id = parseInt(req.params.id)
    const user = await prisma.user.findUnique({where:{id}})

    if(!user) {
        return res.status(404).json({error: "Usuário não encontrado"})
    }
    res.json(user)
})

// Rota para criar um usuário
app.post("/users", async (req, res) => {                //acrescento async , assincrona, vai esperar o banco de dados confirmar para continuar
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

// Rota para deletar um usuário pelo ID
app.delete("/user/:id", async(req, res) => {            //async porque banco assincrono. Aguarda o banco responder para continuar
    ///const { id } = req.params
    ////const user = users.find((u) => u.id === parseInt(id))
    /// trocando a Delete por Id por uma Delete no banco de dados
    const id = parseInt(req.params.id)
    const user = await prisma.user.findUnique({where:{id}})

    if(!user) {
        return res.status(404).json({error: "Usuário não encontrado"})
    }

    ///users = users.filter((u) => u.id != id)
    await prisma.user.delete({
        where:{id}
    })
    res.status(204).send()    
})


// Rota para atualizar o usuário pelo ID
// alterado para atualizar o usuário no banco de dados pelo ID. Após alteração consultar no banco prisma para ver se alterou
app.put("/user/:id", async (req, res) => {              //async porque banco assincrono. Aguarda o banco responder para continuar
    
    /*const { id } = req.params
    const user = users.find((u) => u.id == id)  // find para verificar se usuário existe*/
    
    const id = parseInt(req.params.id)
    const user = await prisma.user.findUnique({where:{id}})

    if(!user) {
        return res.status(404).json({error: "Usuário não encontrado"})
    }

    const {name, email } = req.body

    const updatedUser = await prisma.user.update({
        where: {id},
        data:{
            name,
            email
        }
    })

    res.json(updatedUser)

    /*if(name){
        user.name = name
    }
    if(email) {
        user.email = email
    }
    res.json(user)*/
})

app.listen(3000, () => {
    console.log("Server is running on port 3000")
})

/// comando para rodar aplicação automaticamente após qualquer alteração no código: npx nodemon index.js
/// 
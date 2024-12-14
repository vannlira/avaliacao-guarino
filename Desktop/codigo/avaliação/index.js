const express = require('express')
const cors = require('cors')
const BodyBuilder = require('./src/bodybuilder/bodybuilder.entity')
const app = express()
app.use(cors())
const port = 3000
app.use(express.json())

// Banco de dados de clientes
let clientes = []

let academias = [
  { id: 1, nome: "Academia Guarafit", telefone: "12178845459" },
  { id: 2, nome: "Academia da manha", telefone: "95484454848" }
]

let estilos = [
  { id: 1, nome: "Fabio 3 da manhã" },
  { id: 2, nome: "João chassis de grilo" },
  { id: 3, nome: "Guarino foco e fé" }
]

app.post('/body-builder', (req, res) => {
  try {
    const data = req.body // Receber o bodyBuilder, que é um objeto JSON que vem do front-end

    const gym = academias.find((academia) => academia.id == data.idAcademia)
    const estilo = estilos.find((estilo) => estilo.id == data.idEstilo)

    if (!gym || !estilo) {
      return res.status(400).send("Academia ou estilo não encontrado")
    }

    let bodyBuilder = new BodyBuilder(data.cpf, data.nome, data.peso, data.altura, data.dataNascimento, data.sapato, gym, estilo)

    clientes.push(bodyBuilder) // Adicionar o bodyBuilder no banco de dados
    res.status(201).send("Cadastrado com sucesso")
  } catch (error) {
    res.status(500).send("Erro ao cadastrar bodybuilder")
  }
})

app.put('/body-builder/:cpf', (req, res) => {
  try {
    let cpf = req.params.cpf
    let cliente = clientes.find((cliente) => cliente.cpf == cpf)

    if (!cliente) {
      return res.status(404).send("Bodybuilder não encontrado")
    }

    const data = req.body
    const gym = academias.find((academia) => academia.id == data.idAcademia)
    const estilo = estilos.find((estilo) => estilo.id == data.idEstilo)

    if (!gym || !estilo) {
      return res.status(400).send("Academia ou estilo não encontrado")
    }

    let updatedBodyBuilder = new BodyBuilder(data.cpf, data.nome, data.peso, data.altura, data.dataNascimento, data.sapato, gym, estilo)
    const index = clientes.indexOf(cliente)
    clientes[index] = updatedBodyBuilder // Substituir o bodyBuilder pelos dados enviados no body
    res.status(200).send("Atualizado com sucesso")
  } catch (error) {
    res.status(500).send("Erro ao atualizar bodybuilder")
  }
})

app.delete('/body-builder/:cpf', (req, res) => {
  try {
    let cpf = req.params.cpf
    let clienteIndex = clientes.findIndex((cliente) => cliente.cpf == cpf)

    if (clienteIndex === -1) {
      return res.status(404).send("Cliente não encontrado")
    }

    clientes.splice(clienteIndex, 1) // Remover o cliente
    res.status(200).send("Deletado com sucesso")
  } catch (error) {
    res.status(500).send("Erro ao deletar bodybuilder")
  }
})

app.get('/body-builder', (req, res) => {
  try {
    // Remover a lógica de busca
    res.json(clientes)  // Retorna todos os clientes diretamente, sem filtrar
  } catch (error) {
    res.status(500).send("Erro ao listar bodybuilders")
  }
})

app.get("/gym", (req, res) => {
  try {
    res.json(academias)
  } catch (error) {
    res.status(500).send("Erro ao listar academias")
  }
})

app.get("/estilo", (req, res) => {
  try {
    res.json(estilos)
  } catch (error) {
    res.status(500).send("Erro ao listar estilos")
  }
})

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})
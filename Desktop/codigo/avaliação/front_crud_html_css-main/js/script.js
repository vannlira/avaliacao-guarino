// Falso banco de dados de clientes, em memória RAM
var clientes = []

var academias = []

var estilos = []

//guarda o cliente que está sendo alterado
var clienteAlterado = null

function mostrarModal(){
    const modal = document.getElementById("modal")
    modal.style.display = "block"
}

function ocultarModal(){
    const modal = document.getElementById("modal")
    modal.style.display = "none"
}

function adicionar(){
    clienteAlterado = null // marca que está adicionando um cliente
    limparFormulario() 
    mostrarModal()
}

function alterar(cpf){
    //busca o cliente que será alterado
    for(let i=0; i < clientes.length; i++){
        let cliente = clientes[i]
        if (cliente.cpf == cpf){
            document.getElementById("nome").value = cliente.nome
            document.getElementById("cpf").value = cliente.cpf
            document.getElementById("peso").value = cliente.peso
            document.getElementById("altura").value = cliente.altura
            document.getElementById("dataNascimento").value = cliente.dataNascimento
            document.getElementById("sapato").value = cliente.sapato
            document.getElementById("academia").value = cliente.gym.id
            document.getElementById("estilo").value = cliente.estilo.id
            clienteAlterado = cliente //guarda o cliente que está sendo alterado
            mostrarModal()
        }
    }

    
}

function excluir(cpf){
    if (confirm("Deseja realmente excluir este body builder?")){
        fetch('http://localhost:3000/body-builder/' + cpf, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            mode: 'cors'
        }).then(() => {
            alert("Excluído com sucesso")
            carregarClientes()
        }).catch((error) => {
            alert("Erro ao cadastrar")
        })
    }
}

function salvar(){
    let nome = document.getElementById("nome").value
    let cpf = document.getElementById("cpf").value
    let peso = document.getElementById("peso").value
    let altura = document.getElementById("altura").value
    let dataNascimento = document.getElementById("dataNascimento").value
    let sapato = document.getElementById("sapato").value
    let idAcademia = document.getElementById("academia").value
    let idEstilo = document.getElementById("estilo").value

    let novoBodyBuilder = {
        nome: nome,
        cpf: cpf,
        peso: peso,
        altura: altura,
        dataNascimento: dataNascimento,
        sapato: sapato,
        idAcademia: idAcademia,
        idEstilo: idEstilo
    }

    //se clienteAlterado == null, então está adicionando um novo cliente
    if (clienteAlterado == null){
        fetch('http://localhost:3000/body-builder', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            mode: 'cors',
            body: JSON.stringify(novoBodyBuilder)
        }).then(() => {
            alert("Cadastrado com sucesso")
        }).catch((error) => {
            alert("Erro ao cadastrar")
        })
    }else{ //senao está alterando um cliente
        fetch('http://localhost:3000/body-builder/' + clienteAlterado.cpf, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            mode: 'cors',
            body: JSON.stringify(novoBodyBuilder)
        }).then(() => {
            alert("Alterado com sucesso")
        }).catch((error) => {
            alert("Erro ao alterar")
        })
    }
    
    ocultarModal()

    limparFormulario()

    carregarClientes()
    return false
}

function limparFormulario(){
    document.getElementById("nome").value = ""
    document.getElementById("cpf").value = ""
    document.getElementById("peso").value = ""
    document.getElementById("altura").value = ""
    document.getElementById("dataNascimento").value = ""
    document.getElementById("sapato").value = ""
}

function atualizarLista(){
    let tbody = document.getElementsByTagName("tbody")[0] //pega o primeiro tbody da página
    tbody.innerHTML = "" //limpa as linhas da tabela
    for(let i = 0; i < clientes.length; i++){
        let cliente = clientes[i]
        
        let linhaTabela = document.createElement("tr")
        linhaTabela.innerHTML = `
            <td>${cliente.gym.nome}</td>
            <td>${cliente.estilo.nome}</td>
            <td>${cliente.cpf}</td>
            <td>${cliente.nome}</td>
            <td>${cliente.peso}kg</td>
            <td>${cliente.altura}m</td>
            <td>${cliente.dataNascimento}</td>
            <td>${cliente.sapato}</td>
            <td>
                <button onclick="alterar('${cliente.cpf}')">Alterar</button>
                <button onclick="excluir('${cliente.cpf}')">Excluir</button>
            </td>`
        
        tbody.appendChild(linhaTabela)
    }
}

function carregarClientes(){
    let busca = document.getElementById("busca").value
    fetch('http://localhost:3000/body-builder?busca=' + busca, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
        mode: 'cors'
    }).then((response) => response.json())
    .then((data) => {
        // console.log(data)
        clientes = data //recebe a lista de clientes do back
        atualizarLista()
    }).catch((error) => {
        console.log(error)
        alert("Erro ao listar clientes")
    })
}

function carregarAcademias(){
    fetch('http://localhost:3000/gym', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
        mode: 'cors'
    }).then((response) => response.json())
    .then((data) => {
        // console.log(data)
        academias = data //recebe a lista de clientes do back
        atualizarListaAcademias()
    }).catch((error) => {
        console.log(error)
        alert("Erro ao listar academias")
    })
}

function carregarEstilos(){
fetch('http://localhost:3000/estilo', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
        mode: 'cors'
    }).then((response) => response.json())
    .then((data) => {
        // console.log(data)
        estilos = data //recebe a lista de clientes do back
        atualizarListaEstilos()
    }).catch((error) => {
        console.log(error)
        alert("Erro ao listar estilos")
    })
}

function atualizarListaAcademias(){
    let listaAcademia = document.getElementById("academia")
    for(let i = 0; i < academias.length; i++){
        let academia = academias[i]
        let option = document.createElement("option")
        option.value = academia.id
        option.innerHTML = academia.nome
        listaAcademia.appendChild(option)
    }
}

function atualizarListaEstilos(){
    let listaEstilo = document.getElementById("estilo")
    for(let i = 0; i < estilos.length; i++){
        let estilo = estilos[i]
        let option = document.createElement("option")
        option.value = estilo.id
        option.innerHTML = estilo.nome
        listaEstilo.appendChild(option)
    }
}
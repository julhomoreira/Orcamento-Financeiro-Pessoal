
class Despesa {
    constructor(ano, mes, dia, tipo, descricao, valor) {
        this.ano = ano
        this.mes = mes
        this.dia = dia
        this.tipo = tipo
        this.descricao = descricao
        this.valor = valor
    }

    validarDados() {
        for(let i in this) {
            if(this[i] == undefined || this[i] == '' || this[i] ==null) {
                return false
            } 
                      
        }
        return true
    }
}

class Bd {

    constructor() {
        let id = localStorage.getItem('id')

        if(id === null) {
            localStorage.setItem('id', 0)
        }
    }

    getProximoId() {
        let proximoId = localStorage.getItem('id')
        return  parseInt(proximoId) + 1
    }


    gravar(d) {
        let id = this.getProximoId()

        localStorage.setItem(id, JSON.stringify(d))

        localStorage.setItem('id', id)
    }

    recuperarTodosRegistros() {

        let despesas = Array()

        let id = localStorage.getItem('id')

        for(let i = 1; i <= id; i ++ ) {
            let despesa = JSON.parse(localStorage.getItem(i))

            if(despesa === null) {
                continue
            }

            despesa.id = i
            despesas.push(despesa)

        }
        return despesas
    }

    pesquisar(despesa) {

        let despesasFiltradas = Array()

        despesasFiltradas = this.recuperarTodosRegistros()

        console.log(despesa)

        console.log(despesasFiltradas)

        //ano
        if(despesa.ano != '') {
            console.log('f.ano')
            despesasFiltradas = despesasFiltradas.filter(d => d.ano == despesa.ano)
        }

        //mes
        if(despesa.mes != '') {
            console.log('f.mes')
            despesasFiltradas = despesasFiltradas.filter(d => d.mes == despesa.mes)
        }
        
        //dia
        if(despesa.dia != '') {
            console.log('f.dia')
            despesasFiltradas = despesasFiltradas.filter(d => d.dia == despesa.dia)
        }

        //tipo
        if(despesa.tipo != '') {
            console.log('f.tipo')
            despesasFiltradas = despesasFiltradas.filter(d => d.tipo == despesa.tipo)
        }

        //descrição
        if(despesa.descricao != '') {
            console.log('f.descrição')
            despesasFiltradas = despesasFiltradas.filter(d => d.descricao == despesa.descricao)
        }

        //valor
        if(despesa.valor != '') {
            console.log('f.valor')
            despesasFiltradas = despesasFiltradas.filter(d => d.valor == despesa.valor)
        }

        return despesasFiltradas

    }
    
    remover(id) {
        localStorage.removeItem(id)
    }
}
// aqui vamos usar o recurso localStorage.setItem('', jSON.strigify) para guardar os dados


let bd = new Bd()

function cadastrarDespesas() {
    let ano = document.getElementById('ano')
    let mes = document.getElementById('mes')
    let dia = document.getElementById('dia')
    let tipo = document.getElementById('tipo')
    let descricao = document.getElementById('descricao')
    let valor = document.getElementById('valor')

    let despesa = new Despesa(
        ano.value,
        mes.value,
        dia.value,
        tipo.value,
        descricao.value,
        valor.value,

    )

    if(despesa.validarDados()) {
        bd.gravar(despesa)
        
        document.getElementById('modal_titulo').innerHTML ='Registro inserido com sucesso!'

        document.getElementById('modal_titulo_div').className = 'modal-header text-success'

        document.getElementById('modal_conteudo').innerHTML = 'Despesa foi cadastrada com sucesso!'

        document.getElementById('modal_btn').innerHTML = 'Voltar'

        document.getElementById('modal_btn').className = 'btn btn-success'

        //dialog de sucesso
        $('#modalRegistraDespesa').modal('show')

        ano.value = ''
        mes.value = ''
        dia.value = ''
        tipo.value = ''
        descricao.value = ''
        valor.value = ''
    } else {

        document.getElementById('modal_titulo').innerHTML ='Erro na inclusão do registro!'
        document.getElementById('modal_titulo_div').className = 'modal-header text-danger'
        document.getElementById('modal_conteudo').innerHTML = 'Erro na gravação, vefique se todos os campos foram preenchidos corretamente!'
        document.getElementById('modal_btn').innerHTML = 'Voltar e Corrigir'
        document.getElementById('modal_btn').className = 'btn btn-danger'




        $('#modalRegistraDespesa').modal('show')
    }

}

function carregaListaDespesas(despesas = Array(), filtro = false) {

    if(despesas == 0 && filtro == false) {
        despesas = bd.recuperarTodosRegistros()
    }
    //selecionando o elemento tbody da table
    let listaDespesas = document.getElementById('listaDespesas')
    listaDespesas.innerHTML = ''

    /*<tr>
        <td>26/04/2022</td>
        <td>Alimentação</td>
        <td>Compras  dp mês</td>
        <td>444.75</td>
    </tr>
    */

    //percorrer o array despesas,listando cada despesa da forma dinâmica
    despesas.forEach(function(d) {
        console.log(d)
        
        // criandoa linha (tr) com insertrow()
        let linha = listaDespesas.insertRow()

        //criar colunas com insertCell() 
        linha.insertCell(0).innerHTML = `${d.dia}/${d.mes}/${d.ano}`

        //ajustar o tipo
        switch(d.tipo) {
            case '1': d.tipo = 'Alimentação'
                break
            case '2': d.tipo = 'Educação'
                break
            case '3': d.tipo = 'Lazer'
                break
            case '4': d.tipo = 'saúde'
                break
            case '5': d.tipo = 'Transporte'
                break
        }

        linha.insertCell(1).innerHTML = d.tipo

        linha.insertCell(2).innerHTML = d.descricao
        linha.insertCell(3).innerHTML = d.valor

        //criar o botão de exclusão
        let btn = document.createElement('button')
        btn.className = 'btn btn-danger'
        btn.innerHTML = '<i class="fas fa-times"></i>'
        btn.id = `id_despesa_${d.id}`
        btn.onclick = function() {
            //remover a despesa
            let id = this.id.replace('id_despesa_', '')
            //alert(id)

            bd.remover(id)

            window.location.reload()
        }
        linha.insertCell(4).append(btn)

        console.log(d)
    })

}


function pesquisarDespesa() {
    let ano = document.getElementById('ano').value
    let mes = document.getElementById('mes').value
    let dia = document.getElementById('dia').value
    let tipo = document.getElementById('tipo').value
    let descricao = document.getElementById('descricao').value
    let valor = document.getElementById('valor').value

    let despesa = new Despesa(ano, mes, dia, tipo, descricao, valor)

    let despesas = bd.pesquisar(despesa)

    this.carregaListaDespesas(despesas, true)

    



}

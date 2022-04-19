let transactionPanel = document.querySelector("tbody.transaction-panel")
let tableTransactions = document.querySelector(".table-transactions")
let clearAllButton = document.getElementById("clear-all")
let nothingHere = document.querySelector(".nothing-here")
let resumeTransactions = document.querySelector(".resume")

let totalValue = document.querySelector('.total-value')

let amountInput = document.querySelector(".amount-input")

//Utilizado para iniciar um novo Storage caso ainda nao exista no dispositivo
function initStorage(){
    if(localStorage.getItem("FinancesData") == null){
        localStorage.setItem("FinancesData", JSON.stringify(transactionsList = []))
    }
}

function calcTotal(){
    let transactionsList = JSON.parse(localStorage.getItem('FinancesData'))
    let total = 0;
    
    for(transaction in transactionsList){
        var actualValue = transactionsList[transaction].amount

        total += actualValue
    }
    return total
}

//Máscara para transformaçao em moeda brasileira
function maskAmount(value, divisor){
    
    value = value.toString().replace(/,/g, "")
    value  = (Number(value)/divisor)

    value = value.toLocaleString('pt-BR',{
        currency: 'BRL',
        style: 'currency',
        minimumFractionDigits:2
    })

    return value
}

let transactionsList = JSON.parse(localStorage.getItem('FinancesData'))
    

//Padrao de renderizaçao do painel de transaçoes
function renderTransactionPanel(){

    totalValue.innerHTML = `${maskAmount(calcTotal(), 1)} <br> ${calcTotal() >= 0? "[Lucro]":"[Prejuizo]" }` 
    
    transactionPanel.innerHTML = ""
    if(transactionsList.length == 0){
        
        nothingHere.classList.remove("none")
        tableTransactions.classList.add("none")
        resumeTransactions.classList.add("none")

    }else{

        tableTransactions.classList.remove("none")
        nothingHere.classList.add("none")
        resumeTransactions.classList.remove("none");
        
        for(var transaction in transactionsList){
            

            var actualAmount = transactionsList[transaction].amount
            
            if(actualAmount < 0){
                actualAmount = actualAmount * -1 
            }

            console.log(actualAmount)
                transactionPanel.innerHTML +=`
            <tr>
                <td>
                    ${transactionsList[transaction].type == "Venda"? "+" : "-"}
                </td>
                <td>
                    ${transactionsList[transaction].description}
                </td>
                <td>
                    ${(maskAmount(actualAmount, 1))}
                </td>
            </tr>
            `
        }
    }
}


//Salva os dados de uma transacao.
function createNewTransaction(data, transaction){
    data.push(transaction)
    localStorage.setItem("FinancesData", JSON.stringify(data))
    renderTransactionPanel()
}

//Pega os dados inputados no form e chama a funcao para salvar os dados
//de uma nova transacao.
function getNewTransaction(event){
    
    event.preventDefault();
    let type = event.target.type.value
    let description = event.target.description.value
    let amount = event.target.amount.value

    amount = amount.replace(/\D/g,"")
    amount = amount.replace(/(\d)(\d{2})$/,"$1.$2");
    amount = Number(amount)

    if(type == "Compra"){
        amount = amount * -1
    }

    let currentTransaction = {
        type: type,
        description: description,
        amount: amount
    }

    createNewTransaction(transactionsList, currentTransaction)
}

function clearAllTransactions(){
    
    localStorage.setItem("FinancesData", JSON.stringify(transactionsList = []))
}

clearAllButton.addEventListener('click', () => {
    clearAllTransactions()
    renderTransactionPanel()
})


let amountNewTransaction = []
amountInput.addEventListener("keydown",(event)=>{


    event.preventDefault()

    if(event.key == "Backspace"){
        amountNewTransaction.pop()
    }


    if((/[0-9]/g).test(event.key)){   
        amountNewTransaction.push(event.key)
    }

    amountInput.value = maskAmount(amountNewTransaction, 100)
})

initStorage()
renderTransactionPanel()


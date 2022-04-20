let transactionPanel = document.querySelector("tbody.transaction-panel")
let tableTransactions = document.querySelector(".table-transactions")
let clearAllButton = document.getElementById("clear-all")
let nothingHere = document.querySelector(".nothing-here")
let resumeTransactions = document.querySelector(".resume")

let youSureModal = document.querySelector(".modal-overlay")
let youSureConfirm = document.querySelector(".confirm")
let youSureCancel = document.querySelector(".cancel")

let assideMenu = document.querySelector("#nav-menu")
let openMenu = document.querySelector("#open-menu")
let closeMenu = document.querySelector("#close-menu")

let mensagesValidationForm = document.querySelector(".text-validation")

let deleteUnitBtn = document.getElementsByClassName("delete-unit-btn")


window.addEventListener('resize', () =>{
    if(window.innerWidth > 768){
        assideMenu.style.display = "flex"
    }else{
        assideMenu.style.display = "none"
    }
})

openMenu.addEventListener("click", ()=>{
    assideMenu.style.display = "flex"
    closeMenu.style.display = "unset"
})
closeMenu.addEventListener("click", ()=>{
    assideMenu.style.display = "none"
})


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
     
    transactionPanel.innerHTML = ""
    if(transactionsList.length == 0){
        
        nothingHere.classList.remove("none")
        tableTransactions.classList.add("none")
        nothingHere.classList.add("fede-in")
    }else{

        nothingHere.classList.remove("fede-in")
        tableTransactions.classList.remove("none")
        nothingHere.classList.add("none")
        tableTransactions.classList.add("fede-in")
        
        for(var transaction in transactionsList){
            

            var actualAmount = transactionsList[transaction].amount
            
            if(actualAmount < 0){
                actualAmount = actualAmount * -1 
            }

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
                <td class="delete-unit-btn" onClick="deleteUnit(${transaction})">
                    <img src="./assets/imgs/delete.svg" alt="deletar transacao">
                </td>
            </tr>
            `
        }
    }
    totalValue.innerHTML = `${maskAmount(calcTotal(), 1)} <br> ${calcTotal() >= 0? "[Lucro]":"[Prejuizo]" }`
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

    if(amount == "0" && description == ""){
        mensagesValidationForm.innerHTML = "Por favor, preencha os campos acima"
    }else 
        if(amount == "0"){
            mensagesValidationForm.innerHTML = "Por favor, insira um valor válido"
            }else 
                if(description == ""){
                    mensagesValidationForm.innerHTML = "Por favor, insira um nome válido"
                }else{

                mensagesValidationForm.classList.add("load")
                mensagesValidationForm.innerHTML = ""
                event.target.description.value = ""
                event.target.amount.value = ""
                
                setTimeout(()=>{
                    createNewTransaction(transactionsList, currentTransaction)

                    mensagesValidationForm.classList.remove("load")
                    mensagesValidationForm.classList.add("done")
                },1500)
                
                setTimeout(()=>{
                    mensagesValidationForm.classList.remove("done")
                    console.log("teste")
                },3500)
                
            }
}

function clearAllTransactions(){
    
    if(transactionsList.length != 0){
    youSureModal.classList.add('on');
    }else{
        alert("Nao existem transaçoes no momento")
    }

    youSureConfirm.addEventListener('click', ()=>{
        localStorage.setItem("FinancesData", JSON.stringify(transactionsList = []))
        youSureModal.classList.remove('on')

        if(window.innerWidth <= 768){
            assideMenu.style.display = "none"
        }

        renderTransactionPanel()
    })

    youSureCancel.addEventListener('click', ()=>{
        youSureModal.classList.remove('on')
    })
}

clearAllButton.addEventListener('click', () => {
        clearAllTransactions()
})

let amountNewTransaction = []

amountInput.addEventListener("focus", ()=>{
    amountNewTransaction = []
    amountInput.value = maskAmount(amountNewTransaction, 100)
})

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


function deleteUnit(index){
    transactionsList.splice(index, 1)
    localStorage.setItem("FinancesData", JSON.stringify(transactionsList))
    renderTransactionPanel()
}


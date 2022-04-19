let navMenu = document.getElementById('nav-menu')
let menu = document.getElementById('menu')
let close = document.getElementById('close')

function changeMenu() {
    if(window.innerWidth > 768){
        navMenu.innerHTML = `<button>Cadastro de transações</button>
        <p class="line"></p>
        <button id="clear-all">Limpar dados</button>`
    }else{
        navMenu.innerHTML =  `<div id="open-menu" class="hamburger-lines">
        <span class="line line1"></span>
        <span class="line line2"></span>
        <span class="line line3"></span>
        </div>`
        
        let menuOn = document.getElementById('open-menu')
        menuOn.addEventListener('click', () =>{
            menu.classList.add('on')
        })

    }
}

changeMenu()

close.addEventListener('click', () =>{
    menu.classList.remove('on')
})
window.addEventListener('resize', () =>{
   changeMenu()
})

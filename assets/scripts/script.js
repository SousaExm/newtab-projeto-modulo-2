let navMenu = document.getElementById('nav-menu')

function changeMenu(){
    if(window.innerWidth > 768){
        navMenu.innerHTML = `<button>Cadastro de transações</button>
        <p class="line"></p>
        <button>Limpar dados</button>`
    }else{
        navMenu.innerHTML =  `<div class="hamburger-lines">
        <span class="line line1"></span>
        <span class="line line2"></span>
        <span class="line line3"></span>
        </div>` 
    }
}

changeMenu()

window.addEventListener('resize', () =>{
   changeMenu()
})

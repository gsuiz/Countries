
const selecionado = document.querySelector("input[name=option]:checked")
const options = document.querySelectorAll("input[name=option]")

const decreaseFont = () => {
    const nameCountry = document.querySelectorAll(".infor__name")
    nameCountry.forEach(item => {
        if(item.innerHTML.length > 36){
            item.style.fontSize = "19px"
        } else if(item.innerHTML.length > 19){
            item.style.fontSize = "22px"
        }
    })

    const screenMobile = window.matchMedia("(max-width:375px)")

    const codScreenMob = () => {
        if(screenMobile.matches){
            nameCountry.forEach(item => {
                if(item.innerHTML.length > 12){
                    item.classList.add("decreaseSize")
                }
            })
        } else {
            nameCountry.forEach(item => item.classList.remove("decreaseSize"))
        }
    }

    codScreenMob()

    screenMobile.addEventListener("change", () => {
        codScreenMob()
    })
}

fetch("data.json")
.then(response => {
    return response.json()
})
.then(data => {
    const select = document.querySelector("#select")
    const options = document.querySelector("#options")
    const countries = document.querySelector(".cards")
    const inputSearch = document.querySelector("#search")
    const mainCountries = ["Estados Unidos", "México","Brasil","Alemanha","Japão","Israel","Canadá","Reino Unido"]

    const addCard = (param) => {
        param.population = param.population.toLocaleString("pt-BR")
        countries.innerHTML += `
        <a href='informations/pais.html?c=${param.alpha2Code}' class="cards__country">
                <img src="${param.flag}" class="country__flag"></img>
                <div class="country__infor">
                    <h2 class="infor__name">${param.translations.pt}</h2>
                    <ul>
                        <li class="infor__item"><strong>Population:</strong><span> ${param.population}</span></li>
                        <li class="infor__item"><strong>Region:</strong><span> ${param.region}</span></li>
                        <li class="infor__item"><strong>Capital:</strong><span> ${param.capital}</span></li>
                    </ul>
                </div>
            </a>
        ` 

        decreaseFont()
    }

    const defaultCards = () => {
        data.forEach(item => {
            if(mainCountries.includes(item.translations.pt)){
                addCard(item)
            }
        })
    }
    defaultCards()

    inputSearch.addEventListener("keyup", () => {
        countries.innerHTML = ""
        select.firstElementChild.innerHTML = "Filter by Region"
        Array.from(options.children).forEach(item => item.classList.remove("marker"))
        if(!inputSearch.value.trim()){
            defaultCards()
        } else {
            data.forEach(item => {
            if(item.translations.pt.toLowerCase().startsWith(inputSearch.value.toLowerCase())){
                addCard(item)
            }
        })
        }
    })

    const check = document.querySelector("#check")
    const arrowSelect = document.querySelector(".menu__img") 

    if(localStorage.getItem("theme")){
        document.querySelector("html").classList.add(localStorage.getItem("theme"))
        document.querySelector(".button__circle").classList.toggle("changeMode")
    }

    check.addEventListener("click", () => {
        localStorage.getItem("theme") ? localStorage.removeItem("theme") : localStorage.setItem("theme","Dark-Mode")
        document.querySelector(".button__circle").classList.toggle("changeMode")
        document.querySelector("html").classList = localStorage.getItem("theme") || ""
    })

    select.addEventListener("click", () => {
        options.classList.toggle("on")
        arrowSelect.classList.toggle("spin")
    })

    options.addEventListener("click", (e) => {
        options.classList.remove("on")
        arrowSelect.classList.remove("spin")
        let timeOut
        for(let item of options.children){
            item.classList = ""
        }
        e.target.classList.add("marker")
        select.firstElementChild.innerHTML = e.target.innerHTML
        countries.innerHTML = ""
        clearTimeout(timeOut)
        data.forEach(item => {
            if(item.region == e.target.innerHTML){
                timeOut = setTimeout(() => {
                    addCard(item)
                },500)
            }
        })
    })

    document.addEventListener("click", (e) => { 
        const optionsChild = document.querySelector("#select").contains(e.target)
        if(!optionsChild){
            options.classList.remove("on")
            arrowSelect.classList.remove("spin")
        }
    })
})

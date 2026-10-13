const cardContainer = document.getElementById("card-container")
const filterContainer = document.getElementById("filter-container")
const countContainer = document.getElementById("count-container")
const totalContainer = document.getElementById("total-container")
const totalWeightContainer = document.getElementById("total-weight-container")
const goldContainer = document.getElementById("gold-container")
const searchField = document.getElementById("search-field")
const filterList = []
let gold = 0


const inventar = [
    {
        id: 1,
        name: "Eisenschwert",
        typ: "waffe",
        wert: 150,
        gewicht: 9,
        seltenheit: "gewöhnlich"
    },
    {
        id: 2,
        name: "Heiltrank",
        typ: "trank",
        wert: 50,
        gewicht: 6,
        seltenheit: "gewöhnlich"
    },
    {
        id: 3,
        name: "Drachenschild",
        typ: "rüstung",
        wert: 900,
        gewicht: 8,
        seltenheit: "episch"
    },
    {
        id: 4,
        name: "Magischer Ring",
        typ: "schmuck",
        wert: 1200,
        gewicht: 12,
        seltenheit: "legendär"
    }
];

fillTheFilters()
showFilters()
showCards()


// Events

document.querySelectorAll(".filters").forEach((element) => {
    element.addEventListener("click", (event) =>{
        showCards(event.target.innerText)
    })
})

document.querySelectorAll(".sort").forEach((element) => {
    element.addEventListener("click", (event) => {
        showCards(cardContainer.dataset.filleredBy, event.target.innerText, event.target.dataset.direction)
        event.target.dataset.direction = event.target.dataset.direction === "ASC" ? "DESC" : "ASC"
    })
})


cardContainer.addEventListener("click",(event) => {
    const button = event.target.closest(".bei")

    if (!button) {
        return;
    }

    const deletedItem = deleteItemById(Number(button.dataset.id))
    gold += deletedItem.wert
    showCards(cardContainer.dataset.filleredBy, cardContainer.dataset.sortedBy, cardContainer.dataset.sortedDirection)
})

cardContainer.addEventListener("click",(event) => {
    const button = event.target.closest(".drink")

    if (!button) {
        return;
    }

    deleteItemById(Number(button.dataset.id))
    showCards(cardContainer.dataset.filleredBy, cardContainer.dataset.sortedBy, cardContainer.dataset.sortedDirection)
})

searchField.addEventListener("input", (event) => {
    if (event.target.value.length >= 2) {
        showCards(cardContainer.dataset.filleredBy, cardContainer.dataset.sortedBy, cardContainer.dataset.sortedDirection, event.target.value)
    } else {
        showCards(cardContainer.dataset.filleredBy, cardContainer.dataset.sortedBy, cardContainer.dataset.sortedDirection)
    }
})


// Functions

function fillTheFilters() {
    for (const card of inventar) {
        if (!filterList.includes(card.typ)) {
            filterList.push(card.typ)
        }
    }
}

function showFilters() {
    for (const filter of filterList) {
        const button = document.createElement("button")
        button.innerText = filter
        button.classList.add("filters")
        filterContainer.appendChild(button)
    }
}

function showCards(filter = "alle", sortAttribute = null, sortDirection = "ASC", searchString = null) {
    resetHtmlItems(cardContainer)

    const filteredList = filterBy(filter)
    const sortedList = sortAttribute ? sortBy(sortAttribute, sortDirection, filteredList) : filteredList
    const searchedList = searchString ? search(searchString, sortedList) : sortedList
    cardContainer.dataset.filleredBy = filter
    cardContainer.dataset.sortedBy = sortAttribute
    cardContainer.dataset.sortedDirection = sortDirection

    for (const card of searchedList) {
        const div = document.createElement("div")
        div.innerHTML = `<h4>${card.name}</h4>
                        <p>Typ: ${card.typ}</p>
                        <p>Wert: ${card.wert}</p>
                        <p>Gewicht: ${card.gewicht}</p>
                        <p>Seltenheit: ${card.seltenheit}</p>
                        <button class="bei" data-id="${card.id}">Verkaufen</button>`
        if (card.typ === "trank") {
            const button = document.createElement("button")
            button.classList.add("drink")
            button.innerText = "Trinken"
            button.dataset.id = card.id
            div.appendChild(button)
        }
        cardContainer.appendChild(div)
    }

    showCount()
    showGold()
    showTotal()
    showTotalWeight()
}

function showCount() {
    countContainer.innerText = `Anzahl: ${inventar.length}`
}

function showGold() {
    goldContainer.innerText = `Gold: ${gold}`
}

function showTotal() {
    const total = inventar.reduce((total, item) => total + item.wert, 0)
    totalContainer.innerText = `Gesamtwert: ${total}€`
}

function showTotalWeight() {
    const totalWeight = inventar.reduce((total, item) => total + item.gewicht, 0)
    if (totalWeight >= 20.0) {
        totalWeightContainer.classList.add("red")
    } else {
        totalWeightContainer.classList.remove("red")
    }

    totalWeightContainer.innerText = `Gesamtgewicht: ${totalWeight} kg`
}

function filterBy(filter) {
    return inventar.filter((element) => filter === "alle" ? true : element.typ === filter)
}

function sortBy(attribute, direction, list) {
    if (direction === "DESC") {
        return list.sort((a,b) => b[attribute] - a[attribute])
    }

    return list.sort((a,b) => a[attribute] - b[attribute])
}

function search(string, list) {
    return list.filter((element) => !!element.name.includes(string))
}

function resetHtmlItems(parent) {
    while (parent.hasChildNodes()) {
        parent.removeChild(parent.firstChild);
    }
}

function findIndexById(id) {
    return inventar.findIndex(item => item.id === id)
}

function deleteItemById(id) {
    const index = findIndexById(id)
    const item = inventar[index]
    inventar.splice(index, 1)

    return item
}


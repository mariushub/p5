const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const id = urlParams.get('id')
const api_url = 'http://localhost:3000/api/products/' + id

let addToCart = document.getElementById('addToCart')

addToCart.addEventListener('click', () => {
    let quantityStr = document.getElementById('quantity').value
    let quantity = parseInt(quantityStr)
    let color = document.getElementById('colors').value
    let price = document.getElementById('price').innerText

    if (quantity == 0 || color == 'none') {alert("nombre d'article ou couleur invalide")}

    let obj = {
        id: id,
        color: color,
        quantity: quantity,
        price: price
    }

    updateCart(obj)
})

function updateCart(newElement) {
    let cart = JSON.parse(localStorage.getItem('cart'))
    let itemInCart = false

    if (cart == null || cart[0] == null) {
        cart = [

        ]
    }

    cart.forEach((cartElement, index) => {
        if(cartElement.id == newElement.id && cartElement.color == newElement.color) {
            cartElement.quantity = cartElement.quantity + newElement.quantity
            itemInCart = true
        }
    })

    if (itemInCart == false ) {
        cart.push(newElement)
    }

    console.log(cart)

    let cartJSON = JSON.stringify(cart);
    localStorage.setItem('cart', cartJSON);
}


async function getData(url) {
    const response = await fetch(url)
    const data = await response.json()
    
    generatePage(data)
}

function generatePage (data) {
    let img = document.getElementById('img')
    let title = document.getElementById('title')
    let price = document.getElementById('price')
    let description = document.getElementById('description')
    let select = document.getElementById('colors')

    data.colors.forEach((color, index) => {
        let option = document.createElement('option')
        option.innerText = color
        option.value = color
        select.appendChild(option)
    });
    
    img.src = data.imageUrl
    img.alt = data.altTxt
    title.innerText = data.name
    price.innerText = data.price
    description.innerText = data.description
}

getData(api_url)

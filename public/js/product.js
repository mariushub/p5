const urlParams = new URLSearchParams(window.location.search);
const api_url = 'http://localhost:3000/api/products/' + urlParams.get('id');
const addToCart = document.getElementById('addToCart');

// call api for data of one product by id
async function getData() {
    const response = await fetch(api_url)
    const data = await response.json()
    return(data)
}

// get data and use it to create html element
window.onload = () => {
    let data = getData()
    data.then((data) => {
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
    })
}

addToCart.addEventListener('click', () => {
    let color = document.getElementById('colors').value;
    let quantity = parseInt(document.getElementById('quantity').value);
    
    // check user input
    if (color === 'none' || quantity === 0) {
        alert("nombre d'article ou couleur invalide");
        return;
    }

    // create js object for the localstorage
    let productValue = {
        id : urlParams.get('id'),
        info : [
            {
                color : color,
                quantity : quantity
            }
        ]
    }

    // create localstorage if it's enpty
    if (localStorageEnpty()) {
        createLocalstorage(productValue);
    } else {
        updateLocalstorage(productValue);
    }


    // check localstorage state return true if empty
    function localStorageEnpty () {
        let datalocalStorage = JSON.parse(localStorage.getItem('cart'))

        if (datalocalStorage === null) {
            return(true)
        } else {
            return(false)
        }
    }

    // create localStorage and push the firts product into it 
    function createLocalstorage (productValue) {
        let datalocalStorage = [];
        datalocalStorage.push(productValue);
        datalocalStorage = JSON.stringify(datalocalStorage);

        localStorage.setItem('cart', JSON.stringify(datalocalStorage));

        alert("Le produit à était ajouté");
    }

    // update localStorage with the new product and check if product already in cart
    function updateLocalstorage (newProduct) {
        let datalocalStorage = JSON.parse(localStorage.getItem('cart'));
        let listId = datalocalStorage.map((canap) => canap.id);
        
        // ajoute tout le product si pas dans le cart
        if (listId.includes(productValue.id)) {
            datalocalStorage.map((canap, indexProduct) => {
                if (canap.id === newProduct.id) {
                    let listColor = canap.info.map(couleurCanap => couleurCanap.color);
                    
                    console.log(listColor);

                    // si la couleur est déjà dans le panier on m'est juste à jour la quantity
                    if (listColor.includes(productValue.info[0].color)) {
                        let indexColor = listColor.indexOf(productValue.info[0].color);

                        datalocalStorage[indexProduct].info[indexColor].quantity = datalocalStorage[indexProduct].info[indexColor].quantity + productValue.info[0].quantity;

                        datalocalStorage = JSON.stringify(datalocalStorage);
                        localStorage.setItem('cart', datalocalStorage);
                        alert("Le produit à était ajouté");
                    // le produit est déjà dans le panier mais pas avec cette couleur
                    } else {
                        datalocalStorage[indexProduct].info.push(productValue.info[0]);
                        datalocalStorage = JSON.stringify(datalocalStorage);
                        localStorage.setItem('cart', datalocalStorage);
                        alert("Le produit à était ajouté");
                    }
                }
            })
        } else {
            datalocalStorage.push(newProduct);
            datalocalStorage = JSON.stringify(datalocalStorage);
            localStorage.setItem('cart', datalocalStorage);
            alert("Le produit à était ajouté");
        }
    }
})

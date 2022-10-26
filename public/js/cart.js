const api_url = "http://localhost:3000/api/products"

let cart = JSON.parse(localStorage.getItem('cart'))
let section = document.getElementById('cart__items')

function updateCart() {
    // clear ancien panier
    section.innerHTML = ''

    // partie cart__price
    updateTotal()

    // update du panier
    cart.forEach(cart_element => {
        let fetchPromise = fetch(api_url + '/' + cart_element.id);
        fetchPromise.then(response => {
            return response.json();
        }).then(data => {
            let cart_item = document.createElement('article')
            let cart_item_img =  document.createElement('div')
            let img =  document.createElement('img')
            let cart_item_content = document.createElement('div')
            let cart_item_content_description = document.createElement('div')
            let item_name = document.createElement('h2')
            let item_color = document.createElement('p')
            let item_price = document.createElement('p')
            let cart_item_content_settings = document.createElement('div')
            let cart_item_content_settings_quantity = document.createElement('div')
            let item_quantity = document.createElement('p')
            let item_input = document.createElement('input')
            let cart_item_content_settings_delete = document.createElement('div')
            let delete_item = document.createElement('p')

            cart_item.appendChild(cart_item_img)
            cart_item.appendChild(cart_item_content)
            cart_item_img.appendChild(img)
            cart_item_content.appendChild(cart_item_content_description)
            cart_item_content.appendChild(cart_item_content_settings)
            cart_item_content_description.appendChild(item_name)
            cart_item_content_description.appendChild(item_color)
            cart_item_content_description.appendChild(item_price)
            cart_item_content_settings.appendChild(cart_item_content_settings_quantity)
            cart_item_content_settings.appendChild(cart_item_content_settings_delete)
            cart_item_content_settings_quantity.appendChild(item_quantity)
            cart_item_content_settings_quantity.appendChild(item_input)
            cart_item_content_settings_delete.appendChild(delete_item)

            cart_item.classList.add('cart__item')
            cart_item_img.classList.add('cart__item__img')
            cart_item_content.classList.add('cart__item__content')
            cart_item_content_description.classList.add('cart__item__content__description')
            cart_item_content_settings.classList.add('cart__item__content__settings')
            cart_item_content_settings_quantity.classList.add('cart__item__content__settings__quantity')
            item_input.classList.add('ItemQuantity')
            cart_item_content_settings_delete.classList.add('cart__item__content__settings__delete')
            delete_item.classList.add('deleteItem')
            delete_item.innerText = 'Supprimer'

            item_input.addEventListener('change', (event) => {
                let element = event.target
                let parent = element.closest('.cart__item')
                let new_value = event.target.value

                cart.forEach((elt, index) => {
                    if(elt.id == parent.getAttribute('data-id') && elt.color == parent.getAttribute('data-color') ) {
                        
                        elt.quantity = new_value

                        localStorage.removeItem('cart')
                        let cartJSON = JSON.stringify(cart);
                        localStorage.setItem('cart', cartJSON);

                        updateTotal()
                    }
                });
            })

            delete_item.addEventListener('click', (event) => {
                element = event.target
                parent = element.closest('.cart__item')

                cart.forEach((elt, index) => {
                    if(elt.id == parent.getAttribute('data-id') && elt.color == parent.getAttribute('data-color') ) {
                        cart.splice(index, 1)
                        localStorage.removeItem('cart')
                        let cartJSON = JSON.stringify(cart);
                        localStorage.setItem('cart', cartJSON);
                        updateCart()
                    }
                });
            })

            cart_item.setAttribute('data-id', cart_element.id);
            cart_item.setAttribute('data-color', cart_element.color)
            img.src = data.imageUrl
            img.alt = data.altTxt
            item_name.innerText = data.name
            item_color.innerText = cart_element.color
            item_price.innerText = data.price + "€"
            item_quantity.innerText = 'Qté : '
            item_input.type = 'number'
            item_input.name = data.name
            item_input.min = '1'
            item_input.max = '100'
            item_input.value = cart_element.quantity
            item_input.innerText = cart_element.quantity
        
            section.appendChild(cart_item) 
        });
    });
}

function updateTotal () {
    let total_quantity = 0
    let total_price = 0

    let span_price = document.getElementById('totalPrice')
    let span_quantity = document.getElementById('totalQuantity')

    cart.forEach(element => {
        total_quantity = total_quantity + parseInt(element.quantity)
        total_price = total_price + parseInt(element.price) * parseInt(element.quantity)
    });

    span_quantity.innerText = ' ' + total_quantity + ' ' 
    span_price.innerText = ' ' + total_price + ' '
} 

updateCart()

let order_btn = document.getElementById('order')

order_btn.addEventListener('click', (event) => {
    event.preventDefault();
    let firstName = document.getElementById('firstName')
    let lastName = document.getElementById('lastName')
    let address = document.getElementById('address')
    let city = document.getElementById('city')
    let email = document.getElementById('email')
    
    if (/^[a-zA-Z ]+$/.test(firstName.value)) {
        if (/^[a-zA-Z ]+$/.test(lastName.value)) {
            if (/^[a-zA-Z0-9\s,'-]*$/.test(address.value)) {
                if (/^[a-zA-Z]+(?:[\s-'.&/][a-zA-Z]+)*(?:[.|\s])?(?:[\(a-z\)])*$/.test(city.value)) {
                    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email.value)) {
                        async function formData () {
                            let form = document.getElementsByClassName('cart__order__form')[0]
                            let products = ['107fb5b75607497b96722bda5b504926']
                            let contact = Object.fromEntries((new FormData(form)).entries())

                            let headers = { 'Content-Type': 'application/json; charset=UTF-8' }
                            let body =  JSON.stringify({ contact, products })
                            let url = 'http://localhost:3000/api/products/order'

                            let req = new Request(url, { method: 'POST',  headers , body })


                            
                            function postData (input) {
                                return fetch(input)
                                    .then((response) => {
                                        if ([ 200, 201 ].includes(response.status)) {
                                            return response.json()
                                        }
                                        return Promise.reject(new Error(response))
                                    })
                            }

                            
                            const { orderId } = await postData(req)

                            window.location.href = "http://127.0.0.1:5500/public/html/confirmation.html?orderId="+ orderId;
                            console.log(orderId)
                        }

                        formData()
                    } else {
                        alert('error email')
                    }
                } else {
                    alert('error city')
                }
            } else {
                alert('error adress')
            }
        } else {
            alert('error last name')
        }
    } else {
        alert('error firts name')
    }
}) 
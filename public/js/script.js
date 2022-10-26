const section = document.getElementById('items')
const api_url = "http://localhost:3000/api/products"

async function getData(url) {
    const response = await fetch(url)
    const data = await response.json()
    
    createArticle(data)
}

function createArticle (elements) {
    elements.forEach((element, index) => {
        const link = document.createElement('a')
        const article = document.createElement('article')
        const image = document.createElement('img')
        const name = document.createElement('h3')
        const description = document.createElement('p')

        link.href = './product.html?id=' + element._id
        image.src = element.imageUrl
        name.innerText = element.name
        description.innerText = element.description

        article.appendChild(image)
        article.appendChild(name)
        article.appendChild(description)

        link.appendChild(article)

        section.appendChild(link)
    });
}

getData(api_url)
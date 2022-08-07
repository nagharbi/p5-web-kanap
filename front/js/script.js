let section = document.getElementById('items');

// affichage de la carte 
function carte (canape) {
    let a = document.createElement('a');
    a.href = "./product.html?id=" + canape._id;
    section.appendChild(a);
    
    let article = document.createElement('article');
    a.appendChild(article);
    
    let img = document.createElement('img');
    img.src = canape.imageUrl;
    img.alt = canape.altTxt;
    article.appendChild(img);
    
    let h3 = document.createElement('h3');
    h3.className = "productName";
    h3.textContent = canape.name;
    article.appendChild(h3);
    
    let text = document.createElement('p');
    text.className = "productDescription";
    text.textContent = canape.description;
    article.appendChild(text);
}

// recuperation de donner de serveur
fetch('http://localhost:3000/api/products')
    .then(response => response.json())
    .then(data => {
        console.log(data);
        // data.length recuperer le nombre total d'un tableau (data)
        for (let i = 0; i < data.length; i++) {
            let canape = data[i];
            carte(canape);
        }
    });
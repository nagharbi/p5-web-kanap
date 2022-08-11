
let urlLocale = window.location.search;
console.log(urlLocale); 
let params = new URLSearchParams(urlLocale);
console.log(params);
let id = params.get('id');

if (params.has('id')) {
     fetch('http://localhost:3000/api/products/' + id)
     .then(response => response.json())
     .then(data => {
         console.log(data);
         afficherProduits(data);
     })
} else {
    console.error("L'id est obligztoire !");
}

function afficherProduits(data) {
    document.title = data.name;
    let itemImg = document.querySelector('.item__img')
    let img = document.createElement('img');
    img.src = data.imageUrl;
    img.alt = data.altTxt;
    itemImg.appendChild(img);

    let title = document.getElementById('title');
    title.textContent = data.name;

    let price = document.getElementById('price');
    price.textContent = data.price;

    let description = document.getElementById('description');
    description.textContent = data.description;
    let select = document.getElementById('colors');
     
    for (let i = 0; i < data.colors.length; i++ ) {
        let color = data.colors[i];
        let option = document.createElement('option');
        option.value = color;
        option.textContent = color;
        select.appendChild(option);
    }
}

let button = document.getElementById('addToCart');
button.addEventListener('click', function() {
    console.log('Click sur button');
    let title = document.getElementById('title');
    let name = title.textContent;
    let eltQuantity = document.getElementById('quantity');
    let quantity = parseInt(eltQuantity.value, 10);
    let eltColors = document.getElementById('colors');
    // Pour récuperer la valeur de la couleur sélectionner 
    let color = eltColors.value;
    if (!color) {
        alert ('Choisir une couleur!')
        return;
    }

    if (quantity < 1 || quantity > 100) {
        alert ('Choisir une quantité valide!')
        return;
    }

    let produit = { id: id, name: name, color: color, quantity: quantity };
    addProduct(produit);
});

// Sauvegarder un produit
function saveProduct(valeur) {
    localStorage.setItem("produits", JSON.stringify(valeur));
}

// Recuperer tous les produits qui sont sauvegarder dans localstorage
function getAllProduct() {
    let produits = localStorage.getItem("produits");
    if (produits == null) {
        return [];
    } else {
        return JSON.parse(produits);
    }
}

// Ajouter les produits au panier
function addProduct(product) {
    let products = getAllProduct();
    let rechercheProduit = products.find(p => p.id == product.id && p.color == product.color);
    if (rechercheProduit != undefined) {
        rechercheProduit.quantity = rechercheProduit.quantity + product.quantity;
    } else {
        products.push(product);
    }
    saveProduct(products);
}

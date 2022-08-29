// Retourner les paramètres de l'url courant
let urlCourant = window.location.search;
console.log(urlCourant);
// URLSearchParams traite l'url search pour récuperer les paramètres. 
let params = new URLSearchParams(urlCourant);
console.log(params);
// get => renvoie la valeur de l'id associée au paramètre de recherche
let id = params.get('id');

// has => Vérifier si le paramètre de recherche id existe ou non
if (params.has('id')) {
    // Appel de l'API
    // On demande uniquement le produit lié à l'id
     fetch('http://localhost:3000/api/products/' + id)
     .then(response => response.json())
     .then(data => {
        console.log(data);
        // Afficher le produit récupérer depuis l'API
        afficherProduits(data);
     })
} else {
    console.error("L'id est obligztoire !");
}

/**
 * Créer et afficher le HTML qui contient le détail du produit
 *
 * @param produit 
 */
function afficherProduits(produit) {
    //Remplir le titre de la page par le nom du produit.
    document.title = produit.name;
    // Récupérer le selecteur .item__img
    let itemImg = document.querySelector('.item__img');
    // Créer l'élément <img> et remplir ces coordonnées src et alt.
    let img = document.createElement('img');
    img.src = produit.imageUrl;
    img.alt = produit.altTxt;
    // Ajouter l'élément <img> sous .item__img
    itemImg.appendChild(img);

    // Récupérer l'élément qui contient l'id title
    let title = document.getElementById('title');
    // Remplir avec le nom du produit.
    title.textContent = produit.name;

    // Récupérer l'élément qui contient l'id price.
    let price = document.getElementById('price');
    // Remplir l'élément avec le prix du produit.
    price.textContent = produit.price;

    // Récupérer l'élément qui contient l'id description.
    let description = document.getElementById('description');
    // Remplir l'élément avec la description du produit.
    description.textContent = produit.description;

    // Récupérer l'élément <select> qui contient l'id colors.
    let select = document.getElementById('colors');
    // Le boucle for parcourir les couleurs du produit pour remplir les options du <select>
    for (let i = 0; i < produit.colors.length; i++) {
        let color = produit.colors[i];
        // Créer l'élément <option>
        let option = document.createElement('option');
        // Remplir la valeur de l'option par la couleur.
        option.value = color;
        option.textContent = color;
        // Ajouter l'élément <option> sous <select>
        select.appendChild(option);
    }
}

// Récupérer l'élément <button> qui contient l'id addToCart
let button = document.getElementById('addToCart');
// Ajouter un event click à l'élément <button>
// addEventListener sera appeler dés qu'on clique sur le boutton Ajouter au panier.
button.addEventListener('click', function() {
    console.log('Click sur button');
    let title = document.getElementById('title');
    // Récupérer le nom du produit depuis le title.
    let name = title.textContent;
    let eltQuantity = document.getElementById('quantity');
    // Récupérer la quantité selectionné.
    let quantity = Number(eltQuantity.value);
    let eltColors = document.getElementById('colors');
    // Pour récuperer la valeur de la couleur sélectionné.
    let color = eltColors.value;
    // Si aucun couleur n'est selectionné on affiche une alerte.
    if (!color) {
        alert ('Choisir une couleur!')
        return;
    }

    // Si la quantité choisi est inférieur à 1 ou supérieur à 100 on affiche une alerte.
    if (quantity < 1 || quantity > 100) {
        alert ('Choisir une quantité valide!')
        return;
    }

    // Créer un objet produit contenant l'id, le nom du produit, la couleur et la quantité.
    let produit = { id: id, name: name, color: color, quantity: quantity };
    // Ajouter l'objet produit au localstorage.
    addProduct(produit);
});


/**
 * Sauvegarder le tableau des produits ajouter au panier.
 *
 * @param produits
 */
function saveProduct(produits) {
    // setItem => ajouter le tableau des produits au clé "produits" du localStorage.
    // JSON.stringify => permet de convertir un tableau ou un objet en chaîne JSON.
    localStorage.setItem("produits", JSON.stringify(produits));
}

/**
 * Récupérer tous les produits qui sont sauvegarder sous localStorage.
 */
function getAllProduct() {
    // getItem => récupérer les produits depuis localStorage avec le clé "produits"
    let produits = localStorage.getItem("produits");
    if (produits == null) { // SI on n'a pas de produit on retourne un tableau vide.
        return [];
    } else { // Si on a de produit on convertir la chaîne JSON en tableau de produit.
        return JSON.parse(produits);
    }
}

/**
 * Ajouter un produit au panier.
 *
 * @param produit
 */
function addProduct(produit) {
    // Récupérer tous les produits qui sont sauvegarder sous localStorage.
    let produits = getAllProduct();
    // find => permet de rechercher un produit par id et couleur.
    // si le produit n'existe pas on retourne undefined
    let rechercheProduit = produits.find(p => p.id == produit.id && p.color == produit.color);
    if (rechercheProduit != undefined) { // Si le produit existe sous le panier on modifie sa quantité 
        if(rechercheProduit.quantity + produit.quantity > 100) { // Si la somme de l'ancien quantité et la nouvelle quantité est supérieur à 100 on affiche une erreur.
            alert('choisir une quantité valide')
            return;
        } else { // si la somme est inférieur à 100 on modifie la quantité du produit dans le panier.
            rechercheProduit.quantity = rechercheProduit.quantity + produit.quantity;
        }
    } else { // on ajoute le produit avec push s'il n'existe pas sous le panier.
        produits.push(produit);
    }

    saveProduct(produits);
    alert ('Le produit à étè ajouter');
}

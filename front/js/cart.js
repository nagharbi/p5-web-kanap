// 1- Récupérer les produits de la localStorage (getItem) : 

let produits = JSON.parse(localStorage.getItem("produits")) || [];
console.log(produits);

// 2 - recuperer l'image ,prix de API: 
let totaleQuantity = 0;
let totalePrice = 0;
let idTotaleQuantity = document.getElementById('totalQuantity');
let idTotalePrice = document.getElementById('totalPrice');
function recupererProduit(produit) {
    fetch('http://localhost:3000/api/products/' + produit.id)
    .then(response => response.json())
    .then(data => {
         console.log(data);
         cart(produit, data);
         // calculer et afficher la quantité totale et le prix (afficher dans le HTML)
         totalePrice = totalePrice + (produit.quantity * data.price);
         totaleQuantity = totaleQuantity + produit.quantity
         idTotaleQuantity.textContent = totaleQuantity;
         idTotalePrice.textContent=totalePrice;         
    });
}
// 3 - boucle for pour parcourir tous les produits de localStorage

for (let i = 0; i < produits.length ; i++) {
    recupererProduit(produits[i]);
}
// 4-  permet d'afficher les details de chaque produit sur HTML

// fonction carte contient en paramétre => produit : les données de produit de la localStorage
//                                      => data : les données de produit de la API 
function cart(produit, data) {
    let article = document.createElement('article');
    article.className = 'cart__item';
    article.setAttribute('data-id', produit.id);
    article.setAttribute('data-color', produit.color);
   
    // Créer <div class="cart__item__img">
    let divImg = document.createElement('div');
    divImg.className = 'cart__item__img';
    let img = document.createElement('img');
    img.src = data.imageUrl;
    img.alt = data.altTxt;
    divImg.appendChild(img);
   
    // Ajouter le div.cart__item__img sous article
    article.appendChild(divImg);
   
    // Créer <div class="cart__item__content">
    let divContent = document.createElement('div');
    divContent.className = 'cart__item__content';
    
    // Créer <div class="cart__item__content__description">
    let divDescription = document.createElement('div');
    divDescription.className = 'cart__item__content__description';
    
    // Ajouter les éléments <h2> et les deux <p> sous divDescription
    let h2 = document.createElement('h2');
    h2.textContent = produit.name;
    let pColor = document.createElement('p');
    pColor.textContent = produit.color;
    let pPrice = document.createElement('p');
    pPrice.textContent = data.price + ' €';
    divDescription.appendChild(h2);
    divDescription.appendChild(pColor);
    divDescription.appendChild(pPrice);
    
    // Créer <div class="cart__item__content__settings">
    let divSettings = document.createElement('div');
    divSettings.className = 'cart__item__content__settings';
    
    // Créer <div class="cart__item__content__settings__quantity">
    let divSettingsQuantity = document.createElement('div');
    divSettingsQuantity.className = 'cart__item__content__settings__quantity';
    
    // Créer <div class="cart__item__content__settings__delete">
    let divSettingsDelete = document.createElement('div');
    divSettingsDelete.className = 'cart__item__content__settings__delete';
    
    // Ajouter les différents éléments du div.cart__item__content__settings__quantity
    let pQuantity = document.createElement('p');
    pQuantity.textContent = 'Qté : ';
    
    // Créer l'élément input
    // ajouter un evenement changer sur l'input  pour modifier la quantité
    let input = document.createElement('input');
    input.addEventListener('change', function(event) {
        // event.target : recuperé l'element de evenement
        let nouvelleQuantity = event.target.value;
        if (nouvelleQuantity < 1 ) {
            alert('La quantité minimale est 1!');
            modifierProduit(produit, 1, data.price);
        } else if (nouvelleQuantity > 100) {
            alert('La quantité maximale est 100!');
            modifierProduit(produit, 100, data.price);
        } else {
            modifierProduit(produit, nouvelleQuantity, data.price);
        }
    });
    input.setAttribute('type', 'number');
    input.setAttribute('name', 'itemQuantity');
    input.setAttribute('class', 'itemQuantity');
    input.setAttribute('value', produit.quantity);
    input.setAttribute('min', 1);
    divSettingsQuantity.appendChild(pQuantity);
    divSettingsQuantity.appendChild(input);
    
    // Ajouter les différents éléments du div.cart__item__content__settings__delete
    let pDeleteItem = document.createElement('p');
    pDeleteItem.className = 'deleteItem';

    // crée un evenement de click sur bouton supprimer  pour retirer  la quantité et le produit 

    pDeleteItem.textContent = 'Supprimer';
    divSettingsDelete.appendChild(pDeleteItem);
    pDeleteItem.addEventListener("click" , function(event){
        //event.target :séléctionner l'element qui est à l'origine de l'événement.
        let supprimer = event.target;
        // closest selectionner l'element parent de l'element qui nous mis en paramétre 
        let article = supprimer.closest('.cart__item');
        //getAttribute :recupérer la valeur d'un attribut
        let dataId = article.getAttribute('data-id')
        let datacolor = article.getAttribute('data-color')
        // rechercher produit dans localStorage
        let removeproduct = produits.find(prod => prod.id == dataId && prod.color == datacolor);
        totaleQuantity -= removeproduct.quantity
        idTotaleQuantity.textContent = totaleQuantity
        totalePrice -= removeproduct.quantity * data.price;
        idTotalePrice.textContent = totalePrice;
        // recuperer tous les produit qui nom pas les memes ID et les memes couleur
        produits = produits.filter(prod => prod.id !== dataId || prod.color !== datacolor )
        localStorage.setItem("produits", JSON.stringify(produits));
        article.remove();
    });
    
    // Ajouter les divs cart__item__content__settings__quantity et cart__item__content__settings__delete sous le div parent cart__item__content__settings
    divSettings.appendChild(divSettingsQuantity);
    divSettings.appendChild(divSettingsDelete);
    
    // Ajouter les divs cart__item__content__description et cart__item__content__settings sous le div parent cart__item__content
    divContent.appendChild(divDescription);
    divContent.appendChild(divSettings);
    
    // Ajouter le div.cart__item__content sous article
    article.appendChild(divContent);
    
    // Ajouter l'élément article sous section
    let section = document.getElementById('cart__items');
    section.appendChild(article);
}

// 5 - fonction crée pour modifier la quantité et le prix sur page panier : 

function modifierProduit(produit, nouvelleQuantity, price) {
    console.log(nouvelleQuantity)
    let diffQuantity = nouvelleQuantity - produit.quantity;
    // number : utilisé pour manipuler les nombres comme des objets
    produit.quantity = Number(nouvelleQuantity);
    totaleQuantity += diffQuantity
    idTotaleQuantity.textContent = totaleQuantity
    totalePrice += diffQuantity * price;
    idTotalePrice.textContent = totalePrice;
    localStorage.setItem("produits", JSON.stringify(produits));
 }

 // 6- la fonction f_commander est appelé au moment du click sur le boutton commander
 // qui permet de valider le formulaire
let commander = document.getElementById('order');
commander.addEventListener('click', f_commander);

// ajouter event click sur button commander
function f_commander(event) {
    event.preventDefault();
    if (produits.length == 0 ){
        alert('votre panier est vide');
        return;
    }
    //si le formulaire est valid 
    if (
        validationFirstName(event) &&
        validationLastName(event) &&
        validationAdresse(event) &&
        validationaVille(event) &&
        validationaEmail(event)
    ) {
        // creé un tableau des ids
        let productsIds = produits.map(prod => prod.id);
        // creé un objet contact
        let contact = {
            firstName: prenom.value,
            lastName: nom.value,
            address: adresse.value,
            city: ville.value,
            email: email.value
        };

        let data = {
            products: productsIds,
            contact: contact
        };

        //j'envoie l'objet data (contact, products) vers l'API avec la méthode POST

        fetch ('http://localhost:3000/api/products/order', {
            method : 'POST',
            headers : {
                'content-type': 'application/json',
                'accept': 'application/json'
            },
            body : JSON.stringify(data)
        })
        //l'API nous retourne le numéro de la commande orderId
        .then(response => response.json())
        .then(data => {
            localStorage.clear();// vider localStorage
            // redirigié vers la page confirmation avec le numero de commande en paramétre sur l'URL
            location.href = 'confirmation.html?orderId='+ data.orderId;
            console.log(data);
       });
    }
}

// j'ai creer des fonctions valider le nom , prenom , adresse , ville et email pour le formulaire qui sont obligatoire 

let prenom = document.getElementById('firstName');
let prenom_error = document.getElementById('firstNameErrorMsg');
let prenom_valeur = /^[a-zA-ZéèïíÉÈÍÏ][a-zéèïíçâä]+([-'\s][a-zA-ZéèïíÉÈÍÏ][a-zéèïíçâä]+)?/; // expression reguliaire

function validationFirstName(event){
    if (prenom.validity.valueMissing){
        event.preventDefault();   // Ne pas submitter le formulaire
        prenom_error.textContent ='Veuillez saisir votre prénom !';
        prenom_error.style.color ='red';
        prenom_error.style.background_color ='red';
        return false;
 
    } else if (prenom_valeur.test(prenom.value) == false) {
        event.preventDefault();
        prenom_error.textContent = 'Le prenom est incorrect !'
        prenom_error.style.color ='orange';
        return false;
    } else {
        prenom_error.textContent ='';
        return true;
    }
}

let nom = document.getElementById('lastName');
let nom_error = document.getElementById('lastNameErrorMsg');
let nom_valeur = /^[a-zA-ZéèïíÉÈÍÏ][a-zéèïíçâä]+([-'\s][a-zA-ZéèïíÉÈÍÏ][a-zéèïíçâä]+)?/;

function validationLastName(event) {
    if (nom.validity.valueMissing){
        event.preventDefault();
        nom_error.textContent = 'veuillez saisir votre nom';
        nom_error.style.color ='red';
        nom_error.style.background_color ='red';
        return false;
    } else if ( nom_valeur.test(nom.value)== false) {
        event.preventDefault();
        nom_error.textContent = 'Le nom est incorrect !'
        nom_error.style.color ='orange';
        nom_error.style.background_color ='orange';
        return false;
    } else {
        nom_error.textContent = '';
        return true;
    }
}

let adresse = document.getElementById('address');
let adresse_error = document.getElementById('addressErrorMsg');
let adresse_valeur =/^([0-9]*) ?([a-zA-Z,\. ]*) ?([0-9]{5}) ?([a-zA-Z])*/

function validationAdresse (event){
    if (adresse.validity.valueMissing){
        event.preventDefault();
        adresse_error.textContent ='veuillez saisir votre adresse '
        adresse_error.style.color ='red';
        adresse_error.style.background_color ='red';
        return false;
    } else if (adresse_valeur.test(adresse.value) == false) {
        event.preventDefault();
        adresse_error.textContent = 'adresse incorrect !'
        adresse_error.style.color ='orange';
        adresse_error.style.background_color ='orange';
        return false;
    } else {
        adresse_error.textContent ='';
        return true;
    }
}

let ville = document.getElementById('city');
let ville_error = document.getElementById('cityErrorMsg');
let ville_valeur =/^[a-zA-Z]+(?:[\s-][a-zA-Z]+)*$/

function validationaVille (event) {
    if (ville.validity.valueMissing) {
        event.preventDefault();
        ville_error.textContent ='veuillez saisir votre ville '
        ville_error.style.color ='red';
        ville_error.style.background_color ='red';
        return false;
    } else if (ville_valeur.test(ville.value) == false) {
        event.preventDefault();
        ville_error.textContent = 'ville incorrect !'
        ville_error.style.color ='orange';
        ville_error.style.background_color ='orange';
        return false;
    } else {
        ville_error.textContent ='';
        return true;
    }
}

let email = document.getElementById('email');
let email_error = document.getElementById('emailErrorMsg');
let email_valeur = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

function validationaEmail (event){
    if (email.validity.valueMissing) {
        event.preventDefault();
        email_error.textContent ='veuillez saisir votre email '
        email_error.style.color ='red';
        email_error.style.background_color ='red';
        return false;
    } else if (email_valeur.test(email.value) == false) {
        event.preventDefault();
        email_error.textContent = 'email est incorrect !'
        email_error.style.color ='orange';
        email_error.style.background_color ='orange';
        return false;
    } else {
        email_error.textContent ='';
        return true;
    }
}

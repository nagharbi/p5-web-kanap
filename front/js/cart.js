let produits = JSON.parse(localStorage.getItem("produits"));
console.log(produits);

let totaleQuantity = 0 
let totalePrice = 0
let idTotaleQuantity = document.getElementById('totalQuantity');
let idTotalePrice = document.getElementById('totalPrice');
function recupererProduit (produit) {
    fetch('http://localhost:3000/api/products/' + produit.id)
    .then(response => response.json())
    .then(data => {
         console.log(data);
         cart(produit, data);
         totalePrice += produit.quantity * data.price
         totaleQuantity += produit.quantity
         idTotaleQuantity.textContent = totaleQuantity;
         idTotalePrice.textContent=totalePrice;         
    });
}

for (let i = 0; i < produits.length ; i++) {
    recupererProduit (produits[i]);
}

function cart (produit, data) {
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
    let input = document.createElement('input');
    input.addEventListener('change', function(event) {
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
    pDeleteItem.textContent = 'Supprimer';
    divSettingsDelete.appendChild(pDeleteItem);
    pDeleteItem.addEventListener("click" , function(event){
        let supprimer = event.target;
        let article = supprimer.closest('.cart__item');
        article.remove();
    })
    
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

function modifierProduit (produit, nouvelleQuantity, price) {
    console.log(nouvelleQuantity)
    let diffQuantity = nouvelleQuantity - produit.quantity;
    produit.quantity = nouvelleQuantity;
    totaleQuantity += diffQuantity
    idTotaleQuantity.textContent = totaleQuantity
    totalePrice += diffQuantity * price;
    idTotalePrice.textContent = totalePrice;
}
 let commander = document.getElementById('order');

 commander.addEventListener('click', f_commander);

 function f_commander(event){
    validationFirstName(event);
    validationLastName(event);
    validationAdresse(event);
    validationaVille(event);
    validationaEmail(event);
 }
 
 //
let prenom = document.getElementById('firstName');
let prenom_error = document.getElementById('firstNameErrorMsg');
let prenom_valeur = /^[a-zA-ZéèïíÉÈÍÏ][a-zéèïíçâä]+([-'\s][a-zA-ZéèïíÉÈÍÏ][a-zéèïíçâä]+)?/;

function validationFirstName(event){
    if (prenom.validity.valueMissing){
        event.preventDefault();   // Ne pas submitter le formulaire
        prenom_error.textContent ='Veuillez saisir votre prénom !';
        prenom_error.style.color ='red';
        prenom_error.style.background_color ='red';
 
    } else if (prenom_valeur.test(prenom.value) == false) {
        event.preventDefault();
        prenom_error.textContent = 'Le prenom est incorrect !'
        prenom_error.style.color ='orange';
    } else {
        prenom_error.textContent ='';
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
    } else if ( nom_valeur.test(nom.value)== false){
        event.preventDefault();
        nom_error.textContent = 'Le nom est incorrect !'
        nom_error.style.color ='orange';
        nom_error.style.background_color ='orange';
    } else {
        nom_error.textContent = '';
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
    }else if (adresse_valeur.test(adresse.value) == false){
        event.preventDefault();
        adresse_error.textContent = 'adresse incorrect !'
        adresse_error.style.color ='orange';
        adresse_error.style.background_color ='orange';
    }else{
        adresse_error.textContent ='';
    }
}

let ville = document.getElementById('city');
let ville_error = document.getElementById('cityErrorMsg');
let ville_valeur =/^[a-zA-Z]+(?:[\s-][a-zA-Z]+)*$/

function validationaVille (event){
    if (ville.validity.valueMissing){
        event.preventDefault();
        ville_error.textContent ='veuillez saisir votre ville '
        ville_error.style.color ='red';
        ville_error.style.background_color ='red';
    }else if (ville_valeur.test(ville.value) == false){
        event.preventDefault();
        ville_error.textContent = 'ville incorrect !'
        ville_error.style.color ='orange';
        ville_error.style.background_color ='orange';
    }else{
        ville_error.textContent ='';
    }
}

let email = document.getElementById('email');
let email_error = document.getElementById('emailErrorMsg');
let email_valeur = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

function validationaEmail (event){
    if (email.validity.valueMissing){
        event.preventDefault();
        email_error.textContent ='veuillez saisir votre email '
        email_error.style.color ='red';
        email_error.style.background_color ='red';
    }else if (email_valeur.test(email.value) == false){
        event.preventDefault();
        email_error.textContent = 'email est incorrect !'
        email_error.style.color ='orange';
        email_error.style.background_color ='orange';
    }else{
        email_error.textContent ='';
    }
}
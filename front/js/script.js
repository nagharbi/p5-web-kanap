let section = document.getElementById('items');

/**
 * Créer et afficher le bloc HTML de la carte par produit
 *
 * @param produit 
 */
function carte (produit) {
    // Créer l'element <a> qui contient le lien vers la page produit.
    let a = document.createElement('a');
    a.href = "./product.html?id=" + produit._id;
    section.appendChild(a);

    // Créer l'élement <article>
    let article = document.createElement('article');
    // Ajouter l'élement <a> sous <article>
    a.appendChild(article);

    // Créer l'élement <img> et ajouter ces attributs src et alt
    let img = document.createElement('img');
    img.src = produit.imageUrl;
    img.alt = produit.altTxt;
    // Ajouter l'élement <img> sous <article>
    article.appendChild(img);

    // Créer l'élément <h3>
    let h3 = document.createElement('h3');
    // Ajouter la classe CSS de l'élément <h3>
    h3.className = "productName";
    h3.textContent = produit.name;
    // Ajouter l'élement <h3> sous <article>
    article.appendChild(h3);

    // Ajouter l'élément <p>
    let text = document.createElement('p');
    // Ajouter la classe CSS de l'élément <p>
    text.className = "productDescription";
    text.textContent = produit.description;
    // Ajouter l'élement <p> sous <article>
    article.appendChild(text);
}

// Appel de l'API
// On appelle la méthode fetch avec l'URL de notre API comme argument
// --- pour récupérer les produits disponible dans le serveur
fetch('http://localhost:3000/api/products')
    .then(response => response.json()) // Fetch nous renvoie une promise, si l'API répond then() sera exécutée, ici pour récupérer le résultat via un JSON
    .then(data => { // Et ensuite le résultat sera traité afin d'être exploitable pour notre application 
        console.log(data);
        // data.length récupérer le nombre total d'un tableau (data)
        // Le boucle for est créé pour parcourir chaque produit disponible.  
        for (let i = 0; i < data.length; i++) {
            let produit = data[i];
            // Appeler la fonction carte pour afficher les détails du produit dans le DOM
            carte(produit);
        }
    });
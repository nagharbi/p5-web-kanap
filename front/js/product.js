
let urlLocale = window.location.search;
console.log(urlLocale); 
let params = new URLSearchParams(urlLocale);
console.log(params);

if (params.has('id')) {
    let id = params.get('id');
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
    let objet = { name: 'shd' };
    localStorage.setItem('ajouter', JSON.stringify(objet));
});

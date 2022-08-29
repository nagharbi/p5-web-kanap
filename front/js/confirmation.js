// Retourner les paramètres de l'url courant
let urlCourant = window.location.search;
// URLSearchParams traite l'url search pour récuperer les paramètres.
let params = new URLSearchParams(urlCourant);
// Renvoie la valeur d'orderId associée au paramètre de recherche.
let orderId = params.get('orderId');
// Récupérer l'élément qui contient l'id orderId
let eltOrderId = document.getElementById('orderId');
// Remplir le contenu de l'élément avec l'orderId
eltOrderId.textContent = orderId;
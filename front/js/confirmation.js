let url_courant = window.location.search;
let params = new URLSearchParams(url_courant);
let id = params.get('orderId');
let eltOrderId = document.getElementById('orderId');
eltOrderId.textContent = id;
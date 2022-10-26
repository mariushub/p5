const urlParams = new URLSearchParams(window.location.search);
document.getElementById('orderId').innerText = urlParams.get('orderId')
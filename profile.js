const currentPage = window.location.pathname.split("/").pop();
console.log(currentPage);
document.querySelectorAll(".nav-link").forEach(link => {
    console.log(link.getAttribute("href"));
    if (link.getAttribute("href") === currentPage) {
    link.classList.add("border-b-2", "border-black", "pb-1");
    }
});

function loadCartFromLocalStorage() {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
        cart = JSON.parse(storedCart);
        cartCount = cart.length;
    }
}
function calculateTotalItems(cart) {
    return  cart.length;
}

// Function to update the cart count in the navbar
function updateNavbarCartCount() {
    const cartLink = document.querySelector('.cart-logo');
    if (cartLink) {
        const totalItems = calculateTotalItems(cart);
        cartLink.textContent = `(${totalItems})`;
    }
}
loadCartFromLocalStorage();
updateNavbarCartCount();

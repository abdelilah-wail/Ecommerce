const productsGrid = document.getElementById('products-grid');
const cartLink = document.querySelector('.cart-logo');
let cartCount = 0;

function renderProducts(filteredProducts) {
    productsGrid.innerHTML = "";
    filteredProducts.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'item-card bg-black text-white p-4 rounded-lg shadow-md';

        productCard.innerHTML = `
            <img src="${product.images[0]}" alt="${product.title}" class="ml-[10%] w-30 h-40 object-cover rounded-md">
            <h2 class="text-lg font-bold mt-2">
                <a href="product.html?title=${encodeURIComponent(product.title)}" class="text-[#9c33ff] hover:underline">
                    ${product.title}
                </a>
            </h2>
            <p class="text-sm text-gray-600">${product.description}</p>
            <p class="text-lg font-bold mt-2">$${product.price}</p>
            <button class="add-to-cart-btn mt-3 ml-[20%] bg-[#9c33ff] text-white py-1 px-4 rounded hover:bg-[#7a29cc]">
                Add to Cart
            </button>
        `;

        const addToCartBtn = productCard.querySelector('.add-to-cart-btn');
        if (addToCartBtn) {
            addToCartBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                cartCount++;
                console.log(`Added to cart: ${product.title}`);
                if (cartLink) {
                    cartLink.textContent = `Cart (${cartCount})`;
                }
            });
        }
        productsGrid.appendChild(productCard);
    });
}

renderProducts(products);
document.querySelectorAll(".category-link").forEach(link => {
    link.addEventListener("click", (e) => {
        e.preventDefault();
        const category = link.dataset.category;
        const filtered = products.filter(p => p.category === category);
        renderProducts(filtered);
    });
});
const currentPage = window.location.pathname.split("/").pop();
document.querySelectorAll(".nav-link").forEach(link => {
    if (link.getAttribute("href") === currentPage) {
        link.classList.add("border-b-2", "border-[#9c33ff]", "pb-1");
    }
});

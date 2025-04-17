const newProductsDiv = document.querySelector('.new-products');
let cartCount = 0;
const cartLink = document.querySelector('.cart-logo');
if (!cartLink) {
    console.warn('Warning: Cart link not found. Ensure the selector matches your HTML.');
}

products.slice(0, 6).forEach(product => {
    const productCard = document.createElement('div');
    productCard.className = 'product-card bg-black text-white p-4 rounded-lg shadow-md mb-4';

    productCard.innerHTML = `
        <div class="item-card">
            <img src="${product.images[0]}" alt="${product.title}" class="ml-[30%] w-30 h-40 object-cover rounded-md">
            <h2 class="text-lg font-bold mt-2">${product.title}</h2>
            <p class="text-sm text-gray-600">${product.description}</p>
            <p class="text-lg font-bold mt-2">$${product.price}</p>
            <button class="add-to-cart-btn mt-3 ml-[35%] bg-[#9c33ff] text-white py-1 px-4 rounded hover:bg-[#7a29cc]">Add to Cart</button>
        </div>
    `;
    const addToCartBtn = productCard.querySelector('.add-to-cart-btn');
    addToCartBtn.addEventListener('click', () => {
        cartCount++;
        console.log(`Added to cart: ${product.title}`);
        if (cartLink) {
            cartLink.textContent = `Cart (${cartCount})`;
        }
    });

    newProductsDiv.appendChild(productCard);
});
const currentPage = window.location.pathname.split("/").pop();
console.log(currentPage);
    document.querySelectorAll(".nav-link").forEach(link => {
        console.log(link.getAttribute("href"));
        if (link.getAttribute("href") === currentPage) {
        link.classList.add("border-b-2", "border-[#9c33ff]", "pb-1");
        }
    });

const urlParams = new URLSearchParams(window.location.search);
const productTitle = urlParams.get("title");

const product = products.find(p => p.title === productTitle);
const detailsContainer = document.getElementById("product-details");
const relatedContainer = document.getElementById("related-products");

if (!product) {
    detailsContainer.innerHTML = "<p>Product not found.</p>";
    }
else {
    let propertiesHTML = '';
    for (const key in product.properties) {
        propertiesHTML += `<p><strong>${key}:</strong> ${product.properties[key]}</p>`;
    }
    detailsContainer.innerHTML = `
        <img src="${product.images[0]}" alt="${product.title}" class="w-[400px] h-[420px] object-cover rounded-lg shadow-md">
        <div>
        <h1 class="text-3xl font-bold text-black font-bold mb-4">${product.title}</h1>
        <p class="mb-2">${product.description}</p>
        <p class="mb-2 text-xl text-[#5C6BC0]">$${product.price}</p>
        <div class="text-sm text-gray-400 mt-4">
            ${propertiesHTML}
        </div>
        </div>
    `;

  // Show related products
    const related = products.filter(p => p.category === product.category && p.title !== product.title);
    related.forEach(r => {
        const productCard = document.createElement('div');
        productCard.className = 'item-card  text-white p-4 rounded-lg shadow-xl';

        productCard.innerHTML = `
            <img src="${r.images[0]}" alt="${r.title}" class="ml-[20%] w-30 h-40 object-cover rounded-md">
            <h2 class="text-lg font-bold mt-2">
                <a href="product.html?title=${encodeURIComponent(r.title)}" class="text-black font-bold hover:underline">
                    ${r.title}
                </a>
            </h2>
            <p class="text-sm text-gray-600">${r.description}</p>
            <p class="text-lg font-bold mt-2 text-[#5C6BC0]">$${r.price}</p>
            <button class="add-to-cart-btn">
                Add to Cart
            </button>
        `;
        relatedContainer.appendChild(productCard);
    });
    }

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

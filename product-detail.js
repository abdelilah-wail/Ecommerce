const urlParams = new URLSearchParams(window.location.search);
const productTitle = urlParams.get("title");

const product = products.find(p => p.title === productTitle);
const detailsContainer = document.getElementById("product-details");
const relatedContainer = document.getElementById("related-products");

if (!product) {
  detailsContainer.innerHTML = "<p>Product not found.</p>";
} else {
  detailsContainer.innerHTML = `
    <img src="${product.images[0]}" alt="${product.title}" class="w-[300px] h-[300px] object-cover rounded-lg shadow-md">
    <div>
      <h1 class="text-3xl font-bold text-[#9c33ff] mb-4">${product.title}</h1>
      <p class="mb-2">${product.description}</p>
      <p class="mb-2 text-xl text-[#9c33ff]">$${product.price}</p>
      <div class="text-sm text-gray-400 mt-4">
        ${Object.entries(product.properties).map(([key, value]) => `<p><strong>${key}:</strong> ${value}</p>`).join('')}
      </div>
    </div>
  `;

  // Show related products
  const related = products.filter(p => p.category === product.category && p.title !== product.title);
  related.forEach(r => {
    const card = document.createElement('a');
    card.href = `product.html?title=${encodeURIComponent(r.title)}`;
    card.className = 'bg-black text-white p-4 rounded-lg shadow-md block';

    card.innerHTML = `
      <img src="${r.images[0]}" alt="${r.title}" class="w-30 h-40 object-cover rounded-md">
      <h3 class="text-lg font-bold mt-2">${r.title}</h3>
      <p class="text-sm text-gray-400">${r.description}</p>
      <p class="text-lg font-bold mt-2 text-[#9c33ff]">$${r.price}</p>
    `;

    relatedContainer.appendChild(card);
  });
}

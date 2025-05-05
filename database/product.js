const dbProducts = {
    products: [
        {
            id: 1,
            title: "iPhone 14 Pro",
            description: "Standard iPhone 14 in black, featuring A15 Bionic chip and dual-camera system.",
            images: ["images/product/iphone14pro.png"],
            category: "Phones",
            properties: {
                brand: "Apple",
                screen: "6.1 inch OLED"
            },
            colorOptions: [
                { color: "Black", image: "images/iphone14pro-black.png" },
                { color: "White", image: "images/iphone14pro-white.png" },
                { color: "Blue", image: "images/iphone14pro-blue.png" }
            ],
            storageOptions: [
                { capacity: "128GB", price: 999 },
                { capacity: "256GB", price: 1099 },
                { capacity: "512GB", price: 1249 }
            ],
            quantity: 1,
            status: "Active"
        },
        {
            id: 2,
            title: "Samsung Galaxy S23 Ultra",
            description: "Flagship Samsung phone with Snapdragon 8 Gen 2 and 200MP camera.",
            images: ["images/product/galaxy-s23-ultra.png"],
            category: "Phones",
            properties: {
                brand: "Samsung",
                screen: "6.8 inch AMOLED"
            },
            colorOptions: [
                { color: "Phantom Black", image: "images/galaxy-s23-ultra-black.png" },
                { color: "Green", image: "images/galaxy-s23-ultra-green.png" },
                { color: "Lavender", image: "images/galaxy-s23-ultra-lavender.png" }
            ],
            storageOptions: [
                { capacity: "256GB", price: 1199 },
                { capacity: "512GB", price: 1399 },
                { capacity: "1TB", price: 1599 }
            ],
            quantity: 5,
            status: "Inactive"
        },
        {
            id: 3,
            title: "MacBook Pro",
            description: "Apple MacBook Pro with M2 Pro chip, 16GB RAM, and 512GB SSD.",
            images: ["images/product/macbook-pro-14.png"],
            category: "Laptops",
            properties: {
                brand: "Apple",
                screen: "14.2 inch Liquid Retina XDR"
            },
            colorOptions: [
                { color: "Space Gray", image: "images/macbook-pro-14-space-gray.png" },
                { color: "Silver", image: "images/macbook-pro-14-silver.png" }
            ],
            storageOptions: [
                { capacity: "512GB", price: 1999 },
                { capacity: "1TB", price: 2499 },
                { capacity: "2TB", price: 2999 }
            ],
            quantity: 0,
            status: "Out of Stock"
        },
        {
            id: 4,
            title: "Dell XPS 13",
            description: "Compact and powerful laptop with Intel i7 processor and 16GB RAM.",
            images: ["images/product/dell-xps-13.png"],
            category: "Laptops",
            properties: {
                brand: "Dell",
                screen: "13.4 inch InfinityEdge"
            },
            colorOptions: [
                { color: "Silver", image: "images/dell-xps-13-silver.png" },
                { color: "Black", image: "images/dell-xps-13-black.png" }
            ],
            storageOptions: [
                { capacity: "512GB", price: 1299 },
                { capacity: "1TB", price: 1499 }
            ],
            quantity: 4,
            status: "Active"
        },
        {
            id: 5,
            title: "Google Pixel 7 Pro",
            description: "Google's flagship phone with Tensor G2 chip and advanced AI features.",
            images: ["images/product/google-pixel-7-pro.png"],
            category: "Phones",
            properties: {
                brand: "Google",
                screen: "6.7 inch OLED"
            },
            colorOptions: [
                { color: "Obsidian", image: "images/google-pixel-7-pro-obsidian.png" },
                { color: "Snow", image: "images/google-pixel-7-pro-snow.png" }
            ],
            storageOptions: [
                { capacity: "128GB", price: 899 },
                { capacity: "256GB", price: 999 }
            ],
            quantity: 6,
            status: "Active"
        },
        {
            id: 6,
            title: "Samsung Galaxy Tab S8",
            description: "High-performance tablet with Snapdragon 8 Gen 1 and S Pen.",
            images: ["images/product/galaxy-tab-s8.png"],
            category: "Tablets",
            properties: {
                brand: "Samsung",
                screen: "11 inch LCD"
            },
            colorOptions: [
                { color: "Graphite", image: "images/galaxy-tab-s8-graphite.png" },
                { color: "Silver", image: "images/galaxy-tab-s8-silver.png" }
            ],
            storageOptions: [
                { capacity: "128GB", price: 899 },
                { capacity: "256GB", price: 999 }
            ],
            quantity: 0,
            status: "Out of Stock"
        },
    ],

    findProductById: function (id) {
        return this.products.find(product => product.id === id);
    },
    getAllProducts: function () {
        return [...this.products];
    },
    updateProductQuantity: function (id, newQuantity) {
        const product = this.findProductById(id);
        if (product) {
            product.quantity = newQuantity;
            return product;
        }
        return null;
    },
    addProduct: function (product) {
        this.products.push(product);
        return product;
    }
};

if (typeof window !== 'undefined') {
    window.dbProducts = dbProducts;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = dbProducts;
}
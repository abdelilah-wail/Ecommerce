const dbUsers = {
    users: [
        {
            id: 1,
            name: "customer1",
            email: "customer1@example.com",
            password: "customer1",
            status: "active",
            role: "customer",
            address: "123 Maple St, Cityville",
            phone: "+1234567890",
            image: "images/avatar/default-avatar.png",
            createdAt: "2023-01-10T00:00:00Z",
            lastLogin: "2023-06-20T00:00:00Z"
        },
        {
            id: 2,
            name: "customer2",
            email: "customer2@example.com",
            password: "customer2",
            status: "active",
            role: "customer",
            address: "456 Pine St, Townsville",
            phone: "+0987654321",
            image: "images/avatar/default-avatar.png",
            createdAt: "2023-02-05T00:00:00Z",
            lastLogin: "2023-06-18T00:00:00Z"
        },
        {
            id: 3,
            name: "customer3",
            email: "customer3@example.com",
            password: "customer3",
            status: "blocked",
            role: "customer",
            address: "789 Birch St, Villagetown",
            phone: "+1122334455",
            image: "images/avatar/default-avatar.png",
            createdAt: "2023-03-15T00:00:00Z",
            lastLogin: "2023-05-01T00:00:00Z"
        },
        {
            id: 4,
            name: "customer4",
            email: "customer4@example.com",
            password: "customer4",
            status: "active",
            role: "customer",
            address: "123 Maple St, Cityville",
            phone: "+1234567890",
            image: "images/avatar/default-avatar.png",
            createdAt: "2023-01-10T00:00:00Z",
            lastLogin: "2023-06-20T00:00:00Z"
        },
        {
            id: 5,
            name: "customer5",
            email: "customer5@example.com",
            password: "customer5",
            status: "active",
            role: "customer",
            address: "456 Pine St, Townsville",
            phone: "+0987654321",
            image: "images/avatar/default-avatar.png",
            createdAt: "2023-02-05T00:00:00Z",
            lastLogin: "2023-06-18T00:00:00Z"
        },
        {
            id: 6,
            name: "customer6",
            email: "customer6@example.com",
            password: "customer6",
            status: "blocked",
            role: "customer",
            address: "789 Birch St, Villagetown",
            phone: "+1122334455",
            image: "images/avatar/default-avatar.png",
            createdAt: "2023-03-15T00:00:00Z",
            lastLogin: "2023-05-01T00:00:00Z"
        },
        {
            id: 7,
            name: "customer7",
            email: "customer7@example.com",
            password: "customer7",
            status: "active",
            role: "customer",
            address: "123 Maple St, Cityville",
            phone: "+1234567890",
            image: "images/avatar/default-avatar.png",
            createdAt: "2023-01-10T00:00:00Z",
            lastLogin: "2023-06-20T00:00:00Z"
        },
        {
            id: 8,
            name: "customer8",
            email: "customer8@example.com",
            password: "customer8",
            status: "active",
            role: "customer",
            address: "456 Pine St, Townsville",
            phone: "+0987654321",
            image: "images/avatar/default-avatar.png",
            createdAt: "2023-02-05T00:00:00Z",
            lastLogin: "2023-06-18T00:00:00Z"
        },
        {
            id: 9,
            name: "customer9",
            email: "customer9@example.com",
            password: "customer9",
            status: "blocked",
            role: "customer",
            address: "789 Birch St, Villagetown",
            phone: "+1122334455",
            image: "images/avatar/default-avatar.png",
            createdAt: "2023-03-15T00:00:00Z",
            lastLogin: "2023-05-01T00:00:00Z"
        }
    ],

    findUserByEmail: function (email) {
        return this.users.find(user => user.email === email);
    },
    findUserById: function (id) {
        return this.users.find(user => user.id === id);
    },
    getAllUsers: function () {
        return [...this.users];
    },
    updateUser: function (id, updates) {
        const index = this.users.findIndex(user => user.id === id);
        if (index !== -1) {
            this.users[index] = { ...this.users[index], ...updates };
            return this.users[index];
        }
        return null;
    },
};

if (typeof window !== 'undefined') {
    window.dbUsers = dbUsers;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = dbUsers;
}
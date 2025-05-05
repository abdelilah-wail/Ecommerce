const dbAdmin = {
    admins: [
        {
            id: 1001,
            name: "Seyf eddine",
            email: "admin@example.com",
            password: "admin123",
            status: "active",
            role: "superAdmin",
            address: "123 Main St, Cityville",
            phone: "+1234567890",
            image: "images/avatar/admin1-avatar.png",
            createdAt: "2023-01-01T00:00:00Z",
            lastLogin: "2023-06-15T00:00:00Z"
        },
        {
            id: 1002,
            name: "Wail nedjar",
            email: "wail@example.com",
            password: "secure456",
            status: "active",
            role: "admin",
            address: "456 Elm St, Townsville",
            phone: "+0987654321",
            image: "images/avatar/admin2-avatar.png",
            createdAt: "2023-02-15T00:00:00Z",
            lastLogin: "2023-06-10T00:00:00Z"
        },
        {
            id: 1003,
            name: "Mounder dehdouh",
            email: "mounder@example.com",
            password: "blocked123",
            status: "blocked",
            role: "admin",
            address: "789 Oak St, Villagetown",
            phone: "+1122334455",
            image: "images/avatar/admin3-avatar.png",
            createdAt: "2023-03-20T00:00:00Z",
            lastLogin: "2023-04-01T00:00:00Z"
        }
    ],

    findAdminByEmail: function (email) {
        return this.admins.find(admin => admin.email === email);
    },
    findAdminById: function (id) {
        return this.admins.find(admin => admin.id === id);
    },
    getAllAdmins: function () {
        return [...this.admins];
    },
    updateAdmin: function(id, updates) {
        const index = this.admins.findIndex(admin => admin.id === id);
        if (index !== -1) {
            this.admins[index] = { ...this.admins[index], ...updates };
            return this.admins[index];
        }
        return null;
    },
};

if (typeof window !== 'undefined') {
    window.dbAdmin = dbAdmin;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = dbAdmin;
}
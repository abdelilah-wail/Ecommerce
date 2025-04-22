const db = {
    admins: [
        {
            id: 1,
            name: "Seyf eddine",
            email: "admin@example.com",
            password: "admin123",
            status: "active",
            role: "superAdmin",
            createdAt: new Date("2023-01-01"),
            lastLogin: new Date("2023-06-15")
        },
        {
            id: 2,
            name: "Wail nedjar",
            email: "wail@example.com",
            password: "secure456",
            status: "active",
            role: "admin",
            createdAt: new Date("2023-02-15"),
            lastLogin: new Date("2023-06-10")
        },
        {
            id: 3,
            name: "Mounder dehdouh",
            email: "mounder@example.com",
            password: "test123",
            status: "blocked",
            role: "admin",
            createdAt: new Date("2023-03-20"),
            lastLogin: new Date("2023-04-01")
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
    window.db = db;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = db;
}
const dbOrders = {
    orders: [
        {
            orderId: "123-4567",
            customer: "John Doe",
            date: "2025-04-28T10:30:00Z",
            status: "Completed",
            total: 150.75
        },
        {
            orderId: "123-4568",
            customer: "Jane Smith",
            date: "2025-04-29T14:15:00Z",
            status: "Pending",
            total: 89.99
        },
        {
            orderId: "123-4569",
            customer: "Michael Brown",
            date: "2025-05-01T09:00:00Z",
            status: "Cancelled",
            total: 0.0
        },
        {
            orderId: "123-4570",
            customer: "Emily Davis",
            date: "2025-05-02T12:45:00Z",
            status: "Processing",
            total: 120.50
        },
        {
            orderId: "123-4571",
            customer: "Chris Wilson",
            date: "2025-05-02T15:30:00Z",
            status: "Completed",
            total: 200.00
        },
        {
            orderId: "123-4572",
            customer: "John Doe",
            date: "2025-04-28T10:30:00Z",
            status: "Completed",
            total: 150.75
        },
        {
            orderId: "123-4573",
            customer: "Jane Smith",
            date: "2025-04-29T14:15:00Z",
            status: "Pending",
            total: 89.99
        },
        {
            orderId: "123-4574",
            customer: "Michael Brown",
            date: "2025-05-01T09:00:00Z",
            status: "Cancelled",
            total: 0.0
        },
        {
            orderId: "123-4575",
            customer: "Emily Davis",
            date: "2025-05-02T12:45:00Z",
            status: "Processing",
            total: 120.50
        },
        {
            orderId: "123-4576",
            customer: "Chris Wilson",
            date: "2025-05-02T15:30:00Z",
            status: "Completed",
            total: 200.00
        },
        {
            orderId: "123-4577",
            customer: "Chris Wilson",
            date: "2025-05-02T15:30:00Z",
            status: "Completed",
            total: 200.00
        }
    ],

    findOrderById: function (orderId) {
        return this.orders.find(order => order.orderId === orderId);
    },
    getAllOrders: function () {
        return [...this.orders];
    },
    updateOrderStatus: function (orderId, newStatus) {
        const order = this.findOrderById(orderId);
        if (order) {
            order.status = newStatus;
            return order;
        }
        return null;
    },
    addOrder: function (order) {
        this.orders.push(order);
        return order;
    }
};

if (typeof window !== 'undefined') {
    window.dbOrders = dbOrders;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = dbOrders;
}
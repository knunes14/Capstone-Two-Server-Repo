const mongoose = require('mongoose');
const Order = require('../models/Order');

describe('Order Model Test', () => {
    // Test instance creation with default values
    it('creates an order with default status', () => {
        const orderData = {
            userId: 'user123',
            products: [{ productId: 'prod123', quantity: 2 }],
            amount: 150,
            address: { street: '123 Main St', city: 'Anytown', country: 'USA' }
        };
        const order = new Order(orderData);

        // Check that the default status is set to 'Pending'
        expect(order.status).toBe('Pending');

        // Check that required fields are correctly set
        expect(order.userId).toEqual(orderData.userId);
        expect(order.amount).toEqual(orderData.amount);
        expect(order.address).toEqual(orderData.address);

        // Check that the nested products array is handled correctly
        expect(order.products.length).toBe(1);
        expect(order.products[0].productId).toBe('prod123');
        expect(order.products[0].quantity).toBe(2);
    });

    // Test validation errors for required fields
    it('should validate required fields', () => {
        try {
            new Order({});  // Trying to create an order without required fields
        } catch (error) {
            // Ensure validation errors are thrown
            expect(error.errors.userId).toBeDefined();
            expect(error.errors.amount).toBeDefined();
            expect(error.errors.address).toBeDefined();
        }
    });
});

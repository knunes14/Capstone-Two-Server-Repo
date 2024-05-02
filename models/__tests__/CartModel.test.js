const mongoose = require('mongoose');
const Cart = require('../models/Cart');

describe('Cart Model Test', () => {
    beforeAll(async () => {
        await mongoose.connect(global.__MONGO_URI__, { useNewUrlParser: true, useCreateIndex: true }, (err) => {
            if (err) {
                console.error(err);
                process.exit(1);
            }
        });
    });

    it('should create a cart with default quantity', async () => {
        const cartData = {
            userId: '12345',
            products: [
                {
                    productId: '67890'
                }
            ]
        };
        const cart = new Cart(cartData);
        // Check that the default quantity is set to 1
        expect(cart.products[0].quantity).toBe(1);

        // Check that the userId and productId are set correctly
        expect(cart.userId).toBe('12345');
        expect(cart.products[0].productId).toBe('67890');
    });

    it('should throw validation error if userId is not provided', async () => {
        expect(() => {
            new Cart({ products: [{ productId: '67890' }] });
        }).toThrow(mongoose.Error.ValidationError);
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });
});

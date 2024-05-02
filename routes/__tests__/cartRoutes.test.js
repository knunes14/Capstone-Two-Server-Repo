const request = require('supertest');
const app = require('../index');

jest.mock('../models/Cart');
jest.mock('../routes/verifyToken', () => ({
    verifyTokenAndAdmin: (req, res, next) => next(),
    verifyTokenAndAuthorization: (req, res, next) => next(),
}));

const Cart = require('../models/Cart');

describe('Cart Routes', () => {
    describe('POST /cart', () => {
        it('should create a new cart', async () => {
            const cartData = { userId: 'user1', items: [{ productId: 'prod1', quantity: 2 }] };
            Cart.prototype.save = jest.fn().mockResolvedValue(cartData);

            const response = await request(app)
                .post('/api/cart')
                .send(cartData);

            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual(cartData);
            expect(Cart.prototype.save).toHaveBeenCalled();
        });
    });

    describe('PUT /cart/:id', () => {
        it('should update a cart', async () => {
            const cartData = { userId: 'user1', items: [{ productId: 'prod1', quantity: 3 }] };
            Cart.findByIdAndUpdate = jest.fn().mockResolvedValue(cartData);

            const response = await request(app)
                .put('/api/cart/1')
                .send({ items: [{ productId: 'prod1', quantity: 3 }] });

            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual(cartData);
            expect(Cart.findByIdAndUpdate).toHaveBeenCalledWith('1', { $set: { items: [{ productId: 'prod1', quantity: 3 }] } }, { new: true });
        });
    });

    describe('DELETE /cart/:id', () => {
        it('should delete a cart', async () => {
            Cart.findByIdAndDelete = jest.fn().mockResolvedValue({});

            const response = await request(app)
                .delete('/api/cart/1');

            expect(response.statusCode).toBe(200);
            expect(response.text).toContain("Cart has been deleted");
            expect(Cart.findByIdAndDelete).toHaveBeenCalledWith('1');
        });
    });

    describe('GET /cart/find/:userId', () => {
        it('should get a user cart', async () => {
            const cartData = { userId: 'user1', items: [] };
            Cart.findOne = jest.fn().mockResolvedValue(cartData);

            const response = await request(app)
                .get('/api/cart/find/user1');

            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual(cartData);
            expect(Cart.findOne).toHaveBeenCalledWith({ userId: 'user1' });
        });
    });

    describe('GET /cart', () => {
        it('should get all carts', async () => {
            const carts = [{ userId: 'user1', items: [] }];
            Cart.find = jest.fn().mockResolvedValue(carts);

            const response = await request(app)
                .get('/api/cart');

            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual(carts);
            expect(Cart.find).toHaveBeenCalled();
        });
    });
});

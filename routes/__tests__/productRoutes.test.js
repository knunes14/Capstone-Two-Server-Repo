const request = require('supertest');
const app = require('../index'); 
const Product = require('../models/Product');

jest.mock('../models/Product'); // Mock the Product model
jest.mock('../routes/verifyToken', () => ({
    verifyTokenAndAdmin: (req, res, next) => next(), // Mock middleware to bypass authentication
}));

describe('Product Routes', () => {
    describe('POST /product', () => {
        it('should create a new product', async () => {
            const productData = { name: 'Test Product', price: 20 };
            Product.prototype.save = jest.fn().mockResolvedValue(productData);

            const response = await request(app)
                .post('/api/product')
                .send(productData);

            expect(response.statusCode).toBe(201);
            expect(response.body).toEqual(productData);
        });

        it('should handle errors when creating a product', async () => {
            Product.prototype.save = jest.fn().mockRejectedValue(new Error('Failed to save product'));
            
            const response = await request(app)
                .post('/api/product')
                .send({ name: 'New Product', price: 20 });

            expect(response.statusCode).toBe(500);
            expect(response.body).toHaveProperty('message', 'Failed to create product');
        });
    });

    describe('PUT /product/:id', () => {
        it('should update a product', async () => {
            const productData = { name: 'Updated Product', price: 25 };
            Product.findByIdAndUpdate = jest.fn().mockResolvedValue(productData);

            const response = await request(app)
                .put('/api/product/1')
                .send(productData);

            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual(productData);
        });
    });

    describe('DELETE /product/:id', () => {
        it('should delete a product', async () => {
            Product.findByIdAndDelete = jest.fn().mockResolvedValue({});

            const response = await request(app)
                .delete('/api/product/1');

            expect(response.statusCode).toBe(200);
            expect(response.text).toContain("Product has been deleted.");
        });
    });

    describe('GET /product/find/:id', () => {
        it('should get a product by id', async () => {
            const productData = { name: 'Specific Product', price: 30 };
            Product.findById = jest.fn().mockResolvedValue(productData);

            const response = await request(app)
                .get('/api/product/find/1');

            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual(productData);
        });
    });

    describe('GET /product', () => {
        it('should get all products', async () => {
            const productsData = [{ name: 'Product 1', price: 10 }, { name: 'Product 2', price: 20 }];
            Product.find = jest.fn().mockResolvedValue(productsData);

            const response = await request(app)
                .get('/api/product');

            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual(productsData);
        });
    });
});

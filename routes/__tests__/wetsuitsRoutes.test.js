const request = require('supertest');
const app = require('../index'); 
const Product = require('../models/Product');

jest.mock('../models/Product');  // Mock the Product model

describe('Recommendations Routes', () => {
    describe('POST /recommend-wetsuits', () => {
        it('should fetch wetsuit recommendations based on provided criteria', async () => {
            const mockProducts = [
                { title: 'Wetsuit A', description: 'Suit A description', img: 'urlA', price: 100, style: 'styleA', material: 'materialA' },
                { title: 'Wetsuit B', description: 'Suit B description', img: 'urlB', price: 150, style: 'styleB', material: 'materialB' }
            ];
            Product.find = jest.fn().mockResolvedValue(mockProducts);

            const response = await request(app)
                .post('/api/recommend-wetsuits')
                .send({
                    categories: 'Men',
                    height: 170,
                    weight: 70,
                    style: 'Fullsuit',
                    material: 'Neoprene'
                });

            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual(mockProducts);
            expect(Product.find).toHaveBeenCalledWith({
                categories: 'men',
                height: { $gte: 155, $lte: 185 },
                weight: { $gte: 50, $lte: 90 },
                style: 'Fullsuit',
                material: 'Neoprene'
            });
            expect(Product.find).toHaveBeenCalledTimes(1);
        });

        it('should handle errors when database query fails', async () => {
            Product.find = jest.fn().mockRejectedValue(new Error('Database query failed'));

            const response = await request(app)
                .post('/api/recommend-wetsuits')
                .send({
                    categories: 'Women',
                    height: 160,
                    weight: 60,
                    style: 'Springsuit',
                    material: 'Polyester'
                });

            expect(response.statusCode).toBe(500);
            expect(response.text).toContain("An error occurred while fetching recommendations");
        });
    });
});

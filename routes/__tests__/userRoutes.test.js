const request = require('supertest');
const app = require('../index'); 
const User = require('../models/User');
const CryptoJS = require('crypto-js');
const jwt = require('jsonwebtoken');

jest.mock('../models/User');  // Mock the User model
jest.mock('crypto-js');
jest.mock('./verifyToken', () => ({
    verifyTokenAndAuthorization: (req, res, next) => next(),
    verifyTokenAndAdmin: (req, res, next) => next(),
}));

describe('User Management Routes', () => {
    describe('PUT /user/:id', () => {
        it('should update the user', async () => {
            User.findByIdAndUpdate = jest.fn().mockResolvedValue({
                _id: '1',
                username: 'updatedUser',
                email: 'user@example.com'
            });

            const response = await request(app)
                .put('/api/user/1')
                .send({ username: 'updatedUser' });

            expect(response.statusCode).toBe(200);
            expect(response.body).toHaveProperty('username', 'updatedUser');
        });
    });

    describe('DELETE /user/:id', () => {
        it('should delete the user', async () => {
            User.findByIdAndDelete = jest.fn().mockResolvedValue({});

            const response = await request(app)
                .delete('/api/user/1');

            expect(response.statusCode).toBe(200);
            expect(response.text).toContain("User has been deleted.");
        });
    });

    describe('GET /user/find/:id', () => {
        it('should retrieve a user by ID', async () => {
            User.findById = jest.fn().mockResolvedValue({
                _doc: {
                    _id: '1',
                    username: 'testUser',
                    email: 'test@example.com',
                    password: 'hashedpassword'
                }
            });

            const response = await request(app)
                .get('/api/user/find/1');

            expect(response.statusCode).toBe(200);
            expect(response.body).toHaveProperty('username', 'testUser');
            expect(response.body).not.toHaveProperty('password');
        });
    });

    describe('GET /user/', () => {
        it('should retrieve all users', async () => {
            User.find = jest.fn().mockResolvedValue([
                { username: 'user1', email: 'user1@example.com' },
                { username: 'user2', email: 'user2@example.com' }
            ]);

            const response = await request(app)
                .get('/api/user');

            expect(response.statusCode).toBe(200);
            expect(response.body.length).toBe(2);
        });
    });
});

const request = require('supertest');
const app = require('../index');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const CryptoJS = require("crypto-js");

jest.mock('../models/User');

describe('Auth Routes', () => {
    describe('POST /register', () => {
        it('should register a new user and return user data', async () => {
            const userData = {
                username: 'testuser',
                email: 'test@test.com',
                password: 'test123'
            };
            const savedUserData = {
                ...userData,
                _id: '1',
                password: CryptoJS.AES.encrypt(userData.password, 'secret').toString(),
            };

            User.prototype.save = jest.fn().mockResolvedValue(savedUserData);

            const response = await request(app)
                .post('/api/auth/register')
                .send(userData);

            expect(response.statusCode).toBe(200);
            expect(response.body).toHaveProperty('username', userData.username);
            expect(response.body).toHaveProperty('email', userData.email);
            expect(response.body).not.toHaveProperty('password');
            expect(User.prototype.save).toHaveBeenCalled();
        });

        it('should handle errors when registration fails', async () => {
            User.prototype.save = jest.fn().mockRejectedValue(new Error('Failed to save'));

            const response = await request(app)
                .post('/api/auth/register')
                .send({
                    username: 'testuser',
                    email: 'test@test.com',
                    password: 'test123'
                });

            expect(response.statusCode).toBe(500);
        });
    });

    describe('POST /login', () => {
        it('should log in the user correctly and return an access token', async () => {
            const userData = {
                username: 'testuser',
                password: 'test123',
                _id: '1',
                isAdmin: false
            };
            const dbUser = {
                ...userData,
                password: CryptoJS.AES.encrypt(userData.password, 'secret').toString()
            };

            User.findOne = jest.fn().mockResolvedValue(dbUser);

            const response = await request(app)
                .post('/api/auth/login')
                .send({
                    username: userData.username,
                    password: userData.password
                });

            expect(response.statusCode).toBe(200);
            expect(response.body).toHaveProperty('accessToken');
            expect(User.findOne).toHaveBeenCalledWith({ username: userData.username });
        });

        it('should reject login with incorrect password', async () => {
            const userData = {
                username: 'testuser',
                password: 'wrongpassword',
            };
            const dbUser = {
                username: 'testuser',
                password: CryptoJS.AES.encrypt('test123', 'secret').toString(),
                _id: '1',
                isAdmin: false
            };

            User.findOne = jest.fn().mockResolvedValue(dbUser);

            const response = await request(app)
                .post('/api/auth/login')
                .send(userData);

            expect(response.statusCode).toBe(401);
        });
    });
});

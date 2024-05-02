const mongoose = require('mongoose');
const User = require('../models/User'); 

describe('User Model Test', () => {
    // Test creation with all required fields
    it('creates a user with all required fields and checks default values', () => {
        const userData = {
            username: "johndoe",
            email: "johndoe@example.com",
            password: "123456"
        };
        const user = new User(userData);

        // Check that the user is created with the correct data
        expect(user.username).toBe(userData.username);
        expect(user.email).toBe(userData.email);
        expect(user.password).toBe(userData.password);
        expect(user.isAdmin).toBe(false); // Default value
        expect(user.profile).toEqual([]); // Check if the profile array is initialized as empty
    });

    // Test required field validations
    it('should validate that required fields are provided', () => {
        const user = new User({});
        const validationError = user.validateSync(); // Validates the user and returns the validation result

        // Ensure validation errors are thrown for missing required fields
        expect(validationError.errors.username).toBeDefined();
        expect(validationError.errors.email).toBeDefined();
        expect(validationError.errors.password).toBeDefined();
    });

    // Check handling of default values for isAdmin
    it('checks default value for isAdmin', () => {
        const userData = {
            username: "janedoe",
            email: "janedoe@example.com",
            password: "securepassword"
        };
        const user = new User(userData);
        expect(user.isAdmin).toBe(false);
    });

    // Verify the reference type for profile
    it('should handle profile references properly', () => {
        const userData = {
            username: "johndoe",
            email: "johndoe@example.com",
            password: "123456",
            profile: [new mongoose.Types.ObjectId(), new mongoose.Types.ObjectId()]
        };
        const user = new User(userData);

        // Check that profile IDs are stored correctly as ObjectIds
        expect(user.profile[0]).toBeInstanceOf(mongoose.Types.ObjectId);
        expect(user.profile[1]).toBeInstanceOf(mongoose.Types.ObjectId);
    });
});

const mongoose = require('mongoose');
const Product = require('../models/Product');

describe('Product Model Test', () => {
    // Test instance creation with all required fields
    it('creates a product with all required fields and default values', () => {
        const productData = {
            title: "High-Quality Wetsuit",
            description: "A very high-quality wetsuit for surfing.",
            img: "http://example.com/image.jpg",
            categories: "Men",
            menSize: ["M", "L"],
            height: 175,
            weight: 75,
            chest: 38,
            waist: 32,
            material: "Geoflex",
            price: 299
        };
        const product = new Product(productData);

        // Check that the product was created with the correct data
        expect(product.title).toBe(productData.title);
        expect(product.description).toBe(productData.description);
        expect(product.img).toBe(productData.img);
        expect(product.categories).toBe(productData.categories);
        expect(product.menSize).toEqual(expect.arrayContaining(productData.menSize));
        expect(product.height).toBe(productData.height);
        expect(product.weight).toBe(productData.weight);
        expect(product.chest).toBe(productData.chest);
        expect(product.waist).toBe(productData.waist);
        expect(product.material).toBe(productData.material);
        expect(product.price).toBe(productData.price);
        expect(product.inStock).toBe(true); // Default value
    });

    // Test required field validations
    it('should validate required fields are provided', () => {
        const productData = {};
        try {
            new Product(productData);
        } catch (error) {
            // Ensure validation errors are thrown
            expect(error.errors.title).toBeDefined();
            expect(error.errors.description).toBeDefined();
            expect(error.errors.img).toBeDefined();
            expect(error.errors.categories).toBeDefined();
            expect(error.errors.height).toBeDefined();
            expect(error.errors.weight).toBeDefined();
            expect(error.errors.chest).toBeDefined();
            expect(error.errors.waist).toBeDefined();
            expect(error.errors.material).toBeDefined();
            expect(error.errors.price).toBeDefined();
        }
    });

    // Test conditional size requirement based on category
    it('should require menSize if categories is Men', () => {
        const productData = {
            title: "Men's Wetsuit",
            description: "A wetsuit for men.",
            img: "http://example.com/mensuit.jpg",
            categories: "Men",
            height: 180,
            weight: 80,
            chest: 40,
            waist: 34,
            style: "Fullsuit",
            material: "Geoflex",
            price: 350
        };
        try {
            new Product(productData);
        } catch (error) {
            expect(error.errors.menSize).toBeDefined();
        }
    });

    it('should require womenSize if categories is Women', () => {
        const productData = {
            title: "Women's Wetsuit",
            description: "A wetsuit for women.",
            img: "http://example.com/womensuit.jpg",
            categories: "Women",
            height: 160,
            weight: 60,
            chest: 36,
            waist: 30,
            style: "Fullsuit",
            material: "Geoprene",
            price: 320
        };
        try {
            new Product(productData);
        } catch (error) {
            expect(error.errors.womenSize).toBeDefined();
        }
    });
});

// const mongoose = require("mongoose");

// const SizeRangeSchema = new mongoose.Schema({
//     size: { type: String, required: true },
//     heightRange: {
//         min: { type: Number, required: true },
//         max: { type: Number, required: true }
//     },
//     weightRange: {
//         min: { type: Number, required: true },
//         max: { type: Number, required: true } 
//     }
// });

// const StyleMaterialSchema = new mongoose.Schema({
//     style: { type: String, required: true },
//     material: { type: String, required: true },
//     sizeRanges: [SizeRangeSchema]
// });

// const CategorySchema = new mongoose.Schema({
//     category: { type: String, required: true, enum: ['Men', 'Women'] },
//     stylesMaterials: [StyleMaterialSchema]
// });


// const ProductSchema = new mongoose.Schema(
//     {
//         title: {
//             type: String,
//             required: true,
//             unique: true
//         },
//         description: {
//             type: String,
//             required: true
//         },
//         img: {
//             type: String,
//             required: true
//         },
//         categories: [CategorySchema],
//         sizes: [SizeRangeSchema],  // Embed size ranges within each product
//         style: {
//             type: String,
//             enum: ['Fullsuit', 'Springsuit', 'Shortsleevefull', 'Longsleevespring']
//         },
//         material: [StyleMaterialSchema],
//         price: {
//             type: Number,
//             required: true
//         },
//         inStock: {
//             type: Boolean,
//             default: true
//         },
//     },
//     { timestamps: true }
// );

// module.exports = mongoose.model("Product", ProductSchema);





const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            unique: true
        },
        description: {
            type: String,
            required: true
        },
        img: {
            type: String,
            required: true
        },
        categories: {
            type: String,
            enum: ['Men', 'Women'],
            required: true
        },
        menSize: {
            type: [String],
            enum: ['XS', 'S', 'ST', 'MS', 'M', 'MT', 'ML', 'LS', 'L', 'LT', 'XLS', 'XL', '2XLS', 'XLT', 'XXL', 'XXXL'],
            required: function() { return this.categories === 'Men'; }
        },
        womenSize: {
            type: [String],
            enum: ['2', '4', '6S', '6', '6T', '8S', '8', '8T', '10S', '10', '10T', '12', '14'],
            required: function() { return this.categories === 'Women'; }
        },
        height: {
            type: Number,
            required: true
        },
        weight: {
            type: Number,
            required: true
        },
        chest: {
            type: Number,
            required: true
        },
        waist: {
            type: Number,
            required: true
        },
        style: {
            type: String,
            enum: ['Fullsuit', 'Springsuit', 'Shortsleevefull', 'Longsleevespring']
        },
        material: {
            type: String,
            enum: ['Geoprene', 'Geoflex'],
            required: true
        },
        price: {
            type: Number,
            required: true
        },
        inStock: {
            type: Boolean,
            default: true
        },
    },
    { timestamps: true }
);


module.exports = mongoose.model("Product", ProductSchema);
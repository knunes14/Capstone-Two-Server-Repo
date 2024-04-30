const express = require('express');
const router = express.Router();
const Product = require('../models/Product') 


router.post('/recommend-wetsuits', async (req, res) => {
    console.log("Received data:", req.body);
    const { categories, height, weight, style, material } = req.body;

    const query = {
        categories: req.body.categories,
        height: { $gte: Number(req.body.height) },
        weight: { $gte: Number(req.body.weight) },
        style: req.body.style,
        material: { $regex: new RegExp('^' + req.body.material + '$', 'i') }  // Case-insensitive matching
      };
    // const query = {
    //     categories: categories.toLowerCase(),
    //     height: { $gte: height - 15, $lte: height + 15 },
    //     weight: { $gte: weight - 20, $lte: weight + 20 },
    //     style: style,
    //     material: material
    // };
    console.log("Querying with:", query);

    try {
        const recommendations = await Product.find(query).select('title description img price style material');
        console.log("Recommendations found:", recommendations);
        res.json(recommendations);
    } catch (error) {
        console.error("Error fetching wetsuits:", error);
        console.error("Error fetching wetsuits:", error);
        res.status(500).send("An error occurred while fetching recommendations.");
    }
});


// POST route to handle wetsuit recommendations
// router.post('/recommend-wetsuits', async (req, res) => {
//     const { categories, height, weight, style, material } = req.body;
//     try {
//         const recommendations = await recommendWetsuits({ categories, height, weight, style, material });
//         res.json(recommendations);
//     } catch (error) {
//         console.error("Error fetching wetsuits:", error);
//         res.status(500).send("An error occurred while fetching recommendations.");
//     }
// });

// Helper function to fetch wetsuit recommendations
// async function recommendWetsuits({ categories, height, weight, style, material }) {
//     const heightTolerance = 15; // Adjust this value based on your application's requirements
//     const weightTolerance = 20; // Adjust this value based on your application's requirements

//     try {
//         const recommendations = await Product.find({
//             categories: categories.toLowerCase(),
//             height: { $gte: height - heightTolerance, $lte: height + heightTolerance },
//             weight: { $gte: weight - weightTolerance, $lte: weight + weightTolerance },
//             style: style,
//             material: material
//         }).select('title description img price style material');

//         return recommendations;
//     } catch (error) {
//         console.error("Failed to fetch wetsuits:", error);
//         throw error;
//     }
// }


module.exports = router;
const express = require('express');
const router = express.Router();
const { Backer } = require('../db/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const path = require('path');

require('dotenv').config({ path: path.resolve(__dirname, '../config/.env') });


router.get("/ok", function(req, res) {
    res.json({ status: "ok" });
})
router.post("/signup", async (req, res) => {
    try {
        const existingBacker = await Backer.findOne({
            $or: [
                { email: req.body.email },
                { username: req.body.username }
            ]
        });

        if (existingBacker) {
            return res.status(400).json({ 
                success: false, 
                message: "Email or username already in use" 
            });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        const newBacker = new Backer({
            fullName: req.body.fullName,
            username: req.body.username,
            email: req.body.email,
            location: req.body.location || "",
            cardDetails: {
                cardNumber: req.body.cardDetails.cardNumber,
                expiryDate: req.body.cardDetails.expiryDate,
                cvv: req.body.cardDetails.cvv
            },
            billingAddress: req.body.billingAddress,
            interests: req.body.interests || [],
            password: hashedPassword
        });
        await newBacker.save();
        const backerResponse = newBacker.toObject();
        delete backerResponse.password;
        
        res.status(201).json({
            success: true,
            backer: backerResponse
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "An error occurred while signing up",
            error: error.message
        });
    }
});
router.post("/signin", async (req, res) => {
    try {
        const { email, password } = req.body;
        const backer = await Backer.findOne({ email });

        if (!backer) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials"
            });
        }
        const validPassword = await bcrypt.compare(password, backer.password);
        if (!validPassword) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials"
            });
        }
        console.log(backer.type)
        const token = jwt.sign(
            { 
                id: backer._id,
                username: backer.username,
                type: backer.type  
            }, 
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );
        const backerResponse = backer.toObject();
        delete backerResponse.password;

        res.json({
            success: true,
            token,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "An error occurred while signing in",
            error: error.message
        });
    }
});

module.exports = router;

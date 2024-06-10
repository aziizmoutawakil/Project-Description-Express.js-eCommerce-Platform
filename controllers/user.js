
require('dotenv').config()
const userSchema = require('../models/User.Schema')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const {generateToken}  = require('../helpers/jwt')
const hashing = require('../helpers/hashing')
const { v4: uuid } = require('uuid')



//login user
exports.LoginUser = async (req, res) => {
    try {
        const { email, password } = req.body

        const user = await userSchema.findOne({ email })
        if (!user) {
            res.status(401).json({ message: 'Authentication failed. User not found.' })
        }

        const MatchPassword = await bcrypt.compare(password, user.password)
        if (!MatchPassword) {
            return res.status(401).json({ message: 'Autentication Faild, Wrong password' })
        }
        delete user.password

       
        const token = generateToken({ userId: user._id }); // Correct function call
        console.log('Generated token:', token); // Debug log for the generated token
        res.set('Authorization', `Bearer ${token}`);

        return res.status(200).json(token )
    } catch (error) {
        console.error('Error logging in user:', error);
        return res.status(500).json({ message: 'An error occurred while logging in user.' })
    }
}


exports.RegisterUser = async (req, res) => {
    try {
        const { email, password, username } = req.body;
        const passwordHashed = await hashing.hashedPassword(password);

        const existingUser = await userSchema.findOne({ email });

        if (existingUser) {
            return res.status(400).send("User already exists");
        }

        const newUser = new userSchema({
            email, username, password: passwordHashed, userid: uuid()
        });

        await newUser.save();
        res.status(201).send("Registered successfully!");

    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).send({ message: "An error occurred while registering user" });
    }
};




//Get one User  
exports.getUserById = async (req, res) => {
    try {
        const { id } = req.params; // Assuming user id is passed as a route parameter
        const user = await userSchema.findById(id); // Updated user data
        if (!user) {
            res.status(404).json({ error: 'user not found' })
        }
        res.json({ data: user })
    } catch (error) {
        console.error('error fetching user', error);
        res.status(500).json({ error: 'An error occurred while fetching user' })

    }
}

//Update User
exports.UpdateUserById = async (req, res) => {
    try {
        const token = req.headers.authorization.split(" ")
        const verify = jwt.verify(token[1], process.env.jwtKey)
        const { userId } = verify
        const updatedUserData = req.body

        // Find the user by ID and update the user information
        const updateuser = await userSchema.findByIdAndUpdate({ _id: userId }, updatedUserData, { new: true });
        if (!updateuser) { res.status(404).json({ error: 'User not found' }) }
        res.json({ data: updateuser })
    }
    catch (error) {
        console.error('error upating user', error)
        res.status(500).json({ error: 'An error occurred while updating user' })
    }
}

//delete user
exports.deleteUserById = async (req, res) => {
    try {
        const { id } = req.params // Get user ID from request parameters
        const deleteUser = await userSchema.findByIdAndDelete(id)
        if (!deleteUser) {
            return res.status(404).json(error, 'User Not Found :(')
        }
        res.json({ message: 'User Deleted Succsessfuly ' })

    } catch (error) {
        console.error('error deleting user', error);
        res.status(500).json({ message: 'An error occurred while deleting user' })
    }
}



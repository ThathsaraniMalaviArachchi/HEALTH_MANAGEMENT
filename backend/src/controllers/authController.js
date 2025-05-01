const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const authController = {
    register: async (req, res) => {
        try {
            const { name, email, password } = req.body;
            
            // Check if user already exists
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ error: 'User with this email already exists' });
            }
            
            const password_hash = await bcrypt.hash(password, 10);
            
            // If it's the admin email, set role to admin
            const role = email === 'admin@mail.com' ? 'admin' : 'user';
            
            const user = new User({ name, email, password_hash, role });
            await user.save();
            
            const token = jwt.sign({ 
                userId: user._id,
                role: user.role 
            }, 'your_jwt_secret', { expiresIn: '24h' });
            
            res.status(201).json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    login: async (req, res) => {
        try {
            const { email, password } = req.body;
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }

            const isValid = await bcrypt.compare(password, user.password_hash);
            if (!isValid) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }

            const token = jwt.sign({ 
                userId: user._id,
                role: user.role 
            }, 'your_jwt_secret', { expiresIn: '24h' });
            
            res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};

module.exports = authController;

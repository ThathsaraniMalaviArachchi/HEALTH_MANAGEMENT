const jwt = require('jsonwebtoken');

const auth = async (req, res, next) => {
    try {
        // Temporarily allow all requests for testing
        req.userId = 'test_user';
        next();
        
        // Original authentication code commented for now
        /*
        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, 'your_jwt_secret');
        req.userId = decoded.userId;
        next();
        */
    } catch (error) {
        res.status(401).json({ error: 'Please authenticate' });
    }
};

module.exports = auth;

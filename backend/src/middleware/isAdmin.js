const isAdmin = (req, res, next) => {
    // Check if user is admin
    if (req.userRole !== 'admin') {
        return res.status(403).json({ error: 'Access denied. Admin privileges required.' });
    }
    next();
};

module.exports = isAdmin;
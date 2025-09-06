

module.exports = (model) => async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;
        const skip = (page - 1) * limit;

        const sortby = req.query.sortby || 'createdAt';
        const order = req.query.order === 'desc' ? -1 : 1;

        const [result, total] = await Promise.all([
            model.find()
                .sort({ [sortby]: order })
                .skip(skip)
                .limit(limit)
                .populate('category', 'name gender')
                .lean(),
            model.countDocuments()
        ]);

        res.paginatedResult = {
            page,
            limit,
            totalPages: Math.ceil(total / limit),
            totalResults: total,
            result
        };

        next();
    } catch (error) {
        console.error('Pagination error:', error);
        res.status(500).json({ message: 'Pagination error' });
    }
};
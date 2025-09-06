

const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    parent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        default: null
    },
    gender: {
        type: String,
        required: true,
        enum: ['men', 'women'] 
    },
    isActive: {
        type: Boolean,
        default: true
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});


CategorySchema.virtual('subcategories', {
    ref: 'Category',
    localField: '_id',
    foreignField: 'parent'
});


CategorySchema.methods.softDelete = function() {
    this.isDeleted = true;
    this.isActive = false;
    return this.save();
};

const Category = mongoose.model('Category', CategorySchema);
module.exports = Category;

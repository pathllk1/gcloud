const mongoose = require('mongoose');

const STOCKSchema = new mongoose.Schema({
    item: {type: String},
    hsn: {type: String},
    qty: {type: Number},
    uom: {type: String},
    rate: {type: Number},
    grate: {type: Number},
    total: {type: Number}
});

const STOCK = mongoose.model('STOCK', STOCKSchema);

module.exports = STOCK;
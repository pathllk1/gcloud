const mongoose = require('mongoose');

const STOCK_REGSchema = new mongoose.Schema({
    type: {type: String},
    bno: {type: String},
    bdate: {type: Date},
    supply: {type: String},
    item: {type: String},
    hsn: {type: String},
    qty: {type: Number},
    qtyh: {type: Number},
    uom: {type: String},
    rate: {type: Number},
    grate: {type: Number},
    cgst: {type: Number},
    sgst: {type: Number},
    igst: {type: Number},
    disc: {type: Number},
    discamt: {type: Number},
    total: {type: Number},
    project: {type: String},
    user: {type: String},
    firm: {type: String}
});

const STOCK_REG = mongoose.model('STOCK_REG', STOCK_REGSchema);

module.exports = STOCK_REG;
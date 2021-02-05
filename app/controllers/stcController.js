const express = require('express');
const router = express.Router();
const { authJwt } = require("../middlewares");
const STOCK = require("../models/stock");
const STOCK_REG = require("../models/stock_reg");

router.get('/',  (req, res) => {
    res.render("stock/index", {
        viewTitle: "ANJAN - STOCK", user: req.user, csrfToken: req.csrfToken()
    });
});

router.post('/save', [authJwt.verifyToken], (req, res) => {
    if (!req.body.id) {
        insertRecord(req, res);
    } else {
        updateRecord(req, res);
    }
});

router.post('/del_upd', [authJwt.verifyToken], (req, res) => {
    STOCK.updateOne({ item: req.body.item },
        {
            item: req.body.item,
            hsn: req.body.hsn,
            qty: req.body.qty,
            uom: req.body.uom,
            rate: req.body.rate,
            grate: req.body.grate,
            total: req.body.total,
        }, { upsert: true }, (err, doc) => {
            if (!err)
                res.send("Data Modified!");
                else {
                    res.send("Error in Data Saving: ")
                }
        })
})

function updateRecord(req, res) {
    STOCK.updateOne({ item: req.body.item },
        {
            item: req.body.item,
            hsn: req.body.hsn,
            qty: req.body.qtyh,
            uom: req.body.uom,
            rate: req.body.rate,
            grate: req.body.grate,
            total: req.body.total1,
        }, { upsert: true }, (err, doc) => {
            if (err)
                res.send("Error in Data Saving: " + err);
        })
    STOCK_REG.findById(req.body.id, function (err, p1) {
        if (!p1)
            res.send("Error in Data Saving: " + err);
        else {
            p1.type = req.body.type;
            p1.bno = req.body.bno;
            p1.bdate = req.body.bdate;
            p1.supply = req.body.supply;
            p1.item = req.body.item;
            p1.hsn = req.body.hsn;
            p1.qty = req.body.qty;
            p1.qtyh = req.body.qtyh;
            p1.uom = req.body.uom;
            p1.rate = req.body.rate;
            p1.grate= req.body.grate,
            p1.total = req.body.total;
            p1.project = req.body.project;
            p1.save().then(emp => {
                res.json('Stock Updated Successfully');
            }).catch(err => {
                res.status(400).send("Unable To Update Stock");
            });
        }
    })
}

function insertRecord(req, res) {
    STOCK.updateOne({ item: req.body.item },
        {
            item: req.body.item,
            hsn: req.body.hsn,
            qty: req.body.qtyh,
            uom: req.body.uom,
            rate: req.body.rate,
            grate: req.body.grate,
            total: req.body.total1,
        }, { upsert: true }, (err, doc) => {
            if (err)
                res.send("Error in Data Saving: " + err);
            else {
                const p = new STOCK_REG();
                p.type = req.body.type;
                p.bno = req.body.bno;
                p.bdate = req.body.bdate;
                p.supply = req.body.supply;
                p.item = req.body.item;
                p.hsn = req.body.hsn;
                p.qty = req.body.qty;
                p.qtyh = req.body.qtyh;
                p.uom = req.body.uom;
                p.rate = req.body.rate;
                p.grate= req.body.grate,
                p.disc= req.body.disc,
                p.discamt= req.body.discamt,
                p.total = req.body.total;
                p.project = req.body.project;
                p.save((err, doc) => {
                    if (err)
                        res.send("Error in Data Saving: " + err);
                    else {
                        res.send("Data Saved Successfully");
                    }
                });
            }
        })
}

router.get('/list_stock', [authJwt.verifyToken], (req, res) => {
    STOCK.find((err, docs) => {
        if (!err) {
            res.json(docs)
        } else {
            console.log('Error in retrieving STOCK list: ' + err);
        }
    });
});

router.get('/list_stock_reg', [authJwt.verifyToken], (req, res) => {
    STOCK_REG.find((err, docs) => {
        if (!err) {
            res.json(docs)
        } else {
            console.log('Error in retrieving STOCK list: ' + err);
        }
    });
});

router.post('/get_item', [authJwt.verifyToken], (req, res) => {
    STOCK_REG.findOne({ '_id': req.body.id }, (err, docs) => {
        if (!err) {
            res.json(docs)
        } else {
            console.log('Error in retrieving STOCK item: ' + err);
        }
    })
})

router.post('/get_item_by_name', [authJwt.verifyToken], (req, res) => {
    STOCK.findOne({ 'item': req.body.item }, (err, docs) => {
        if (!err) {
            res.json(docs)
        } else {
            console.log('Error in retrieving STOCK item: ' + err);
        }
    })
})

router.delete('/del_item', [authJwt.verifyToken], (req, res) => {
    STOCK_REG.deleteOne({ '_id': req.body.id }, (err, docs) => {
        if (!err) {
            res.send(req.body.id)
        } else {
            res.send('Error in retrieving STOCK item: ' + err);
        }
    })
})

module.exports = router;
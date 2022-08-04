const Item = require('./item')
const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
    try {
        return res.json(Item.findAll())
    } catch(err) {
        return next(err);
    }
})

router.get('/:name', (req, res, next) => {
    try{
        console.log(req.params.name)
        let foundItem = Item.find(req.params.name);
        return res.json(foundItem)
    } catch(err) {
        return next(err)
    }
})

router.post('/', (req, res) => {
    const item = new Item(req.body.name, req.body.price);
    return res.json({'added': item})
})

router.patch('/:name', (req, res, next) => {
    try {
        let foundItem = Item.update(req.params.name, req.body);
        return res.json({"updated": foundItem});
    } catch(err) {
        return next(err);
    }
})

router.delete('/:name', (req, res, next) => {
    try {
        Item.delete(req.params.name);
        return res.json({message: 'Deleted'});
    } catch(err) {
        return next(err)
    }
})

module.exports = router;
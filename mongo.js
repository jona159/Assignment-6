var express = require('express');
var router = express.Router();
var path = require('path');
const mongodb = require('mongodb');

/* GET home page. */
router.get("/", (req, res) => {

    // find all
    app.locals.db.collection('item').find({}).toArray((error, result) => {
        if (error) {
            console.dir(error);
        }
        console.log(result);
        res.json(result);
    });
});

router.post("/", (req, res) => {
    // insert item
    console.log("insert item " + JSON.stringify(req.body));
    app.locals.db.collection('item').insertOne(req.body, (error, result) => {
        if (error) {
            console.dir(error);
        }
        res.json(result);
    });
});

router.put("/", (req, res) => {
    // update item
    console.log("update item " + req.body._id);
    let id = req.body._id;
    console.log(req.body); // => { name:req.body.name, description:req.body.description }
    app.locals.db.collection('item').updateOne({_id: new mongodb.ObjectID(id)}, {$set: req.body.object}, (error, result) => {
        if (error) {
            console.dir(error);
        }
        res.json(result);
    });
});

router.delete("/", (req, res) => {
    // delete item
    console.log("delete item" + JSON.stringify(req.body));
    app.locals.db.collection('item').deleteOne({_id: new mongodb.ObjectID(req.body._id)}, (error, result) => {
        if (error) {
            console.dir(error);
        }
        res.json(result);
    });
});

router.delete("/all", (req, res) => {
    // delete item
    console.log("delete item " + JSON.stringify(req.body));
    let objectId = "ObjectId(" + req.body._id + ")";
    app.locals.db.collection('item').deleteMany({}, (error, result) => {
        if (error) {
            console.dir(error);
        }
        res.json(result);
    });
});

module.exports = router;
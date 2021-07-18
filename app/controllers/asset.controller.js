const db = require("../models");
const Asset = db.assets;

//get all crypto

exports.getAllAssets = (req, res) => {
    const rp = require('request-promise');
    const requestOptions = {
        method: 'GET',
        uri: 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest',
        qs: {
            'start': '1',
            'limit': '5000',
            'convert': 'USD'
        },
        headers: {
            'X-CMC_PRO_API_KEY': '1b86a12a-b486-4b77-b7fe-a46457149f31'
        },
        json: true,
        gzip: true
    };
    rp(requestOptions).then(response => {
        res.send(response.data);
    }).catch((err) => {
        console.log('API call error:', err.message);
    });
}

// Create and Save a new asset
exports.create = (req, res) => {
    // Validate request
    if (!req.body.name) {
        res.status(400).send({ message: "Content can not be empty!" });
        return;
    }

    // Create a asset
    const asset = new Asset({
        name: req.body.name,
        description: req.body.description
    });

    // Save asset in the database
    asset
        .save(asset)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the asset."
            });
        });
};

// Retrieve all assets from the database.
exports.findAll = (req, res) => {
    const name = req.query.name;
    var condition = name ? { name: { $regex: new RegExp(name), $options: "i" } } : {};

    Asset.find(condition)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving assets."
            });
        });
};

// Find a single asset with an id
exports.findOne = (req, res) => {
    const id = req.params.id;

    Asset.findById(id)
        .then(data => {
            if (!data)
                res.status(404).send({ message: "Not found asset with id " + id });
            else res.send(data);
        })
        .catch(err => {
            res
                .status(500)
                .send({ message: "Error retrieving asset with id=" + id });
        });
};

// Update a asset by the id in the request
exports.update = (req, res) => {
    if (!req.body) {
        return res.status(400).send({
            message: "Data to update can not be empty!"
        });
    }

    const id = req.params.id;

    Asset.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
        .then(data => {
            if (!data) {
                res.status(404).send({
                    message: `Cannot update Asset with id=${id}. Maybe Asset was not found!`
                });
            } else res.send({ message: "Asset was updated successfully." });
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating Asset with id=" + id
            });
        });
};

// Delete a asset with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;

    Asset.findByIdAndRemove(id)
        .then(data => {
            if (!data) {
                res.status(404).send({
                    message: `Cannot delete Asset with id=${id}. Maybe Asset was not found!`
                });
            } else {
                res.send({
                    message: "Asset was deleted successfully!"
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete Asset with id=" + id
            });
        });
};

// Delete all Assets from the database.
exports.deleteAll = (req, res) => {
    Asset.deleteMany({})
        .then(data => {
            res.send({
                message: `${data.deletedCount} Asset were deleted successfully!`
            });
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while removing all assets."
            });
        });
};

// Find all published assets
exports.findAllPublished = (req, res) => {
    Asset.find({ published: true })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving assets."
            });
        });
};
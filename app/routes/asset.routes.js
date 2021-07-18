module.exports = app => {
    const assets = require("../controllers/asset.controller");

    var router = require("express").Router();

    // Create a new assets
    router.post("/", assets.create);

    // Retrieve all assets
    router.get("/", assets.findAll);

    router.get("/getAllAssets", assets.getAllAssets);

    // Retrieve a single crypto with id
    router.get("/getCryptoInfo", assets.getCryptoInfo);

    // Retrieve all published assets
    router.get("/published", assets.findAllPublished);

    // Retrieve a single assets with id
    router.get("/:id", assets.findOne);

    // Update a assets with id
    router.put("/:id", assets.update);

    // Delete a assets with id
    router.delete("/:id", assets.delete);

    // Create a new assets
    router.delete("/", assets.deleteAll);

    app.use('/api/assets', router);
};
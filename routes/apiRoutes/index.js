const router = require("express").Router();
const noteRoutes = require("./noteRoutes");

router.use(noteRoutes);

module.exports = router;

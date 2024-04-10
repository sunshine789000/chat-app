const express = require('express');
const router = express.Router();

const chatController = require("../../controller/v1/chats");

const auth = require("../../middleware/auth");
const {
    validateSchema,
    validateSchemaGet,
} = require("../../utilities/validation");
const schema = require("../../schema/v1/chat");
router.post("/register", validateSchema(schema.register), chatController.register);
router.post("/login", validateSchema(schema.register), chatController.login);
router.get("/userexists/:username", chatController.userexists);

module.exports = router;

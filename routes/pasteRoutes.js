const { createPaste, healthCheck, getPasteApi, viewPasteHtml } = require("../controllers/pasteController");
const express = require("express");

const router = express.Router();

router.get("/api/healthz", healthCheck);
router.post("/api/pastes", createPaste);
router.get("/p/:id",viewPasteHtml)
router.get("/api/pastes/p/:id", getPasteApi);
router.get("/api/pastes/:id", getPasteApi);

module.exports = router;

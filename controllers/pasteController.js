const mongoose = require("mongoose");
const Paste = require("../models/paste");
const getCurrentTime=require("../utils/getCurrentTime")

exports.healthCheck = async (req, res) => {
  try {
    // Check MongoDB connection
    if (mongoose.connection.readyState !== 1) {
      return res.status(500).json({ ok: false });
    }

    res.status(200).json({ ok: true });
  } catch (err) {
    res.status(500).json({ ok: false });
  }
};

exports.createPaste = async (req, res) => {
  try {
    const { content, ttl_seconds, max_views } = req.body;

    console.log("maxview",ttl_seconds);
    // Validation
    if (!content || typeof content !== "string" || content.trim() === "") {
      return res.status(400).json({ error: "Content is required" });
    }

    if (ttl_seconds && (!Number.isInteger(ttl_seconds) || ttl_seconds < 1)) {
      return res.status(400).json({ error: "Invalid ttl_seconds" });
    }

    if (max_views && (!Number.isInteger(max_views) || max_views < 1)) {
      return res.status(400).json({ error: "Invalid max_views" });
    }

    let expiresAt = null;
    if (ttl_seconds) {
      expiresAt = new Date(Date.now() + ttl_seconds * 1000);
    }

    const paste = await Paste.create({
      content,
      expiresAt,
      maxViews: max_views || null,
    });

    res.status(201).json({
      id: paste._id,
      url: `${process.env.BASE_URL}/p/${paste._id}`,
    });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};
exports.getPasteApi = async (req, res) => {
  try {
    console.log("req id",req.params.id);
    const paste = await Paste.findById(req.params.id);
    console.log(paste)
    if (!paste) return res.status(404).json({ error: "Not found" });

    const now = getCurrentTime(req);
    console.log("now",now);

    // TTL check
    if (paste.expiresAt && now > paste.expiresAt) {
      return res.status(404).json({ error: "Expired" });
    }

    // View limit check
    if (paste.maxViews !== null && paste.viewsUsed >= paste.maxViews) {
      return res.status(404).json({ error: "View limit exceeded" });
    }

    // Increment views safely
    paste.viewsUsed += 1;
    await paste.save();

    res.status(200).json({
      content: paste.content,
      remaining_views:
        paste.maxViews === null
          ? null
          : Math.max(paste.maxViews - paste.viewsUsed, 0),
      expires_at: paste.expiresAt,
    });
  } catch (err) {
    res.status(404).json({ error: "Invalid ID" });
  }
};
exports.viewPasteHtml = async (req, res) => {
  const paste = await Paste.findById(req.params.id);
  if (!paste) return res.status(404).send("Not Found");

  const now = getCurrentTime(req);

  if (paste.expiresAt && now > paste.expiresAt) {
    return res.status(404).send("Expired");
  }

  if (paste.maxViews !== null && paste.viewsUsed >= paste.maxViews) {
    return res.status(404).send("View limit exceeded");
  }

  paste.viewsUsed += 1;
  await paste.save();

  res.send(`
    <html>
      <body>
        <pre>${escapeHtml(paste.content)}</pre>
      </body>
    </html>
  `);
};
function escapeHtml(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

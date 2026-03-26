import { getAllKeys, createKey } from "../../../lib/keyStore";

export default async function handler(req, res) {
  res.setHeader("Content-Type", "application/json");

  switch (req.method) {

    case "GET": {
      try {
        const keys = await getAllKeys();
        return res.status(200).json({ keys: Array.isArray(keys) ? keys : [] });
      } catch (error) {
        return res.status(500).json({
          error: "Failed to retrieve API keys.",
        });
      }
    }

    case "POST": {
      try {
        const { label } = req.body || {};

        if (!label || typeof label !== "string" || !label.trim()) {
          return res.status(400).json({
            error: "Label is required",
          });
        }

        if (label.trim().length > 64) {
          return res.status(400).json({
            error: "Label too long",
          });
        }

        const newKey = await createKey(label.trim());

        return res.status(201).json(newKey);
      } catch (error) {
        return res.status(500).json({
          error: "Failed to create API key",
        });
      }
    }

    default: {
      res.setHeader("Allow", ["GET", "POST"]);
      return res.status(405).json({
        error: "Method not allowed",
      });
    }
  }
}
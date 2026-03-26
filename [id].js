import { getKeyById, revokeKey } from "../../../lib/keyStore";

export default async function handler(req, res) {
  res.setHeader("Content-Type", "application/json");

  const { id } = req.query;

  if (!id || typeof id !== "string" || !id.trim()) {
    return res.status(400).json({
      error: "Invalid id",
    });
  }

  const keyId = id.trim();

  switch (req.method) {

    case "GET": {
      try {
        const key = await getKeyById(keyId);

        if (!key) {
          return res.status(404).json({
            error: "Key not found",
          });
        }

        return res.status(200).json(key);
      } catch {
        return res.status(500).json({
          error: "Failed to fetch key",
        });
      }
    }

    case "DELETE": {
      try {
        const key = await getKeyById(keyId);

        if (!key) {
          return res.status(404).json({
            error: "Key not found",
          });
        }

        const revoked = await revokeKey(keyId);

        return res.status(200).json({
          success: true,
          key: revoked,
        });
      } catch {
        return res.status(500).json({
          error: "Failed to revoke key",
        });
      }
    }

    default: {
      res.setHeader("Allow", ["GET", "DELETE"]);
      return res.status(405).json({
        error: "Method not allowed",
      });
    }
  }
}
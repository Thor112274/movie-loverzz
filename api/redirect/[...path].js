import { MongoClient } from "mongodb";

let cachedClient = null;

export default async function handler(req, res) {
  try {
    const token = req.query.token;
    if (!token) {
      return res.status(403).send("Missing token");
    }

    if (!cachedClient) {
      cachedClient = new MongoClient(process.env.DATABASE_URL);
      await cachedClient.connect();
    }

    const db = cachedClient.db();
    const col = db.collection("shortener_tokens");

    const data = await col.findOne({ token });
    if (!data) {
      return res.status(403).send("Invalid token");
    }

    if (Date.now() / 1000 > data.expires_at) {
      await col.deleteOne({ token });
      return res.status(403).send("Token expired");
    }

    if (data.used) {
      return res.status(403).send("Token already used");
    }

    await col.updateOne(
      { token },
      { $set: { used: true } }
    );

    return res.redirect(302, data.url);

  } catch (err) {
    console.error(err);
    return res.status(500).send("Internal Server Error");
  }
}

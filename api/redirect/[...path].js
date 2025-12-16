export default function handler(req, res) {
  const data = req.query.data;

  if (!data) {
    return res.status(400).send("Missing redirect data");
  }

  const redirectUrl = decodeURIComponent(data);

  // HARD redirect (this is important)
  res.writeHead(302, { Location: redirectUrl });
  res.end();
}

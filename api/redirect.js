export default async function handler(req, res) {
  const { token } = req.query;

  if (!token) {
    return res.status(400).send("Missing token");
  }

  try {
    const r = await fetch(
      `https://thoughtful-shayne-mlfiles-5730e5e6.koyeb.app/resolve?token=${token}`
    );

    if (!r.ok) {
      return res.status(403).send("Invalid or expired link");
    }

    const data = await r.json();

    res.writeHead(302, { Location: data.url });
    res.end();

  } catch (e) {
    res.status(500).send("Server error");
  }
}

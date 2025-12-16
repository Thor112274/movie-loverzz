export default function handler(req, res) {
  const { data } = req.query;

  if (!data) {
    res.status(400).send("Invalid redirect URL");
    return;
  }

  const redirectUrl = decodeURIComponent(data);

  res.setHeader("Content-Type", "text/html");

  res.status(200).send(`
    <!DOCTYPE html>
    <html>
      <head>
        <meta http-equiv="refresh" content="0;url=${redirectUrl}">
        <title>Redirecting...</title>
      </head>
      <body>
        <p>Redirecting, please wait...</p>
      </body>
    </html>
  `);
}

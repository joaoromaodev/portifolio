// One-shot helper to obtain a Spotify refresh token for the "now playing" widget.
//
// Prereqs (one-time, on your own Spotify account):
//   1. Go to https://developer.spotify.com/dashboard → Create app.
//   2. In the app settings, add this exact Redirect URI:  http://127.0.0.1:8888/callback
//   3. Copy the Client ID and Client Secret.
//
// Run it:
//   SPOTIFY_CLIENT_ID=xxx SPOTIFY_CLIENT_SECRET=yyy node scripts/get-spotify-token.mjs
//
// It opens your browser, you click "Agree", and it prints the refresh token to
// paste into .env.local (SPOTIFY_REFRESH_TOKEN=...). The token doesn't expire.

import http from "node:http";
import { exec } from "node:child_process";

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const PORT = 8888;
const REDIRECT_URI = `http://127.0.0.1:${PORT}/callback`;
// read-only scopes the widget needs
const SCOPES = "user-read-currently-playing user-read-recently-played";

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error(
    "\n  Missing credentials. Run:\n" +
      "  SPOTIFY_CLIENT_ID=xxx SPOTIFY_CLIENT_SECRET=yyy node scripts/get-spotify-token.mjs\n",
  );
  process.exit(1);
}

function open(url) {
  const cmd =
    process.platform === "win32"
      ? `start "" "${url}"`
      : process.platform === "darwin"
        ? `open "${url}"`
        : `xdg-open "${url}"`;
  exec(cmd);
}

const authUrl =
  "https://accounts.spotify.com/authorize?" +
  new URLSearchParams({
    response_type: "code",
    client_id: CLIENT_ID,
    scope: SCOPES,
    redirect_uri: REDIRECT_URI,
  });

const server = http.createServer(async (req, res) => {
  if (!req.url.startsWith("/callback")) {
    res.writeHead(404).end();
    return;
  }

  const code = new URL(req.url, REDIRECT_URI).searchParams.get("code");
  if (!code) {
    res.writeHead(400).end("No code returned.");
    return;
  }

  try {
    const tokenRes = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        Authorization:
          "Basic " +
          Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64"),
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: REDIRECT_URI,
      }),
    });
    const json = await tokenRes.json();

    if (json.refresh_token) {
      res
        .writeHead(200, { "Content-Type": "text/html" })
        .end(
          "<h2>Done. You can close this tab and return to the terminal.</h2>",
        );
      console.log("\n  ✅ Success! Add this line to .env.local:\n");
      console.log(`  SPOTIFY_REFRESH_TOKEN=${json.refresh_token}\n`);
    } else {
      res.writeHead(500).end("Token exchange failed — see terminal.");
      console.error("\n  ❌ Token exchange failed:\n", json, "\n");
    }
  } catch (err) {
    res.writeHead(500).end("Error — see terminal.");
    console.error(err);
  } finally {
    server.close();
    setTimeout(() => process.exit(0), 200);
  }
});

server.listen(PORT, () => {
  console.log(`\n  Opening browser to authorize…`);
  console.log(`  If it doesn't open, paste this URL:\n\n  ${authUrl}\n`);
  open(authUrl);
});

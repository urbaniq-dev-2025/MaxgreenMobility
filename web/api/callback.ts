import type { IncomingMessage, ServerResponse } from "http";
import { AuthorizationCode } from "simple-oauth2";

type Provider = "github";

function getProvider(_p?: string | null): Provider {
  return "github";
}

function config(_provider: Provider) {
  const id = process.env.OAUTH_GITHUB_CLIENT_ID;
  const secret = process.env.OAUTH_GITHUB_CLIENT_SECRET;

  if (!id || !secret) {
    throw new Error("Missing OAUTH_GITHUB_CLIENT_ID / OAUTH_GITHUB_CLIENT_SECRET");
  }

  return {
    client: { id, secret },
    auth: {
      tokenHost: "https://github.com",
      tokenPath: "/login/oauth/access_token",
      authorizePath: "/login/oauth/authorize",
    },
  };
}

export default async (req: IncomingMessage, res: ServerResponse) => {
  const host = req.headers.host ?? "";
  const url = new URL(`https://${host}${req.url ?? "/api/callback"}`);
  const urlParams = url.searchParams;

  const code = urlParams.get("code");
  const provider = getProvider(urlParams.get("provider"));

  try {
    if (!code) throw new Error("Missing OAuth code");

    const client = new AuthorizationCode(config(provider));
    const tokenParams = {
      code,
      redirect_uri: `https://${host}/api/callback?provider=${provider}`,
    };

    const accessToken = await client.getToken(tokenParams);
    const token = accessToken.token["access_token"] as string;

    res.statusCode = 200;
    res.setHeader("Content-Type", "text/html");
    res.end(renderBody("success", { token, provider }));
  } catch (e) {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/html");
    res.end(renderBody("error", { token: "", provider, error: String(e) }));
  }
};

function renderBody(
  status: "success" | "error",
  content: { token: string; provider: string; error?: string }
) {
  return `<!doctype html>
<html>
  <head><meta charset="utf-8" /></head>
  <body>
    <script>
      (function () {
        var status = ${JSON.stringify(status)};
        var content = ${JSON.stringify(content)};
        function receiveMessage(message) {
          window.opener.postMessage(
            'authorization:' + content.provider + ':' + status + ':' + JSON.stringify(content),
            message.origin
          );
          window.removeEventListener("message", receiveMessage, false);
        }
        window.addEventListener("message", receiveMessage, false);
        window.opener.postMessage("authorizing:" + content.provider, "*");
      })();
    </script>
  </body>
</html>`;
}


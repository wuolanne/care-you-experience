import { createServer } from "node:http";
import { spawn } from "node:child_process";

const appPort = Number(process.env["E2E_APP_PORT"] ?? 8080);
const mockSupabasePort = Number(process.env["E2E_MOCK_SUPABASE_PORT"] ?? 54321);
const mockSupabaseUrl = `http://127.0.0.1:${mockSupabasePort}`;
const mockKey = "e2e-local-only-publishable-key";

function sendJson(response, statusCode, body) {
  response.writeHead(statusCode, {
    "content-type": "application/json",
    "access-control-allow-origin": "*",
    "access-control-allow-headers": "authorization, apikey, content-type",
    "access-control-allow-methods": "GET, POST, PATCH, PUT, DELETE, OPTIONS",
  });
  response.end(JSON.stringify(body));
}

const mockSupabase = createServer((request, response) => {
  if (request.method === "OPTIONS") {
    response.writeHead(204, {
      "access-control-allow-origin": "*",
      "access-control-allow-headers": "authorization, apikey, content-type",
      "access-control-allow-methods": "GET, POST, PATCH, PUT, DELETE, OPTIONS",
    });
    response.end();
    return;
  }

  const pathname = new URL(request.url ?? "/", mockSupabaseUrl).pathname;
  if (pathname === "/health") {
    sendJson(response, 200, { ok: true });
    return;
  }

  if (pathname === "/auth/v1/settings") {
    sendJson(response, 200, { external: {}, disable_signup: true });
    return;
  }

  if (pathname === "/auth/v1/user") {
    sendJson(response, 401, { error: "not_authenticated" });
    return;
  }

  if (pathname.startsWith("/rest/v1/")) {
    sendJson(response, 200, []);
    return;
  }

  sendJson(response, 404, { error: "not_found" });
});

let app;
function stop() {
  app?.kill("SIGTERM");
  mockSupabase.close();
}

mockSupabase.listen(mockSupabasePort, "127.0.0.1", () => {
  const npmCommand = process.platform === "win32" ? "npm.cmd" : "npm";
  app = spawn(npmCommand, ["run", "dev", "--", "--host", "127.0.0.1"], {
    env: {
      ...process.env,
      E2E_MOCK_SUPABASE: "true",
      SUPABASE_URL: mockSupabaseUrl,
      SUPABASE_PUBLISHABLE_KEY: mockKey,
      VITE_SUPABASE_URL: mockSupabaseUrl,
      VITE_SUPABASE_PUBLISHABLE_KEY: mockKey,
      PORT: String(appPort),
    },
    shell: process.platform === "win32",
    stdio: "inherit",
  });

  app.on("exit", (code, signal) => {
    mockSupabase.close();
    if (signal) process.kill(process.pid, signal);
    else process.exit(code ?? 1);
  });
});

process.on("SIGINT", stop);
process.on("SIGTERM", stop);

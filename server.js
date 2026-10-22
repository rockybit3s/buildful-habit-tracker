// Minimal static file server for local use: `npm start` then open http://localhost:3000
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, normalize } from "node:path";

const PORT = process.env.PORT || 3000;
const ROOT = import.meta.dirname;

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json",
};

createServer(async (req, res) => {
  let path = req.url === "/" ? "/index.html" : req.url.split("?")[0];
  path = normalize(path).replace(/^(\.\.[/\\])+/, "");
  // Never serve dotfiles (e.g. the .git directory).
  if (path.split(/[\\/]/).some((segment) => segment.startsWith("."))) {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Not found");
    return;
  }
  try {
    const body = await readFile(join(ROOT, path));
    res.writeHead(200, { "Content-Type": MIME[extname(path)] ?? "application/octet-stream" });
    res.end(body);
  } catch {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Not found");
  }
}).listen(PORT, () => {
  console.log(`Habit tracker running at http://localhost:${PORT}`);
});

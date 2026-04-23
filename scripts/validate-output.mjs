import fs from "node:fs";
import path from "node:path";

const root = process.argv[2] || "public";
const errors = [];

function walk(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(file));
    if (entry.isFile()) out.push(file);
  }
  return out;
}

function existsPublic(url) {
  const clean = url.split("#")[0].split("?")[0];
  if (!clean || /^(https?:|mailto:|tel:|data:)/.test(clean)) return true;
  const target = clean.startsWith("/") ? clean.slice(1) : clean;
  const file = path.join(root, target);
  return fs.existsSync(file) || fs.existsSync(path.join(file, "index.html"));
}

const htmlFiles = walk(root).filter((file) => file.endsWith(".html"));
for (const file of htmlFiles) {
  const html = fs.readFileSync(file, "utf8");
  const rel = path.relative(root, file);
  if (/<meta\s+name=["']generator["']/i.test(html)) errors.push(`${rel}: generator meta should not be rendered`);
  if (!/<main[^>]+id=["']?main-content/i.test(html)) errors.push(`${rel}: missing main-content landmark`);
  if (!/<script\b[^>]*type=["']?application\/ld\+json["']?[^>]*>/i.test(html) && !rel.endsWith("404.html")) {
    errors.push(`${rel}: missing JSON-LD schema`);
  }

  const ids = new Set();
  for (const match of html.matchAll(/\sid=(["']?)([^\s"'>]+)\1/g)) {
    if (ids.has(match[2])) errors.push(`${rel}: duplicate id ${match[2]}`);
    ids.add(match[2]);
  }

  for (const match of html.matchAll(/<(?:a|link)\b[^>]+\s(?:href)=["']?([^"'\s>]+)/gi)) {
    if (!existsPublic(match[1])) errors.push(`${rel}: broken href ${match[1]}`);
  }
  for (const match of html.matchAll(/<(?:img|script)\b[^>]+\s(?:src)=["']?([^"'\s>]+)/gi)) {
    if (!existsPublic(match[1])) errors.push(`${rel}: broken src ${match[1]}`);
  }
  for (const match of html.matchAll(/<img\b[^>]*>/gi)) {
    if (!/\salt(=|\s|>)/i.test(match[0])) errors.push(`${rel}: image missing alt attribute`);
    if (!/\s(width|height)=/i.test(match[0])) errors.push(`${rel}: image should include width and height`);
  }
  for (const match of html.matchAll(/<a\b[^>]*target=["']?_blank["']?[^>]*>/gi)) {
    if (!/rel=["'][^"']*noopener/i.test(match[0])) errors.push(`${rel}: target=_blank missing noopener`);
  }
}

if (!fs.existsSync(path.join(root, "search.json"))) errors.push("search.json was not generated");

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}

console.log(`Output validation passed for ${htmlFiles.length} HTML files.`);

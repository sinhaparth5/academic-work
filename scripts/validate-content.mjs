import fs from "node:fs";
import path from "node:path";

const roots = ["content", "exampleSite/content"].filter((dir) => fs.existsSync(dir));
const errors = [];

function walk(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(file));
    if (entry.isFile() && entry.name.endsWith(".md")) out.push(file);
  }
  return out;
}

function parseFrontMatter(raw, file) {
  if (!raw.startsWith("---")) {
    errors.push(`${file}: missing YAML front matter`);
    return {};
  }
  const end = raw.indexOf("\n---", 3);
  if (end === -1) {
    errors.push(`${file}: unterminated YAML front matter`);
    return {};
  }
  const yaml = raw.slice(3, end).trim();
  const data = {};
  let currentList = null;
  for (const line of yaml.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const listMatch = trimmed.match(/^-\s*(.*)$/);
    if (listMatch && currentList) {
      data[currentList].push(listMatch[1].replace(/^["']|["']$/g, ""));
      continue;
    }
    const match = trimmed.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (!match) continue;
    const [, key, value] = match;
    currentList = null;
    if (value === "") {
      data[key] = [];
      currentList = key;
    } else if (value.startsWith("[") && value.endsWith("]")) {
      data[key] = value.slice(1, -1).split(",").map((item) => item.trim().replace(/^["']|["']$/g, "")).filter(Boolean);
    } else {
      data[key] = value.replace(/^["']|["']$/g, "");
    }
  }
  return data;
}

function isExternal(url) {
  return /^(https?:|mailto:|tel:|#)/.test(url);
}

const files = roots.flatMap(walk);
for (const file of files) {
  const raw = fs.readFileSync(file, "utf8");
  const fm = parseFrontMatter(raw, file);
  const isIndex = path.basename(file) === "_index.md";
  if (!fm.title) errors.push(`${file}: missing title`);
  if (!fm.summary && !isIndex) errors.push(`${file}: regular pages should define summary`);

  for (const match of raw.matchAll(/!\[([^\]]*)\]\(([^)]+)\)/g)) {
    const [, alt, target] = match;
    if (!alt.trim()) errors.push(`${file}: markdown image missing alt text for ${target}`);
  }

  for (const match of raw.matchAll(/\[[^\]]+\]\(([^)]+)\)/g)) {
    const target = match[1].split(/\s+/)[0];
    if (isExternal(target)) continue;
    if (target.startsWith("/")) {
      const candidate = path.join("static", target);
      if (!fs.existsSync(candidate) && !target.endsWith("/")) {
        errors.push(`${file}: absolute link ${target} does not map to a static file or section URL`);
      }
    }
  }
}

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}

console.log(`Content validation passed for ${files.length} markdown files.`);

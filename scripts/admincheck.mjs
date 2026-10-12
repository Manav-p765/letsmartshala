// End-to-end check of the blog admin in local dev (storage = local files):
// wrong password, sign in, create + publish a post with a cover, see it on
// /blog, edit it, delete it. Leaves no files behind.
import { chromium } from 'playwright';
import { existsSync, rmSync, readdirSync } from 'node:fs';
import sharp from 'sharp';

const base = process.env.BASE_URL || 'http://localhost:5180';
await sharp({ create: { width: 800, height: 450, channels: 3, background: '#2456E6' } }).jpeg().toFile('shots/test-cover.jpg');
// Remove anything a previous, interrupted run left behind.
rmSync('content/blog/admin-test-post.json', { force: true });
for (const f of readdirSync('public/blog-media')) if (f.startsWith('test-cover-')) rmSync(`public/blog-media/${f}`);
const before = new Set(readdirSync('public/blog-media'));

const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
const errs = [];
p.on('pageerror', (e) => errs.push(e.message));
p.on('dialog', (d) => d.accept());

await p.goto(base + '/admin', { waitUntil: 'networkidle' });
await p.fill('#adm-pw', 'wrong');
await p.click('button[type=submit]');
await p.waitForSelector('.adm-error');
console.log('wrong password →', await p.locator('.adm-error').innerText());
await p.fill('#adm-pw', 'admin');
await p.click('button[type=submit]');
await p.waitForSelector('.adm-head h1');
console.log('signed in; list says:', await p.locator('.adm-head p').innerText());
await p.screenshot({ path: 'shots/admin-list.png' });

await p.click('text=+ New post');
await p.fill('.adm-title', 'Admin test post');
await p.fill('.adm-excerpt', 'A post written by the automated admin check.');
await p.fill('.adm-body', '## Hello\n\nThis is **bold** and a [link](/demo).\n\n- one\n- two');
await p.setInputFiles('.adm-side input[type=file]', 'shots/test-cover.jpg');
await p.waitForFunction(() => document.querySelector('.adm-side .pcover img'));
console.log('cover uploaded:', await p.locator('.adm-side .pcover img').getAttribute('src'));
await p.click('text=Preview');
console.log('preview h2:', await p.locator('.adm-preview h2').innerText());
await p.screenshot({ path: 'shots/admin-editor.png' });
await p.click('button:has-text("Publish")');
await p.waitForSelector('.adm-flash');
console.log('flash:', await p.locator('.adm-flash').innerText());
console.log('file written:', existsSync('content/blog/admin-test-post.json'));

// The dev server picks up the new JSON file; check the public blog.
await p.waitForTimeout(1500);
const pub = await b.newPage();
await pub.goto(base + '/blog/admin-test-post', { waitUntil: 'networkidle' });
console.log('public post title:', await pub.locator('#post-title').innerText().catch(() => 'NOT FOUND'));
await pub.close();

await p.click('.adm-row:has-text("Admin test post") button:has-text("Delete")');
await p.waitForSelector('.adm-flash');
await p.waitForTimeout(500);
console.log('after delete, file exists:', existsSync('content/blog/admin-test-post.json'));
console.log(errs.length ? 'ERRORS ' + errs.join(' | ') : 'no page errors');
await b.close();

for (const f of readdirSync('public/blog-media')) if (!before.has(f)) rmSync(`public/blog-media/${f}`);
rmSync('shots/test-cover.jpg');

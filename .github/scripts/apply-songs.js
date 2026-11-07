// Applies a "Song list update" issue to songs.json. Input comes only from the event file.
const fs = require('fs');
const ev = JSON.parse(fs.readFileSync(process.env.GITHUB_EVENT_PATH, 'utf8'));
const out = (msg, changed) => {
  fs.writeFileSync('/tmp/result.md', msg);
  fs.appendFileSync(process.env.GITHUB_OUTPUT || '/dev/null', `changed=${changed ? 'true' : 'false'}\n`);
};
const keyOf = t => String(t).replace(/\s+-\s+.*$/, '').replace(/\([^)]*\)/g, '').replace(/\[[^\]]*\]/g, '')
  .replace(/\s+/g, ' ').replace(/^[ .]+|[ .]+$/g, '').toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9 ]/g, '').trim();
const clean = t => String(t).replace(/\s+-\s+.*$/, '').replace(/\([^)]*\)/g, '').replace(/\[[^\]]*\]/g, '')
  .replace(/\s+/g, ' ').replace(/^[ .]+|[ .]+$/g, '').replace(/[\u0000-\u001f<>]/g, '').slice(0, 120);
const m = (ev.issue.body || '').match(/```json\s*([\s\S]*?)```/);
if (!m) { out("I couldn't find the change list in this issue. Please use the **Send to shared list** button on the jukebox page.", false); process.exit(0); }
let p; try { p = JSON.parse(m[1]); } catch { out("The change list in this issue isn't valid. Please send it again from the jukebox page.", false); process.exit(0); }
const adds = Array.isArray(p.add) ? p.add.slice(0, 50) : [];
const rems = Array.isArray(p.remove) ? p.remove.slice(0, 50) : [];
const songs = JSON.parse(fs.readFileSync('songs.json', 'utf8'));
const log = [];
for (const r of rems) {
  const k = keyOf(r && (r.key || r.title) || '');
  const i = songs.findIndex(s => s.k === k);
  if (i >= 0) { log.push(`- Removed **${songs[i].t}**`); songs.splice(i, 1); }
}
for (const a of adds) {
  const t = clean(a && a.title || ''), ar = clean(a && a.artist || ''), k = keyOf(t);
  if (!t || !ar || !k) continue;
  if (songs.some(s => s.k === k)) { log.push(`- Skipped **${t}** (already on the list)`); continue; }
  const sp = /^[A-Za-z0-9]{22}$/.test(a.spotify || '') ? [a.spotify] : [];
  songs.push({ k, t, a: [ar], y: '', g: '', sp });
  log.push(`- Added **${t}** — ${ar}`);
}
if (!log.some(l => /^- (Added|Removed)/.test(l))) { out('Nothing to change: ' + (log.join(' ') || 'no valid songs found.'), false); process.exit(0); }
fs.writeFileSync('songs.json', JSON.stringify(songs));
out(`Thanks! The shared list now has ${songs.length} songs:\n\n${log.join('\n')}\n\nReload the jukebox page in a minute or two to see it.`, true);

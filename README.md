# Liked Songs MIDI Jukebox

A browser jukebox for my Spotify Liked Songs (230 songs).

**Play it:** https://hardwaremack-prog.github.io/liked-songs-midi-jukebox/

- **▶ Spotify** opens each song in Spotify.
- **Find** searches BitMidi for a MIDI version of the song.
- Drop `.mid` files, a folder or a `.zip` on the page and each file is matched to its song, then played by the built-in synth.
- **👀 Watch my Downloads** (Chrome/Edge): pick your Downloads folder, click a MIDI on BitMidi, and it shows up and plays by itself.

No MIDI files are stored in this repo — anything you add stays in your own browser.

## Editing the shared list

Anyone can add a song or remove one (✕) on the page. Changes stay on that device until you tap **Send to shared list**, which opens a pre-filled GitHub issue. Submitting it runs a GitHub Action (`.github/workflows/song-list.yml`) that updates `songs.json` for everyone and closes the issue.

The **⟲** button next to a song clears its MIDI file, in case the wrong one got attached.

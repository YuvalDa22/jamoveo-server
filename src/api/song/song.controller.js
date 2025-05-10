import { getSongById } from "./song.service.js";
import fs from "fs";
import path from "path";

const songsDir = path.join(process.cwd(), "src/data/songs");

export async function getSongs(req, res) {
  const search = req.query.search?.toLowerCase() || "";

  try {
    const files = fs.readdirSync(songsDir).filter(f => f.endsWith('.json'));

    const songs = files.map(file => {
      const fullPath = path.join(songsDir, file);
      const raw = fs.readFileSync(fullPath, 'utf-8');
      const content = JSON.parse(raw);
      const fallbackTitle = file.replace('.json', '').replace(/_/g, ' ');
      const title = content.title || fallbackTitle;
      return { id: file.replace('.json', ''), title, content };
    });

    const filtered = songs.filter(song =>
      song.title.toLowerCase().includes(search)
    );

    res.json(filtered);
  } catch (err) {
    console.error("Failed to load songs:", err);
    res.status(500).json({ message: "Failed to load songs." });
  }
}


export async function getSong(req, res) {
  try {
    const song = await getSongById(req.params.id);
    if (!song) return res.status(404).json({ message: "Song not found" });
    res.json(song);
  } catch (err) {
    res.status(500).json({ message: "Failed to load song" });
  }
}

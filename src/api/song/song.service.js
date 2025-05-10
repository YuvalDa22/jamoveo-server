import fs from 'fs/promises';
import path from 'path';

const songsDir = path.join(process.cwd(), 'src/data/songs');

export async function getAllSongs(search = '') {
  const files = await fs.readdir(songsDir);
  const songs = [];

  for (const file of files) {
    if (!file.endsWith('.json')) continue;
    const content = await fs.readFile(path.join(songsDir, file), 'utf-8');
    const song = JSON.parse(content);
    const title = song.title || file.replace('.json', '').replace(/_/g, ' ');
    if (title.toLowerCase().includes(search.toLowerCase())) {
      songs.push({ id: file.replace('.json', ''), title });
    }
  }

  return songs;
}

export async function getSongById(id) {
  try {
    const filePath = path.join(songsDir, `${id}.json`);
    const raw = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    return null;
  }
}

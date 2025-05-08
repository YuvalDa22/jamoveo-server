import fs from 'fs/promises';
import path from 'path';

const SONGS_DIR = path.resolve('data/songs');

export async function getAllSongs(search = '') {
  const files = await fs.readdir(SONGS_DIR);
  const songs = [];

  for (const file of files) {
    if (!file.endsWith('.json')) continue;
    const content = await fs.readFile(path.join(SONGS_DIR, file), 'utf-8');
    const song = JSON.parse(content);
    if (song.title.toLowerCase().includes(search)) {
      songs.push({ id: file.replace('.json', ''), title: song.title });
    }
  }
  return songs;
}

export async function getSongById(id) {
  const filePath = path.join(SONGS_DIR, `${id}.json`);
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(content);
  } catch {
    return null;
  }
}

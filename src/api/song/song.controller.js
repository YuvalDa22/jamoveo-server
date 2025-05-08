import { getAllSongs, getSongById } from './song.service.js';

export async function getSongs(req, res) {
  try {
    const search = req.query.search?.toLowerCase() || '';
    const songs = await getAllSongs(search);
    res.json(songs);
  } catch (err) {
    res.status(500).json({ message: 'Failed to load songs' });
  }
}

export async function getSong(req, res) {
  try {
    const song = await getSongById(req.params.id);
    if (!song) return res.status(404).json({ message: 'Song not found' });
    res.json(song);
  } catch (err) {
    res.status(500).json({ message: 'Failed to load song' });
  }
}

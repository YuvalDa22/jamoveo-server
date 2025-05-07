export default function socketHandler(io) {
    io.on('connection', (socket) => {
        console.log('New client connected:', socket.id);
    
        // Join a session room
        socket.on('join-session', ({ sessionId, username }) => {
          socket.join(sessionId);
          console.log(`${username} joined session ${sessionId}`);
        });
    
        // Load a song (admin)
        socket.on('load-song', ({ sessionId, song }) => {
          console.log(`Song loaded for session ${sessionId}:`, song);
          socket.to(sessionId).emit('song-updated', song);
        });
    
        // Disconnect
        socket.on('disconnect', () => {
          console.log('Client disconnected:', socket.id);
        });
      });
}
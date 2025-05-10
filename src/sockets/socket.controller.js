const sessionUsers = {};

export default function socketHandler(io) {
  io.on("connection", (socket) => {
    console.log("New client connected:", socket.id);

    // Join a session room
    socket.on("join-session", ({ sessionId, username, role }) => {
      socket.join(sessionId);
      console.log(`${username} joined session ${sessionId}`);

      // save the user info - to show who is in the session
      if (!sessionUsers[sessionId]) sessionUsers[sessionId] = [];
      if (!sessionUsers[sessionId].some((user) => user.username === username)) {
        sessionUsers[sessionId].push({ username, role });
      }

      // Emit updated user list to all in room
      io.to(sessionId).emit("session-users-updated", sessionUsers[sessionId]);
    });

    // Load a song (admin)
    socket.on("load-song", ({ sessionId, song }) => {
      console.log(`Song loaded for session ${sessionId}:`, song);
      socket.to(sessionId).emit("song-updated", song);
    });

    // Start countdown (triggered by admin)
    socket.on("start-countdown", ({ sessionId }) => {
      console.log(`Countdown started for session ${sessionId}`);
      io.to(sessionId).emit("countdown-started");
    });
    
    // End session (triggered by admin)
    socket.on("end-session", ({ sessionId }) => {
      console.log(`Ending session ${sessionId}`);
      io.to(sessionId).emit("session-ended");
    });

    // Disconnect
    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });
}

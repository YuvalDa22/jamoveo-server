import Session from "./session.model.js";
import User from "../user/user.model.js";
import { logger } from "../../services/logger.service.js";
import { customAlphabet } from "nanoid";

export async function createSession(req, res) {
  try {
    const { userId } = req.body;
    if (!userId) {
      logger.warn("session.controller - missing userId");
      return res.status(400).json({ message: "Missing userId" });
    }

    const user = await User.findById(userId);
    if (!user) {
      logger.warn(`session.controller - user not found: ${userId}`);
      return res.status(404).json({ message: "User not found" });
    }

    const generateSessionId = customAlphabet(
      "ABCDEFGHJKLMNPQRSTUVWXYZ23456789",
      6
    );
    
    const session = new Session({
      sessionId: generateSessionId(),
      users: [user._id],
    });

    await session.save();
    logger.info(
      `session.controller - session created: ${session.SessionId} by user ${user.username}`
    );
    res.status(201).json({ session });
  } catch (error) {
    logger.error("session.controller - createSession error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function joinSession(req, res) {
  try {
    const { id: sessionId } = req.params;
    const { userId } = req.body;

    if (!userId) {
      logger.warn("session.controller - missing userId");
      return res.status(400).json({ message: "Missing userId" });
    }
    const session = await Session.findOne({ sessionId });
    if (!session) {
      logger.warn(`session.controller - session not found: ${sessionId}`);
      return res.status(404).json({ message: "Session not found" });
    }

    if (!session.users.includes(userId)) {
      session.users.push(userId);
      await session.save();
    }
    logger.info(
      `session.controller - user ${userId} joined session ${sessionId}`
    );
    res.json(session);
  } catch (error) {
    logger.error("session.controller - joinSession error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

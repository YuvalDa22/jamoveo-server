import User from "../user/user.model.js";
import { logger } from "../../services/logger.service.js";
import {
    hashPassword,
    isPasswordMatch,
    generateToken,
} from "./auth.service.js";

export async function signup(req, res) {
    logger.debug('auth.controller - signup called with body:', req.body);
    try {
        const { username, password, instrument, role } = req.body;

        if (!username || !password || !instrument) {
            logger.warn('auth.controller - missing required fields');
            return res.status(400).json({ message: "Missing required fields" });
        }

        const existingUser = await User.findOne({ username });
        if (existingUser) {
            logger.warn(`auth.controller - username "${username}" already exists`);
            return res.status(400).json({ message: "Username already exists" });
        }
        const hashedPassword = await hashPassword(password);
        const newUser = new User({
            username,
            password: hashedPassword,
            instrument,
            role: role || "user",
        });

        await newUser.save();
        logger.info(`User signup successful: ${username}`);

    
        const token = generateToken(newUser);
        res.status(201).json({token});
    } catch (error) {
        logger.error("Signup error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export async function login(req, res) {
    logger.debug('auth.controller - login called with body:', req.body);
    try{
        const {username, password} = req.body;
        if (!username || !password) {
            logger.warn('auth.controller - missing credentials');
            return res.status(400).json({ message: "Missing username or password" });
        }

        const user = await User.findOne({ username});
        if(!user){
            logger.warn(`auth.controller - invalid username: ${username}`);
            return res.status(401).json({ message: "Invalid credentials"});
        }

        const match = await isPasswordMatch(password, user.password);
        if(!match){
            logger.warn(`auth.controller - invalid password for user: ${username}`);
            return res.status(401).json({ message: "Invalid credentials"});
        }
        const token = generateToken(user);
        logger.info(`User login successful: ${username}`);
        res.json({ token });
    } catch(error){
        logger.error("Login error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

// Handle client-initiated logout (token is removed on client side)
// This route exists for clarity and consistency, even though no server state is stored
export function logout(req, res) {
    logger.info('auth.controller - logout triggered');
    return res.status(200).json({ message: 'Logout successful — token removed on client' });
}
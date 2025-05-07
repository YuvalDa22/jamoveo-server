import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function hashPassword(password) {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
}

export async function isPasswordMatch(password, hashedPassword) {
    return await bcrypt.compare(password, hashedPassword);
} 

export function generateToken(user) {
    const payload = {
        id: user._id,
        username: user.username,
        instrument: user.instrument,
        role: user.role,
    }

    return jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "3h",
    });
}
export function verifyToken(token) {
    return jwt.verify(token, process.env.JWT_SECRET);
}
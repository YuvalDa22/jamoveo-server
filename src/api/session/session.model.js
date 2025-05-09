import mongoose from "mongoose";

const sessionScheme = new mongoose.Schema({
    sessionId: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    users: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    isActive: {
        type: Boolean,
        default: true,
    },
}, { timestamps: true });

const Session = mongoose.model('Session', sessionScheme);
export default Session;
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
    },
    instrument: {
        type: String,
        enum: ['vocals', 'drums', 'guitar', 'bass', 'saxophone', 'keyboards'],
        required: true,
    },
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user',
        required: true,
    },
},{ timestamps: true });

const User = mongoose.model('User', userSchema);
export default User;
  
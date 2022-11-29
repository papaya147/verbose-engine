import mongoose from 'mongoose';
import { Password } from '../services/password';

interface userAttrs {
    email: string;
    phoneNumber?: string;
    password: string;
    upiAccount: string;
    upiName: string;
}

interface UserDocument extends mongoose.Document {
    email: string;
    phoneNumber: string;
    password: string;
    upiAccount: string;
    upiName: string;
}

interface UserModel extends mongoose.Model<UserDocument> {
    build(attrs: userAttrs): UserDocument;
}

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: false
    },
    password: {
        type: String,
        required: true
    },
    upiAccount: {
        type: String,
        required: true
    },
    upiName: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

userSchema.statics.build = (attrs: userAttrs) => {
    return new User(attrs);
}

const User = mongoose.model<UserDocument, UserModel>('User', userSchema);

export { User };
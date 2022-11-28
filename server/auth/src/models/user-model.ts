import mongoose from 'mongoose';
import { Password } from '../services/password';

interface userAttrs {
    email: string;
    phoneNumber?: string;
    password: string;
}

interface UserDocument extends mongoose.Document {
    email: string;
    phoneNumber: string;
    password: string;
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
    }
});

userSchema.pre('save', async function (done) {
    if (this.isModified('password')) {
        const hashed = await Password.toHash(this.get('password'))
        this.set('password', hashed);
    }
    done();
})

userSchema.statics.build = (attrs: userAttrs) => {
    return new User(attrs);
}

const User = mongoose.model<UserDocument, UserModel>('User', userSchema);

export { User };
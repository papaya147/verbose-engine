import mongoose from "mongoose";

interface phoneAttrs {
    phoneNumber: string;
    name?: string;
}

interface PhoneDocument extends mongoose.Document {
    phoneNumber: string;
    name: string;
}

interface PhoneModel extends mongoose.Model<PhoneDocument> {
    build(attrs: phoneAttrs): PhoneDocument;
}

const phoneSchema = new mongoose.Schema({
    phoneNumber: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

phoneSchema.statics.build = (attrs: phoneAttrs) => {
    return new Phone(attrs);
}

const Phone = mongoose.model<PhoneDocument, PhoneModel>('Phone', phoneSchema);

export { Phone };
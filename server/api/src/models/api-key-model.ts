import mongoose from "mongoose";

interface apikeyAttrs {
    secret: string;
    salt: string;
}

interface apikeyDocument extends mongoose.Document {
    secret: string;
    salt: string;
}

interface apikeyModel extends mongoose.Model<apikeyDocument> {
    build(apiattrs: apikeyAttrs): apikeyDocument;
}

const apikeySchema = new mongoose.Schema({
    secret: {
        type: String,
        required: true
    },
    salt: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

apikeySchema.statics.build = (apiattrs: apikeyAttrs) => {
    return new APIKey(apiattrs);
};

apikeySchema.index({ createdAt: 1 }, { expireAfterSeconds: 604800 });

const APIKey = mongoose.model<apikeyDocument, apikeyModel>('APIKey', apikeySchema);

export { APIKey };
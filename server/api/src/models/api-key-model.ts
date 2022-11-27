import mongoose from "mongoose";

interface apikeyAttrs {
    key: string;
    salt: string;
}

interface apikeyDocument extends mongoose.Document {
    key: string;
    salt: string;
}

interface apikeyModel extends mongoose.Model<apikeyDocument> {
    build(apiattrs: apikeyAttrs): apikeyDocument;
}

const apikeySchema = new mongoose.Schema({
    key: {
        type: String,
        required: true
    },
    salt: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 86400
    }
});

apikeySchema.statics.build = (apiattrs: apikeyAttrs) => {
    return new APIKey(apiattrs);
};

const APIKey = mongoose.model<apikeyDocument, apikeyModel>('APIKey', apikeySchema);

export { APIKey };
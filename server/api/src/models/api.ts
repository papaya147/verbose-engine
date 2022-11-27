import mongoose from "mongoose";

interface apikeyAttrs {
    key: string;
    secret: string;
    salt: string;
}

interface apikeyDocument extends mongoose.Document {
    key: string;
    secret: string;
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
    secret: {
        type: String,
        required: true
    },
    salt: {
        type: String,
        required: true
    }
});

apikeySchema.statics.build = (apiattrs: apikeyAttrs) => {
    return new APIKey;
};

const APIKey = mongoose.model<apikeyDocument, apikeyModel>('APIKey', apikeySchema);

export { APIKey };
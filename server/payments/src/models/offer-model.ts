import mongoose, { mongo } from "mongoose";

interface offerAttrs {
    user: mongoose.Types.ObjectId,
    type?: string,
    amount: number,
    discount: string,
    startsAt: Date,
    expiresAt: Date
}

interface OfferDocument extends mongoose.Document {
    user: mongoose.Types.ObjectId,
    type?: string,
    amount: number,
    discount: string,
    startsAt: Date,
    expiresAt: Date
}

interface OfferModel extends mongoose.Model<OfferDocument> {
    build(attrs: offerAttrs): OfferDocument;
}

const offerSchema = new mongoose.Schema({
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        default: 'none'
    },
    amount: {
        type: Number,
        required: false
    },
    discount: {
        type: String,
        required: true
    },
    startsAt: {
        type: Date,
        required: true
    },
    expiresAt: {
        type: Date,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

offerSchema.statics.build = (attrs: offerAttrs) => {
    return new Offer(attrs);
}

const Offer = mongoose.model<OfferDocument, OfferModel>('Offer', offerSchema);

export { Offer };
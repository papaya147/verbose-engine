import mongoose from "mongoose";

interface paymentAttrs {
    user: mongoose.Types.ObjectId;
    phone: mongoose.Types.ObjectId;
    amount: number;
    offer?: mongoose.Types.ObjectId;
    createdAt?: Date;
}

interface PaymentDocument extends mongoose.Document {
    user: mongoose.Types.ObjectId;
    phone: mongoose.Types.ObjectId;
    amount: number;
    offer: mongoose.Types.ObjectId;
    createdAt: Date;
}

interface PaymentModel extends mongoose.Model<PaymentDocument> {
    build(attrs: paymentAttrs): PaymentDocument;
}

const paymentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true
    },
    phone: {
        type: mongoose.Types.ObjectId,
        ref: 'Phone',
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    offer: {
        type: mongoose.Types.ObjectId,
        ref: 'Offer',
        required: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

paymentSchema.statics.build = (attrs: paymentAttrs) => {
    return new Payment(attrs);
}

const Payment = mongoose.model<PaymentDocument, PaymentModel>('Payment', paymentSchema);

export { Payment, PaymentDocument };
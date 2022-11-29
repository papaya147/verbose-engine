import mongoose from "mongoose";

interface paymentAttrs {
    userId: mongoose.Types.ObjectId;
    phoneId: mongoose.Types.ObjectId;
    amount: number;
}

interface PaymentDocument extends mongoose.Document {
    userId: mongoose.Types.ObjectId;
    phoneId: mongoose.Types.ObjectId;
    amount: number;
}

interface PaymentModel extends mongoose.Model<PaymentDocument> {
    build(attrs: paymentAttrs): PaymentDocument;
}

const paymentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true
    },
    phoneId: {
        type: mongoose.Types.ObjectId,
        ref: 'Phone',
        required: true
    },
    amount: {
        type: Number,
        required: true
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

export { Payment };
import mongoose from "mongoose";

interface collaboratorAttrs {
    name: string,
    password: string
}

interface CollaboratorDocument extends mongoose.Document {
    name: string,
    password: string
}

interface CollaboratorModel extends mongoose.Model<CollaboratorDocument> {

}

const collaboratorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

const Collaborator = mongoose.model<CollaboratorDocument, CollaboratorModel>('Collaborator', collaboratorSchema);

export { Collaborator };
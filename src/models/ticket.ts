import { Document, Model, model, Schema } from "mongoose";
import { settings } from "../config/settings"

export interface TicketDoc extends Document {
    ticketId: string;
    subject: string;
    content: string;
    userId: any;
    status: string;
    treatedById?: string;
    isOpenForComment: boolean;
    meta: any;
    isDeleted: boolean;
    createdAt: Date;
    updatedAt: Date;
    treatedDate?: Date
}

const ticketSchema = new Schema({
    subject: {
        type: String,
        required: true,
        minlength: 1
    },
    content: {
        type: String,
        required: true,
        minlength: 1
    },
    ticketId: {
        type: String,
        required: true,
        unique: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    },
    status: {
        type: String,
        required: true,
        default: 'pending',
        enum: ["pending", "open", "closed"]
    },
    meta: {
        comments: [
            {
                comment: {
                    type: String
                },
                commenter: {
                    type: Schema.Types.ObjectId,
                    required: true,
                    refPath: 'meta.comments.onModel'
                },
                onModel: {
                    type: String,
                    required: true,
                    enum: ['user', 'admin']
                },
                createdAt: {
                    type: Date,
                    default: Date.now
                },
            },
        ],
    },
    treatedById: {
        type: Schema.Types.ObjectId,
        ref: 'admin'
    },
    treatedDate: {
        type: Date
    },
    isOpenForComment: {
        type: Boolean,
        default: false
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

ticketSchema.methods.toJSON = function () {
    const obj = this.toObject();
    delete obj._id
    return obj
}

export const TicketModel: Model<TicketDoc> = model<TicketDoc>(settings.mongodb.collections.ticket, ticketSchema)
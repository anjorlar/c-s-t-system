import { Document, Model, model, Schema } from "mongoose";
import { settings } from "../config/settings"
import jwt from "jsonwebtoken"
import utils from "../utils/utils"

export interface AdminDoc extends Document {
    _id: string;
    name: string;
    email: string;
    password: string;
    role: string;
    isDeleted: boolean;
}

const adminSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            minlength: 5,
            trim: true
        },
        email: {
            type: String,
            required: true,
            minlength: 5,
            trim: true,
            unique: true
        },
        password: {
            type: String,
            required: true,
            minlength: 6,
            trim: true,
        },
        role: {
            type: String,
            required: true,
            enum: ["admin", "agent"],
            default: "admin",
        },
        isDeleted: {
            type: Boolean,
            default: false
        }
    }, {
    timestamps: true
}
);

adminSchema.methods.toJSON = function () {
    const obj: any = this.toObject()
    delete obj.password;
    delete obj._id;
    return obj;
};

adminSchema.pre("save", async function (next) {
    const admin = this;

    if (admin.isModified("password")) {
        const hashed = await utils.hashPassword(admin.get("password"))
        admin.set("password", hashed)
    }
    next()
})

adminSchema.methods.generateAuthToken = function () {
    const tokendata = {
        id: this._id,
    };
    const token = jwt.sign(tokendata, settings.jwt.SECRETKEY, {
        subject: settings.appName,
        algorithm: settings.jwt.alg,
        expiresIn: settings.jwt.expires,
        issuer: settings.jwt.issuer
    });
    return token;
}

export const AdminModel: Model<AdminDoc> = model<AdminDoc>(settings.mongodb.collections.admin, adminSchema)

async function start() {
    const email = settings.rootAdmin.email.toLowerCase()
    const existingAdmin = await AdminModel.findOne({
        email: email
    })
    if (!existingAdmin) {
        const admin = new AdminModel();
        admin.name = settings.rootAdmin.name;
        admin.email = email;
        admin.password = settings.rootAdmin.password
        await admin.save()
    }
}

start()
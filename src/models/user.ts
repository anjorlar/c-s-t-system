import * as mongoose from "mongoose"
import { settings } from "../config/settings"
import jwt from "jsonwebtoken"
import utils from "../utils/utils"

export interface UserDoc extends mongoose.Document {
    _id: string;
    name: string;
    email: string;
    password: string;
    isDeleted: boolean;
    generateAuthToken: Function;
}

const userSchema = new mongoose.Schema(
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
            trim: true
        },
        isDeleted: {
            type: Boolean,
            default: false
        }

    }, {
    timestamps: true
}
);

userSchema.methods.toJSON = function () {
    const obj: any = this.toObject();
    delete obj.password;
    delete obj._id;
    return obj;
}

userSchema.pre("save", async function (next) {
    const user = this;

    if (user.isModified("password")) {
        const hashed = await utils.hashPassword(user.get("password"))
        user.set("password", hashed)
    }
    next();
})

userSchema.methods.generateAuthToken = function () {
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

export const UserModel: mongoose.Model<UserDoc> = mongoose.model<UserDoc>(settings.mongodb.collections.user, userSchema)
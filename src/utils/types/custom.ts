import { Request } from "express"

export interface IRequestAdmin extends Request {
    user?: {
        _id: string;
        role?: string;
    };
}

export interface IRequestUser extends Request {
    user?: {
        _id: string
    }
}

export interface ITicket {
    ticketId: string;
    subject: string;
    content: string;
    userId?: string
}

export interface IAdmin {
    name: DOMStringList;
    email: string;
    password: string;
    role?: string;
}

export interface IUser {
    name: string;
    email: string;
    password: string
}

export interface ICategory {
    categoryId: string;
    title: string
}
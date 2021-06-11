import { ObjectID } from "mongodb";
import { v4 as uuidv4 } from "uuid";
import { UserModel } from "./../../models/user"
import { AdminModel } from "./../../models/admin"
import { TicketModel } from "./../../models/ticket"

const users = [
    {
        _id: new ObjectID(),
        name: "jane doe",
        email: "dummy1@mail.com",
        password: "password"
    }, {
        name: "rex fox",
        email: "dummy@example.com",
        password: "password"
    },
];

const admin = [
    {
        name: "john doe",
        email: "john@mail.com",
        password: "password",
        role: "admin"
    },
    {
        _id: new ObjectID(),
        name: "jane doe",
        email: "dummy1@mail.com",
        password: "password",
        role: "agent"
    }
];


const tickets = [
    {
        subject: "Ticket one",
        content: "content lorem ipsum",
        userId: users[0]._id,
        ticketId: uuidv4(),
    },
    {
        subject: "Ticket one",
        content: "content lorem ipsum",
        userId: users[0]._id,
        ticketId: uuidv4(),
        meta: {
            comments: [
                {
                    comment: "admin comment",
                    commenter: admin[1]._id,
                    onModel: "admin"
                }
            ]
        },
        isOpenForComment: true
    },
];

const seedUsers = async () => {
    try {
        await UserModel.deleteMany({});
        const u1 = new UserModel(users[0])
        await u1.save();
        const u2 = new UserModel(users[1])
        await u2.save()
    } catch (error) {
        console.error("error seeding users", error)
    }
};

const seedAdmin = async () => {
    try {
        await AdminModel.deleteMany({});
        const a1 = new AdminModel(admin[0])
        await a1.save()
        const a2 = new AdminModel(admin[1])
        await a2.save()
    } catch (error) {
        console.error("error seeding admin", error)
    }
};

const seedTickets = async () => {
    try {
        await TicketModel.deleteMany({});
        const t1 = new TicketModel(tickets[0])
        await t1.save()
        const t2 = new TicketModel(tickets[1])
        await t2.save()
    } catch (error) {
        console.error("error seeding tickets", error)
    }
};

export {
    users, seedUsers,
    admin, seedAdmin,
    tickets, seedTickets
};

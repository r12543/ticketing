import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

declare global {
    namespace NodeJS {
        interface Global {
            signin(id?: string): string[];
        }
    }
}

jest.mock("../nats-wrapper");

process.env.STRIPE_KEY =
    "sk_test_51J7QZCSFkvBD13IfBncDKjV3of7KZqBID3UvQTT28FyLn1NrKL1PJlrC9dRisdGIea3SDpTnIMR6GYFJ8jPm6PiF00BpFtOoaT";

let mongo: any;

beforeAll(async () => {
    process.env.JWT_KEY = "secret_key";
    process.env.NODE_ENV = "test";
    mongo = new MongoMemoryServer();
    const mongoUri = await mongo.getUri();

    await mongoose.connect(mongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
});

beforeEach(async () => {
    const collections = await mongoose.connection.db.collections();

    for (let collection of collections) {
        await collection.deleteMany({});
    }
});

afterAll(async () => {
    await mongo.stop();
    await mongoose.connection.close();
});

global.signin = (id?: string) => {
    // build a JWT payload. {id, email, iat}
    const payload = {
        id: id || new mongoose.Types.ObjectId().toHexString(),
        email: "test@test.com",
    };
    // Create the JWT.
    const token = jwt.sign(payload, process.env.JWT_KEY!);
    // Build session Object. {jwt: MY_JWT}
    const session = { jwt: token };
    // Turn that session into JSON
    const sessionJSON = JSON.stringify(session);
    // Take JSON and encode it as base64
    const base64 = Buffer.from(sessionJSON).toString("base64");
    // return a string thats the cookie with the encoded data. {express:sess=}
    return [`express:sess=${base64}`];
};

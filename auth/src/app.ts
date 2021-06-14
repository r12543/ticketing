import express from "express";
import "express-async-errors";
import cookieSession from "cookie-session";

import { currentUserRouter } from "./routes/current-user";
import { signInRouter } from "./routes/signin";
import { signUpRouter } from "./routes/signup";
import { signOutRouter } from "./routes/signout";
import { errorHandler } from "./middlewares/error-handler";
import { NotFoundError } from "./errors/not-found-error";

const app = express();
app.set("trust proxy", true);
app.use(express.json());
app.use(
    cookieSession({
        signed: false,
        secure: process.env.NODE_ENV !== "test",
    })
);

app.use(currentUserRouter);
app.use(signInRouter);
app.use(signUpRouter);
app.use(signOutRouter);

app.all("*", async (req, res) => {
    throw new NotFoundError();
});

app.use(errorHandler);

export { app };

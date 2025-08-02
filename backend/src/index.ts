import "dotenv/config";
import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import session from "express-session";
import MongoStore from "connect-mongo";
import { asyncHandler } from "./middlewares/asyncHandler.middleware";
import { BadRequestException } from "./utils/appError";
import { ErrorCodeEnum } from "./enums/error-code.enum";
import { config } from "./config/app.config";
import "./config/passport.config";
import passport from "passport";
import { errorHandler } from "./middlewares/errorHandler.middleware";
import connectDatabase from "./config/database.config";
import isAuthenticated from "./middlewares/isAuthenticated.middleware";
import authRoutes from "./routes/auth.route";
import userRoutes from "./routes/user.route";
import workspaceRoutes from "./routes/workspace.route";
import memberRoutes from "./routes/member.route";
import projectRoutes from "./routes/project.route";
import taskRoutes from "./routes/task.route";

const BASE_PATH = config.BASE_PATH;
const app = express();

app.set("trust proxy", 1);

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

console.log("NODE_ENV:", config.NODE_ENV);
console.log("FRONTEND_ORIGIN:", config.FRONTEND_ORIGIN);

app.use(
  session({
    name: "session",
    secret: config.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: config.MONGO_URI,
      touchAfter: 24 * 3600,
    }),
    cookie: {
      maxAge: 24 * 60 * 60 * 1000,
      secure: config.NODE_ENV === "production",
      httpOnly: true,
      sameSite: config.NODE_ENV === "production" ? "none" : "lax",
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(
  cors({
    origin: config.FRONTEND_ORIGIN,
    credentials: true,
  })
);

app.get(
  `/`,
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    throw new BadRequestException(
      "Bad request",
      ErrorCodeEnum.AUTH_INVALID_TOKEN
    );
  })
);

app.use(`${BASE_PATH}/auth`, authRoutes);
app.use(`${BASE_PATH}/user`, isAuthenticated, userRoutes);
app.use(`${BASE_PATH}/workspace`, isAuthenticated, workspaceRoutes);
app.use(`${BASE_PATH}/member`, isAuthenticated, memberRoutes);
app.use(`${BASE_PATH}/project`, isAuthenticated, projectRoutes);
app.use(`${BASE_PATH}/task`, isAuthenticated, taskRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || config.PORT;

app.listen(PORT, async () => {
  console.log(`Server listening on port ${PORT} in ${config.NODE_ENV}`);
  await connectDatabase();
});

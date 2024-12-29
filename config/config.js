import dotenv from "dotenv";
dotenv.config();

const corsOptions = {
  origin: [
    "http://localhost:5173",
    "http://localhost:5000",
    process.env.CLIENT_URL,
  ],
  credentials: true,
};
const AuthToken = "Auth-Token";

export { corsOptions, AuthToken };

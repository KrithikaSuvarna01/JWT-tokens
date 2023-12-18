import express from "express";
import { type Request, type Response } from "express";
import { Low } from "lowdb";
import { JSONPreset } from "lowdb/node";
import bcrypt from "bcrypt";
import cookieParser from "cookie-parser";
import { createTokens, validateToken } from "./JWT.js";

/**
 * Interface representing the structure of a user.
 */
interface User {
  username: string;
  password: string;
}

/**
 *  Initialize the database with Lowdb.
 */
let db: Low<{ users: User[] }> | null = null;

/**
 * Asynchronously initialize the database.
 */
async function initializeDB() {
  db = await JSONPreset<{ users: User[] }>("db.json", { users: [] });
}

initializeDB();

const app = express();

app.use(express.json());
app.use(cookieParser());

/**
 * Endpoint for user registration.
 * Registers a new user in the database.
 */
app.post("/register", async (req: Request, res: Response) => {
  const { username, password } = req.body;
  try {
    const hash = await bcrypt.hash(password, 10);
    db!.data.users.push({
      username: username,
      password: hash,
    });
    db!.write();
    res.json("User Registered");
  } catch (err) {
    res.status(400).json("Failed to Register the user" + err);
  }
});

/**
 * Endpoint for user login.
 * Validates user credentials and generates access tokens.
 */
app.post("/login", async (req: Request, res: Response) => {
  const { username, password } = req.body;
  try {
    const user = db!.data.users.find((user) => user.username === username);
    if (!user) {
      res.status(404).json({ error: "User Does not exists" });
    } else {
      const dbPassword = user.password;
      const match = await bcrypt.compare(password, dbPassword);
      if (!match) {
        res.status(400).json("Wrong username and password combination");
      } else {
        const accessToken = createTokens(user);
        res.cookie("access-token", accessToken, {
          maxAge: 60 * 60 * 24 * 30 * 1000,
        });
        res.json("Logged In succesfully ");
      }
    }
  } catch (err) {
    res.json("Failed to login ");
  }
});

/**
 * Protected endpoint to access user profile.
 * Validates JWT token and allows access to user profile.
 */
app.get("/profile", validateToken, (req: Request, res: Response) => {
  res.json("Welcome to my profile");
});

/**
 * Start the Express server on the specified port.
 */
app.listen(4000, () => {
  console.log(`Server is running on port 4000`);
});

export default app;

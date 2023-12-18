import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

/**
 * Interface extending Express Request to include a custom property.
 */
interface customRequest extends Request {
  authenticated?: boolean;
}

/**
 * Generates an access token for the provided user credentials.
 * user - The user object containing username and password.
 * The generated access token.
 */
export const createTokens = (user: { username: string; password: string }) => {
  const accessToken = jwt.sign(user.username, "jwtsecret");
  return accessToken;
};

/**
 * Middleware to validate the JWT token present in the request cookies.
 */
export const validateToken = (
  req: customRequest,
  res: Response,
  next: NextFunction
) => {
  const accessToken = req.cookies["access-token"];
  if (!accessToken) {
    return res.status(400).json({ error: "User Not Authenicated!!!" });
  }
  try {
    const validToken = jwt.verify(accessToken, "jwtsecret");
    if (validToken) {
      req.authenticated = true;
      return next();
    }
  } catch (err) {
    return res.status(400).json({ error: err });
  }
};

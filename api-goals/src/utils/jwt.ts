import jwt from "jsonwebtoken"
import { UserPayload } from "../types/auth";

const JWT_SECRET = process.env.JWT_SECRET as string;

export function signToken(payload: UserPayload) {
    return jwt.sign(payload, JWT_SECRET, {
        expiresIn: '1d'
    });
};

export function verifyToken(token: string) {
    return jwt.verify(token, JWT_SECRET) as UserPayload;
};
import { NextRequest } from "next/server";
import jwt  from "jsonwebtoken";



export const getDataFromToken = (request: NextRequest) => {
    try {
        if (!process.env.TOKEN_SECRET) {
            throw new Error("TOKEN_SECRET is not configured");
        }

        const token = request.cookies.get("token")?.value || ''
        const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET)
        if (typeof decodedToken === "string" || !("id" in decodedToken)) {
            throw new Error("Invalid token");
        }
        return decodedToken.id;
    } catch (error: unknown) {
        throw new Error(error instanceof Error ? error.message : "Invalid token");
    }
}

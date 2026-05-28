import {connect} from "@/dbConfig/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/userModel";

export async function POST(request: NextRequest){
    await connect();

    try {
        const reqBody = await request.json()
        const {token} = reqBody

        if (!token) {
            return NextResponse.json({error: "Verification token is required"}, {status: 400})
        }

        const user = await User.findOne({verifyToken: token, verifyTokenExpiry: {$gt: Date.now()}});

        if (!user) {
            return NextResponse.json({error: "Invalid token"}, {status: 400})
        }

        user.isVerified = true;
        user.verifyToken = undefined;
        user.verifyTokenExpiry = undefined;
        await user.save();
        
        return NextResponse.json({
            message: "Email verified successfully",
            success: true
        })


    } catch (error: unknown) {
        return NextResponse.json({error: error instanceof Error ? error.message : "Email verification failed"}, {status: 500})
    }

}

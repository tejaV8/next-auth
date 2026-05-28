import { getDataFromToken } from "@/helpers/getDataFromToken";

import { NextRequest, NextResponse } from "next/server";

import User from "@/models/userModel"
import {connect} from "@/dbConfig/dbConfig"

export async function GET(request: NextRequest){
    await connect();

    try {
        const userId = await getDataFromToken(request);
        const user = await User.findOne({_id:userId}).select("-password");

        if (!user) {
            return NextResponse.json({error: "User not found"}, {status: 404})
        }

        return NextResponse.json({
            message: "User found",
            data: user,
        })
    } catch (error: unknown) {
        return NextResponse.json({error: error instanceof Error ? error.message : "Invalid request"}, {status: 400})
    }
}

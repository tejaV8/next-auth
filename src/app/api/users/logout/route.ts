import { NextResponse } from "next/server";


export async function GET(){
    try {
        const response = NextResponse.json(
            {
                message: "Logout Successful",
                success: true
            }
        )
        response.cookies.set("token", "", {httpOnly: true, expires: new Date(0)});
        return response;
         
    } catch (error: unknown) {
        return NextResponse.json({error: error instanceof Error ? error.message : "Logout failed"}, {status: 500})
    }
}

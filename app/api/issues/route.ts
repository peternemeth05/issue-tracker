import { NextRequest, NextResponse } from "next/server";
import { validateHeaderValue } from "node:http";
import { z } from 'zod';

import prisma from "@/prisma/ client";


const createIssueSchema = z.object({ // this is a blueprint that defines what teh incoming data should look like
    title: z.string().min(1, 'Title is required').max(255), // this is the requirement
    description: z.string().min(1, 'description is required')
})

export async function POST(request: NextRequest){
    const body = await request.json();
    const validation = createIssueSchema.safeParse(body);
    if (!validation.success)
        return NextResponse.json(validation.error.format(), {status: 400}) 
    // this makes sure the input is valid otherwise a 400 error, meaning the client sent invalid data

    const newIssue = await prisma.issue.create({
        data: {title: body.title, description: body.description}
    })

    return NextResponse.json(newIssue, {status: 201})

}
import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { auth } from './lib/auth';

export async function proxy(request) {
    const session = await auth.api.getSession({
        headers: await headers()
    }) 
    const user = session?.user;

    if (!user) {
        return NextResponse.redirect(new URL('/register', request.url))
    }
    return NextResponse.next();
}

export const config = {
    matcher: [
        '/events',             
        '/events/:id',         
        '/create-event'      
    ],
}
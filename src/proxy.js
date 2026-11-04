import { NextResponse } from 'next/server';
import { auth } from './lib/auth'; 

export async function proxy(request) {
    const session = await auth.api.getSession({
        headers: request.headers 
    }); 

    const user = session?.user;

    if (!user) {
        return NextResponse.redirect(new URL('/register', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/events', '/events/:id', '/create-event'],
};
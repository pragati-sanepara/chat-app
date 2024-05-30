import { getSession } from 'next-auth/react';
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import type { IncomingMessage, IncomingHttpHeaders } from 'http';

function convertHeaders(headers: Headers): IncomingHttpHeaders {
    const result: IncomingHttpHeaders = {};
    headers.forEach((value, key) => {
        result[key.toLowerCase()] = value;
    });
    return result;
}

function adaptNextRequestToIncomingMessage(req: NextRequest): Partial<IncomingMessage> {
    return {
        headers: convertHeaders(req.headers),
        method: req.method,
        url: req.url,
    };
}

export async function middleware(request: NextRequest) {
    const adaptedRequest = adaptNextRequestToIncomingMessage(request);
    const session = await getSession({ req: adaptedRequest });
    const url = request.nextUrl.clone();

    if (!session) {
        if (url.pathname !== '/') {
            url.pathname = '/';
            return NextResponse.redirect(url);
        }
    } else {
        if (url.pathname === '/') {
            url.pathname = '/dashboard';
            return NextResponse.redirect(url);
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/', '/dashboard/:path*'],
};
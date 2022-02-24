import { NextResponse, NextRequest } from 'next/server'

export async function middleware(req, ev) {
    const { pathname } = req.nextUrl
    if (req.cookies['x-token'] === undefined && !pathname.match("\\/login")) {
        return NextResponse.redirect('/login')
    }
    if (req.cookies['x-token'] !== undefined && pathname.match("\\/login")) {
        console.log('a')
        return NextResponse.redirect("/dashboard")
    }
    return NextResponse.next()
}
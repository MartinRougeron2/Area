import { NextResponse } from 'next/server'

export async function middleware(req, ev) {
    const { pathname } = req.nextUrl
    if (req.cookies['x-token'] === undefined && !pathname.match("\\/login")) {
        return NextResponse.redirect('http://localhost:8081/login')
    }
    if (req.cookies['x-token'] !== undefined && pathname.match("\\/login")) {
        console.log('a')
        return NextResponse.redirect("http://localhost:8081/dashboard")
    }
    return NextResponse.next()
}

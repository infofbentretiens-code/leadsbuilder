import {NextResponse} from 'next/server';
import {SESSION_COOKIE,verifySession} from './lib/session.mjs';
export async function middleware(request) {
  const id=await verifySession(request.cookies.get(SESSION_COOKIE)?.value), path=request.nextUrl.pathname;
  if ((path.startsWith('/dashboard')||path.startsWith('/leads'))&&!id) return NextResponse.redirect(new URL('/auth/login',request.url));
  if ((path==='/auth/login'||path==='/auth/signup')&&id) return NextResponse.redirect(new URL('/dashboard',request.url));
  return NextResponse.next();
}
export const config={matcher:['/dashboard/:path*','/leads/:path*','/auth/login','/auth/signup']};


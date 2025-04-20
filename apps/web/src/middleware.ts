import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

async function verifyJwtToken(token: string) {
  try {
    const verifiedToken = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET_KEY),
    );

    return verifiedToken.payload;
  } catch (error) {
    console.error(error);
  }
}

export async function middleware(request: NextRequest) {
  const accessToken = request.cookies.get('accessToken')?.value;
  const verifiedToken = await verifyJwtToken(accessToken!);

  if (!accessToken || !verifiedToken) {
    const url = new URL('/auth/user-login', request.url);
    url.searchParams.set('error', 'unauthorized');
    return NextResponse.redirect(url);
  }

  // return NextResponse.next() --> jika tidak mempunyai role

  // const pathname = request.nextUrl.pathname;
  const { pathname } = request.nextUrl;
  const role = verifiedToken.role;

  if (pathname.startsWith('/user-profile') && role === 'CUSTOMER') {
    return NextResponse.next();
  }

  // if (pathname.startsWith('/cart') && role === 'CUSTOMER') {
  //   return NextResponse.next();
  // }

  if (pathname.startsWith('/store-management') && role === 'SUPER_ADMIN') {
    return NextResponse.next();
  }

  return NextResponse.redirect(new URL('/not-found', request.url));
}

export const config = {
  matcher: ['/user-profile/:path*', '/cart/:path*', '/store-management'],
};

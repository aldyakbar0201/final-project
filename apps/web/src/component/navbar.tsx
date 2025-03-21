import { ShoppingCart, User, ZoomIn } from 'lucide-react';
import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          Freshbasket
        </Link>
        <div className="flex items-center space-x-4">
          <Link href="/explore" className="flex items-center">
            <ZoomIn className="w-6 h-6 mr-1" />
            <span className="sr-only">Explore</span>
          </Link>
          <Link href="/cart" className="flex items-center">
            <ShoppingCart className="w-6 h-6 mr-1" />
            <span className="sr-only">Cart</span>
          </Link>
          <Link href="/user-profile" className="flex items-center">
            <User className="w-6 h-6 mr-1" />
            <span className="sr-only">Profile</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}

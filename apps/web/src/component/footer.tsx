import Link from 'next/link';
import {
  Home,
  Box,
  Info,
  Phone,
  Mail,
  Facebook,
  Instagram,
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function Footer() {
  return (
    <footer className="bg-gray-100 mt-8">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div>
            <h3 className="text-lg font-semibold mb-4">About Us</h3>
            <p>
              Online Grocery is your one-stop shop for fresh produce and
              everyday essentials.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="flex items-center space-x-2">
                  <Home className="w-4 h-4 text-gray-600" />
                  <span>Home</span>
                </Link>
              </li>
              <li>
                <Link href="/products" className="flex items-center space-x-2">
                  <Box className="w-4 h-4 text-gray-600" />
                  <span>Products</span>
                </Link>
              </li>
              <li>
                <Link href="/about" className="flex items-center space-x-2">
                  <Info className="w-4 h-4 text-gray-600" />
                  <span>About</span>
                </Link>
              </li>
              <li>
                <Link href="/contact" className="flex items-center space-x-2">
                  <Phone className="w-4 h-4 text-gray-600" />
                  <span>Contact</span>
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <div className="flex items-center space-x-2">
              <Mail className="w-5 h-5 text-gray-600" />
              <p>Email: support@onlinegrocery.com</p>
            </div>
            <div className="flex items-center space-x-2 mt-2">
              <Phone className="w-5 h-5 text-gray-600" />
              <p>Phone: (123) 456-7890</p>
            </div>
          </div>
        </motion.div>
        <motion.div
          className="mt-8 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <p>&copy; 2023 Online Grocery. All rights reserved.</p>
          <div className="flex justify-center space-x-4 mt-4">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-600 transition duration-300"
            >
              <Facebook className="w-6 h-6 text-gray-600 hover:text-blue-600" />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-pink-600 transition duration-300"
            >
              <Instagram className="w-6 h-6 text-gray-600 hover:text-pink-600" />
            </a>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}

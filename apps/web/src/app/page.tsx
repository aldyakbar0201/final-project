'use client';

import Footer from '@/component/footer';
import HeroSection from '@/component/hero-section';
import LocationPrompt from '@/component/location-prompt';
import Navbar from '@/component/navbar';
import ProductList from '@/component/product-list';

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection />
      <LocationPrompt />
      <ProductList />
      <Footer />
    </div>
  );
}

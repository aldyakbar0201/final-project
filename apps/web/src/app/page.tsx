'use client';

import HeroSection from '@/component/hero-section';
import LocationPrompt from '@/component/location-prompt';
import ProductList from '@/component/product-list';

export default function Home() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <LocationPrompt />
      <ProductList />
    </div>
  );
}

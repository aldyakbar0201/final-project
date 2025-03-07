import Image from 'next/image';

export default function HeroSection() {
  return (
    <section className="relative h-96 mb-8">
      <Image
        src="/hero-groceries.jpg"
        alt="Fresh groceries"
        fill
        className="object-cover"
      />
      <div className="absolute inset-0 bg-opacity-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">
            Welcome to Online Grocery
          </h1>
          <p className="text-xl text-white">
            Shop fresh produce from your nearest store
          </p>
        </div>
      </div>
    </section>
  );
}

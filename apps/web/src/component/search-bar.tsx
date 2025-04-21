'use client';

import type React from 'react';
import { useEffect, useState, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Input } from '@/component/ui/input';
import { Button } from '@/component/ui/button';
import { Search } from 'lucide-react';

type SearchBarProps = {
  onSearch: (query: string) => void;
};

export default function SearchBar({ onSearch }: SearchBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [searchQuery, setSearchQuery] = useState('');

  // Sync with URL params (optional, if you want initial value from URL)
  useEffect(() => {
    const initialQuery = searchParams.get('search') || '';
    setSearchQuery(initialQuery);
    onSearch(initialQuery);
  }, [searchParams, onSearch]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    const params = new URLSearchParams(searchParams);
    if (searchQuery) {
      params.set('search', searchQuery);
    } else {
      params.delete('search');
    }

    startTransition(() => {
      router.push(`/products?${params.toString()}`);
    });

    onSearch(searchQuery);
  };

  return (
    <form onSubmit={handleSearch} className="flex gap-2 max-w-lg mx-auto mb-8">
      <div className="relative flex-grow">
        <Search
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          size={18}
        />
        <Input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>
      <Button type="submit" disabled={isPending}>
        {isPending ? 'Searching...' : 'Search'}
      </Button>
    </form>
  );
}

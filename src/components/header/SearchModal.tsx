'use client';

import React, { useState } from "react";
import { useRouter } from 'next/navigation';
import { Search, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getLocalizedPath } from "@/lib/localization";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  locale: string;
  searchPlaceholder: string;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose, locale, searchPlaceholder }) => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(getLocalizedPath(`/search?q=${encodeURIComponent(searchQuery)}`, locale));
      onClose();
      setSearchQuery("");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[60]"
            onClick={onClose}
          />

          {/* Search Panel */}
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            className="fixed top-0 left-0 right-0 bg-white dark:bg-gray-900 shadow-2xl z-[70] p-6"
          >
            <div className="container mx-auto max-w-3xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-amber-900 dark:text-amber-100">
                  Search
                </h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSearch} className="relative">
                <Input
                  type="text"
                  placeholder={searchPlaceholder}
                  className="w-full text-lg py-6 pr-12"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                />
                <Button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-amber-700 hover:bg-amber-800"
                >
                  <Search className="w-5 h-5" />
                </Button>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

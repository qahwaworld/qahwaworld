'use client';

import React, { useState } from "react";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Category } from "@/lib/actions/site/headerMenuAction";
import { getLocalizedPath } from "@/lib/localization";

interface NavigationMenuProps {
  menuItems: Category[];
  locale: string;
  isScrolled: boolean;
}

export const NavigationMenu: React.FC<NavigationMenuProps> = ({ menuItems, locale, isScrolled }) => {
  const pathname = usePathname();
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const isRTL = locale === 'ar';

  const getPath = (path: string) => getLocalizedPath(path, locale);

  return (
    <>
      {menuItems.map((item, index) => (
        <div
          key={item.path}
          className="relative"
          onMouseEnter={() => setOpenSubmenu(item.path)}
          onMouseLeave={() => setOpenSubmenu(null)}
        >
          <Link
            href={getPath(item.path)}
            className={`${index === 0 ? (isRTL ? 'pl-4 pr-0' : 'pl-0 pr-4') : 'px-4'} py-2 text-md hover:text-amber-700 dark:hover:text-amber-400 transition-colors flex items-center gap-1 ${
              pathname?.includes(item.path)
                ? "text-amber-700 dark:text-amber-400"
                : "text-gray-700 dark:text-amber-300"
            }`}
          >
            {item.name}
            {item.subcategories && item.subcategories.length > 0 && (
              <ChevronDown className="w-3 h-3" />
            )}
          </Link>

          {/* Submenu Dropdown */}
          <AnimatePresence>
            {openSubmenu === item.path && item.subcategories && item.subcategories.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute top-full left-0 mt-1 bg-white dark:bg-gray-800 border dark:border-gray-700 shadow-lg py-2 min-w-[180px] z-50"
              >
                {item.subcategories.map((subitem) => (
                  <Link
                    key={subitem.path}
                    href={getPath(subitem.path)}
                    onClick={() => setOpenSubmenu(null)}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-amber-300 hover:bg-amber-50 dark:hover:bg-gray-700 hover:text-amber-700 dark:hover:text-amber-400 transition-colors"
                  >
                    {subitem.name}
                  </Link>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </>
  );
};

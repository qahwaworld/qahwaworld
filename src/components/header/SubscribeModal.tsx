'use client';

import React, { useState } from "react";
import { Mail, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface SubscribeModalProps {
  isOpen: boolean;
  onClose: () => void;
  translations: {
    subscribe: string;
    email: string;
    close: string;
    toastEmailRequired: string;
    toastEmailAlreadySubscribed: string;
    toastSubscriptionSuccess: string;
    toastSubscriptionError: string;
    toastSubscribing: string;
  };
}

export const SubscribeModal: React.FC<SubscribeModalProps> = ({ isOpen, onClose, translations }) => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      toast.error(translations.toastEmailRequired);
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/mc/subscribeUser", {
        body: JSON.stringify({
          email: email.trim(),
          firstName: "",
          lastName: "",
        }),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      });

      const json = await response.json();
      const { data, error } = json;

      if (error) {
        // Check if error is the "already subscribed" message and use localized version
        const errorMessage = error.toLowerCase().includes('already subscribed') 
          ? translations.toastEmailAlreadySubscribed 
          : error;
        toast.error(errorMessage);
        setIsLoading(false);
        return;
      }

      toast.success(translations.toastSubscriptionSuccess);
      onClose();
      setEmail("");
    } catch (error) {
      console.error("Subscription error:", error);
      toast.error(translations.toastSubscriptionError);
    } finally {
      setIsLoading(false);
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
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center"
            onClick={onClose}
          >
            {/* Modal */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-gray-900 rounded-lg shadow-2xl p-8 max-w-md w-full mx-4 pt-40"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-amber-100 dark:bg-amber-900 rounded-full">
                    <Mail className="w-6 h-6 text-amber-700 dark:text-amber-300" />
                  </div>
                  <h2 className="text-2xl font-bold text-amber-900 dark:text-amber-100">
                    {translations.subscribe}
                  </h2>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors newsletter-close-button"
                  aria-label="Close subscribe"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Get the latest coffee news and stories delivered to your inbox.
              </p>

              <form onSubmit={handleSubscribe} className="space-y-4">
                <Input
                  type="email"
                  placeholder={translations.email}
                  className="w-full"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Button
                  type="submit"
                  className="w-full bg-amber-700 hover:bg-amber-800"
                  disabled={isLoading}
                >
                  <Mail className="w-4 h-4 mr-2" />
                  {isLoading ? translations.toastSubscribing : translations.subscribe}
                </Button>
              </form>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

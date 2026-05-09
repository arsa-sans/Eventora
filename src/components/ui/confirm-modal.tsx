"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Loader2, AlertTriangle, X } from "lucide-react";
import { useEffect } from "react";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Konfirmasi",
  cancelText = "Batal",
  isLoading = false,
}: ConfirmModalProps) {
  // Prevent scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm"
            onClick={isLoading ? undefined : onClose}
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden z-10 relative border border-border"
          >
            <div className="p-6">
              <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-4 mx-auto">
                <AlertTriangle className="w-6 h-6" />
              </div>
              
              <div className="text-center mb-6">
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {title}
                </h3>
                <p className="text-sm text-text-secondary">
                  {description}
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  disabled={isLoading}
                  onClick={onClose}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-border text-foreground font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  {cancelText}
                </button>
                <button
                  type="button"
                  disabled={isLoading}
                  onClick={onConfirm}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-red-600 text-white font-medium hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  {confirmText}
                </button>
              </div>
            </div>
            
            <button
              onClick={onClose}
              disabled={isLoading}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
            >
              <X className="w-5 h-5" />
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

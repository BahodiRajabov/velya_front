"use client";

import { toast as hotToast, Toaster as HotToaster } from "react-hot-toast";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

export type ToastProps = {
  title?: string;
  description?: string;
  action?: React.ReactNode;
};

export const toast = hotToast;

export function Toaster() {
  return (
    <HotToaster 
      position="top-right"
      toastOptions={{
        className: "bg-white border border-slate-200 shadow-md rounded-md p-4",
        success: {
          icon: (
            <div className="rounded-full bg-green-100 p-1">
              <svg
                className="h-4 w-4 text-green-600"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
          ),
        },
        error: {
          icon: (
            <div className="rounded-full bg-red-100 p-1">
              <X className="h-4 w-4 text-red-600" />
            </div>
          ),
        },
      }}
    />
  );
}

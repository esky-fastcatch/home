

import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Toaster } from "@/components/ui/toaster";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <style>{`
        @import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css');
        
        * {
          font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
        }
        
        :root {
          --primary: #3b82f6;
          --primary-hover: #2563eb;
          --success: #10b981;
          --card-bg: #f3f4f6;
        }

        /* Toast 스타일 커스터마이징 */
        [data-sonner-toast][data-type="error"],
        [data-sonner-toast][data-type="warning"] {
          background-color: #ffcdd2 !important;
          border-color: #ef9a9a !important;
          color: #ffffff !important;
        }

        [data-sonner-toast][data-type="error"] [data-title],
        [data-sonner-toast][data-type="warning"] [data-title] {
          color: #ffffff !important;
        }

        [data-sonner-toast][data-type="error"] [data-description],
        [data-sonner-toast][data-type="warning"] [data-description] {
          color: #ffffff !important;
        }
      `}</style>
      
      {/* Header - Fixed */}
      <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 shadow-sm z-50">
        <div className="max-w-2xl mx-auto">
          <div className="flex justify-between items-center h-16 px-6">
            {/* Left Section - Logo & Service Name */}
            <Link 
              to={createPageUrl("Home")} 
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <div className="flex items-center">
                <img 
                  src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e43c3db6e987772672f539/65c633c02_logo.jpg" 
                  alt="패스트캐치 로고" 
                  className="w-10 h-10 object-contain"
                />
              </div>
              <div className="flex flex-col">
                <img 
                  src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e43c3db6e987772672f539/f4693e494_text.jpg"
                  alt="패스트캐치"
                  className="h-6 sm:h-7 w-auto object-contain"
                />
                <p className="text-xs text-gray-500 hidden sm:block mt-0.5">
                  간편 화장 예약 서비스
                </p>
              </div>
            </Link>

            {/* Right Section - My Reservations Button */}
            <Link
              to={createPageUrl("MyReservations")}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors shadow-sm text-sm sm:text-base"
            >
              나의 예약 조회
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content - Add padding-top to account for fixed header */}
      <main className="flex-1 pt-16">
        {children}
      </main>

      {/* Toaster for notifications */}
      <Toaster />
    </div>
  );
}


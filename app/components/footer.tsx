import React from "react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-4 w-full mt-auto fixed bottom-0">
      <div className="container mx-auto flex justify-center items-center">
        <div className="flex space-x-6">
          <a
            href={`${import.meta.env.VITE_SERVICE_URL}/swagger/index.html`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-400 transition-colors"
          >
            API Documentation
          </a>
          <span>|</span>
          <a
            href="https://github.com/goporo/url-shortener"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-400 transition-colors"
          >
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}

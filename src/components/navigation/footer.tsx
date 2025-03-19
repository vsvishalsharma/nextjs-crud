import React from 'react';
import Link from 'next/link';
import { Linkedin, Mail } from 'lucide-react';
import { GitHubLogoIcon } from '@radix-ui/react-icons';

const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-gray-100 border-t  border-gray-200 py-6 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center md:flex-row md:justify-between">
          <div className="mb-4 md:mb-0">
            <p className="text-gray-600 text-sm">
              © {new Date().getFullYear()} Vishal Sharma. All rights reserved.
            </p>
          </div>
          
          <div className="flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-4">
            <Link 
              href="mailto:vsvishalsharma777@gmail.com" 
              className="text-gray-600 hover:text-gray-900 transition-colors flex items-center space-x-2"
              aria-label="Email"
            >
              <Mail size={20} />
              <span className="text-sm">vsvishalsharma777@gmail.com</span>
            </Link>
            
            <Link 
              href="https://github.com/vsvishalsharma" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-gray-900 transition-colors flex items-center space-x-2"
              aria-label="GitHub Profile"
            >
              <GitHubLogoIcon width={20} height={20} />
              <span className="text-sm">github.com/vsvishalsharma</span>
            </Link>
            
            <Link 
              href="https://www.linkedin.com/in/vsvishalsharma777" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-gray-900 transition-colors flex items-center space-x-2"
              aria-label="LinkedIn Profile"
            >
              <Linkedin size={20} />
              <span className="text-sm">linkedin.com/in/vsvishalsharma777</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
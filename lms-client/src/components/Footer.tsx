import { BookOpen, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-orange-900 to-amber-800 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <BookOpen className="h-10 w-10 text-amber-300 animate-pulse" />
              <span className="text-3xl font-extrabold text-amber-100 tracking-tight">LibraryHub</span>
            </div>
            <p className="text-amber-100/80 mb-6 max-w-md leading-relaxed">
              Your premier destination for digital library management. Connecting readers with books and communities with knowledge.
            </p>
            <div className="flex items-center space-x-2 text-amber-200 hover:text-amber-300 transition-colors duration-300">
              <Mail className="h-5 w-5" />
              <span>contact@libraryhub.com</span>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-6 text-amber-200">Quick Links</h3>
            <ul className="space-y-3">
              {["Browse Books", "My Library", "Recommendations", "Reading Lists"].map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="text-amber-100/80 hover:text-amber-300 transition-colors duration-300 font-medium"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-6 text-amber-200">Support</h3>
            <ul className="space-y-3">
              {["Help Center", "Contact Us", "Privacy Policy", "Terms of Service"].map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="text-amber-100/80 hover:text-amber-300 transition-colors duration-300 font-medium"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-amber-700/50 mt-12 pt-8 text-center text-amber-200/80">
          <p>© 2025 LibraryHub. All rights reserved. Built with ❤️ for book lovers.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
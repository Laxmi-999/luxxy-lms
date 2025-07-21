import { BookOpen, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-black/80  text-white]">
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <BookOpen className="h-10 w-10 text-yellow-300  animate-pulse" />
              <span className="text-3xl font-extrabold text-[#F8F9FA] tracking-tight">LibraryHub</span>
            </div>
            <p className="text-[#F8F9FA]/80 mb-6 max-w-md leading-relaxed">
              Your premier destination for digital library management. Connecting readers with books and communities with knowledge.
            </p>
            <div className="flex items-center space-x-2 text-[#A0AEC0] hover:text-[#D69E2E] transition-colors duration-300">
              <Mail className="h-5 w-5 text-yellow-500" />
              <span className="text-orange-700">contact@libraryhub.com</span>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-6 text-yellow-300">Quick Links</h3>
            <ul className="space-y-3">
              {["Browse Books", "My Library", "Recommendations", "Reading Lists"].map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="text-[#F8F9FA]/80  hover:text-[#D69E2E] transition-colors duration-300 font-medium"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-6 text-yellow-300">Support</h3>
            <ul className="space-y-3">
              {["Help Center", "Contact Us", "Privacy Policy", "Terms of Service"].map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="text-[#F8F9FA]/80 hover:text-[#D69E2E] transition-colors duration-300 font-medium"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-[#D1D5DB]/50 mt-12 pt-8 text-center text-yellow-300">
          <p>© 2025 LibraryHub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
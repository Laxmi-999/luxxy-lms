// components/HowItWorks.jsx
import { UserPlus, Search, BookOpen, ArrowLeftRight } from 'lucide-react';

const steps = [
  {
    icon: UserPlus,
    title: "1. Register & Login",
    description: "Create your free account or sign in to access our digital library."
  },
  {
    icon: Search,
    title: "2. Discover Books",
    description: "Browse our extensive collection or search for specific titles and authors."
  },
  {
    icon: BookOpen,
    title: "3. Borrow Instantly",
    description: "Borrow your chosen book with a single click and start reading online."
  },
  {
    icon: ArrowLeftRight,
    title: "4. Read & Return",
    description: "Enjoy your book and return it when you're done, all digitally."
  },
];

const HowItWorks = () => {
  return (
    <section className="py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-serif font-bold text-gray-800 mb-4">
            How LibraryHub Works
          </h2>
          <div className="w-24 h-1 bg-gray-200 mx-auto mb-6"></div>
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            Getting started with your digital reading journey is simple and seamless.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div 
              key={index} 
              className="bg-white p-8 rounded-lg shadow-md text-center 
                       border-t-4 border-gray-200 hover:shadow-xl 
                       transition-all duration-300 group"
            > 
              <div className="mb-6 transform group-hover:-translate-y-1 transition-transform duration-300">
                <step.icon className="h-16 w-16 text-gray-400 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                {step.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
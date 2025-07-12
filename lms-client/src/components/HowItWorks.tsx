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
    <section className="py-20 bg-black/80 mt-20 mb-20 "> {/* Deep Library Blue background */}
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-extrabold text-center text-[#F8F9FA] mb-6">How LibraryHub Works</h2> {/* Off-White/Light Gray */}
        <p className="text-xl text-center text-[#D1D5DB] mb-12 max-w-2xl mx-auto"> {/* Light Gray */}
          Getting started with your digital reading journey is simple and seamless.
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="bg-[#FFFFFF]/80 p-8 rounded-lg shadow-lg text-center border border-[#D1D5DB]"> 
              <step.icon className="h-16 w-16 text-orange-500 mx-auto mb-6" />
              <h3 className="text-xl font-semibold text-[#1F2937] mb-3">{step.title}</h3> 
              <p className="text-[#1F2937]">{step.description}</p> 
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
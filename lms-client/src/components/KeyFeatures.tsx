import { BookMarked, Sparkles, Tablet, Cloud } from 'lucide-react';

const features = [
  {
    icon: BookMarked,
    title: "Vast Digital Collection",
    description: "Access thousands of eBooks across all genres, from bestsellers to academic texts."
  },
  {
    icon: Sparkles,
    title: "Personalized Recommendations",
    description: "Our smart system suggests books tailored to your reading preferences."
  },
  {
    icon: Tablet,
    title: "Read Anywhere, Anytime",
    description: "Enjoy your books seamlessly on any device, online or offline."
  },
  {
    icon: Cloud,
    title: "Effortless Management",
    description: "Track your reading progress, manage borrowed books, and organize your library with ease."
  },
];

const KeyFeatures = () => {
  return (
    <section className="py-20 bg-black/50 mt-5 mb-20 ">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-extrabold text-center text-white mb-6">Why Choose LibraryHub?</h2>
        <p className="text-xl text-center text-gray-200 mb-12 max-w-2xl mx-auto">
          Experience the future of reading with features designed to enhance your literary journey.
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-orange-500 p-8 rounded-lg shadow-md text-center border border-yellow-400 hover:bg-orange-600 hover:shadow-xl transition-all duration-300">
              <feature.icon className="h-16 w-16 text-yellow-300 mx-auto mb-6" />
              <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
              <p className="text-gray-200">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default KeyFeatures;
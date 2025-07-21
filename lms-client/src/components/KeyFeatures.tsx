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
    <section className="py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-serif font-bold text-gray-800 mb-4">
            Why Choose LibraryHub?
          </h2>
          <div className="w-24 h-1 bg-gray-200 mx-auto mb-6"></div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Experience the future of reading with features designed to enhance your literary journey.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="bg-white p-8 rounded-lg shadow-md text-center 
                border-t-4 border-gray-200 hover:shadow-xl 
                transition-all duration-300 group"
            >
              <div className="mb-6 transform group-hover:-translate-y-1 transition-transform duration-300">
                <feature.icon className="h-16 w-16 text-gray-400 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default KeyFeatures;
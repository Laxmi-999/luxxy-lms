import { Button } from "@/components/ui/button";
import { ArrowDown } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 py-20 bg-gradient-to-br from-amber-50 via-orange-100 to-amber-200 overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23f97316\' fill-opacity=\'0.1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30v4h-4v2h4v4h2v-4h4v-2h-4v-4h-2zM6 34v4h4v-4h2v-4h-2v-4h-4v4h-2v4h2z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>

      <div className="relative z-10 text-center max-w-5xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-extrabold text-orange-900 mb-6 leading-tight tracking-tight">
          Discover Your
          <span className="block text-orange-600 drop-shadow-md">Digital Library</span>
        </h1>

        <p className="text-xl md:text-2xl text-orange-800/80 mb-10 max-w-3xl mx-auto leading-relaxed">
          Unleash your reading potential with LibraryHub's seamless platform. Explore thousands of books and manage your journey with ease.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <Button
            size="lg"
            className="bg-orange-600 hover:bg-orange-700 text-white font-semibold px-10 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Explore Books
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-orange-400 text-orange-700 hover:bg-orange-100/50 hover:text-orange-800 font-semibold px-10 py-6 text-lg rounded-full transition-all duration-300"
          >
            Learn More
          </Button>
        </div>

        <div className="animate-bounce">
          <ArrowDown className="h-10 w-10 text-orange-600 mx-auto drop-shadow" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
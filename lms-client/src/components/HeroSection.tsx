import { Button } from "@/components/ui/button";
import { ArrowDown, Book, Search } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 py-24 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\'80\' height=\'80\' viewBox=\'0 0 80 80\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.05\'%3E%3Cpath d=\'M40 10c-4.42 0-8 3.58-8 8s3.58 8 8 8 8-3.58 8-8-3.58-8-8-8zm0 40c-4.42 0-8 3.58-8 8s3.58 8 8 8 8-3.58 8-8-3.58-8-8-8zm-20-20c-4.42 0-8 3.58-8 8s3.58 8 8 8 8-3.58 8-8-3.58-8-8-8zm20 20c-4.42 0-8 3.58-8 8s3.58 8 8 8 8-3.58 8-8-3.58-8-8-8z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50 animate-pulse-slow"></div>

      <div className="relative z-10 text-center max-w-6xl mx-auto">
        <div className="flex items-center justify-center mb-6 animate-fade-in-down">
          <Book className="h-12 w-12 text-white animate-spin-slow mr-3" />
          <h1 className="text-6xl md:text-8xl font-extrabold text-white bg-gradient-to-r from-blue-200 to-blue-400 bg-clip-text text-transparent drop-shadow-lg mb-4 leading-tight tracking-wide animate-pulse-text">
            Welcome to LibraryHub
          </h1>
        </div>

        <p className="text-lg md:text-xl text-blue-100/90 mb-10 max-w-4xl mx-auto leading-relaxed font-medium drop-shadow animate-fade-in-up">
          Immerse yourself in a world of knowledge with our cutting-edge digital library. Explore an expansive collection of books, manage your reading journey effortlessly, and unlock a universe of stories and insights.
        </p>

        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12 animate-slide-in">
          <Button
            size="lg"
            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold px-12 py-6 text-xl rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 flex items-center animate-bounce-slow"
          >
            <Search className="h-6 w-6 mr-2 animate-spin" />
            Explore Now
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-blue-300 text-white hover:bg-blue-800/30 hover:border-blue-200 font-bold px-12 py-6 text-xl rounded-full transition-all duration-300 transform hover:scale-105 animate-bounce-slow"
          >
            Learn More
          </Button>
        </div>

        <div className="bg-white/10 p-6 rounded-xl shadow-lg backdrop-blur-md max-w-3xl mx-auto animate-zoom-in">
          <h2 className="text-2xl font-semibold text-blue-200 mb-4 animate-pulse-text">Quick Search</h2>
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Search by title or author..."
              className="w-full p-4 rounded-lg border border-blue-300/50 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white/20 text-white placeholder-blue-100 animate-fade-in"
            />
            <Button
              size="lg"
              className="bg-blue-400 hover:bg-blue-500 text-white font-semibold px-8 py-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 animate-bounce"
            >
              Search
            </Button>
          </div>
        </div>

        <div className="mt-12 animate-bounce-slow">
          <ArrowDown className="h-12 w-12 text-white drop-shadow-lg animate-pulse" />
        </div>
      </div>

      {/* Decorative Elements with Animations */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-blue-500/20 rounded-full blur-xl animate-float"></div>
      <div className="absolute bottom-10 right-10 w-40 h-40 bg-blue-400/20 rounded-full blur-xl animate-float delay-1000"></div>
    </section>
  );
};

// Animation Styles
const styles = `
  @keyframes fadeInDown {
    from {
      opacity: 0;
      transform: translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateX(-50px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @keyframes zoomIn {
    from {
      opacity: 0;
      transform: scale(0.5);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  @keyframes bounceSlow {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
  }

  @keyframes spinSlow {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  @keyframes pulseText {
    0%, 100% { text-shadow: 0 0 5px rgba(255, 255, 255, 0.3); }
    50% { text-shadow: 0 0 10px rgba(255, 255, 255, 0.6); }
  }

  @keyframes float {
    0% { transform: translateY(0) rotate(0deg); }
    50% { transform: translateY(-20px) rotate(5deg); }
    100% { transform: translateY(0) rotate(0deg); }
  }

  @keyframes pulseSlow {
    0%, 100% { opacity: 0.5; }
    50% { opacity: 1; }
  }

  .animate-fade-in-down {
    animation: fadeInDown 1s ease-out;
  }

  .animate-fade-in-up {
    animation: fadeInUp 1s ease-out;
  }

  .animate-slide-in {
    animation: slideIn 1s ease-out;
  }

  .animate-zoom-in {
    animation: zoomIn 1s ease-out;
  }

  .animate-bounce-slow {
    animation: bounceSlow 3s infinite;
  }

  .animate-spin-slow {
    animation: spinSlow 4s linear infinite;
  }

  .animate-pulse-text {
    animation: pulseText 2s infinite;
  }

  .animate-float {
    animation: float 6s infinite;
  }

  .animate-pulse-slow {
    animation: pulseSlow 4s infinite;
  }
`;

const styleSheet = document.createElement('style');
styleSheet.textContent = styles;
document.head.appendChild(styleSheet);

export default HeroSection;
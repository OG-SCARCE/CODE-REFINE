
import React, { useState, useEffect } from 'react';

interface HeroProps {
  onGetStarted: () => void;
}

const StarIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.007z" clipRule="evenodd" />
    </svg>
);

const AnimatedText: React.FC<{ text: string; className?: string; delay?: number }> = ({ text, className, delay = 0 }) => {
    const [visible, setVisible] = useState(false);
    useEffect(() => {
        const timer = setTimeout(() => setVisible(true), delay);
        return () => clearTimeout(timer);
    }, [delay]);

    return (
        <div className={`transition-all duration-1000 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
            } ${className}`}>
            {text}
        </div>
    );
};

const Hero: React.FC<HeroProps> = ({ onGetStarted }) => {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const baseDelay = 100;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 text-center">
      <div className={`transition-all duration-1000 ${isMounted ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`} style={{ transitionDelay: `${baseDelay}ms` }}>
        <div className="inline-flex items-center bg-gray-800/50 text-white text-sm font-medium px-4 py-1.5 rounded-full mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 mr-2 text-gray-400">
                <path d="M11.983 1.904a.75.75 0 00-1.292-.953l-4.25 5.063.953 1.292L11.983 1.904z" />
                <path d="M13.835 4.312a.75.75 0 00-1.06-1.06l-2.061 2.06c.26.26.52.52.78.78l2.34-1.78zM12.25 7.5a3.75 3.75 0 10-5.303 5.303 3.75 3.75 0 005.303-5.303zM7.5 12.25a3.75 3.75 0 105.303-5.303 3.75 3.75 0 00-5.303 5.303z" />
                <path d="M9.217 1.904a.75.75 0 00-1.292.953L12.175 8l.953-1.292L9.217 1.904z" />
                <path d="M7.165 4.312a.75.75 0 00-1.06 1.06l1.78 2.341a4.233 4.233 0 00.78-.78L7.165 4.312z" />
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-5.5-8a5.5 5.5 0 1111 0 5.5 5.5 0 01-11 0z" clipRule="evenodd" />
            </svg>
            Unleash the power of AI
        </div>
      </div>
      
      <h1 className="text-5xl md:text-8xl font-black tracking-tighter" >
        <AnimatedText text="CodeRefine-ONSLAUGHT" delay={baseDelay + 200} />
      </h1>

      <p className="max-w-3xl mx-auto mt-6 text-lg md:text-xl text-gray-300">
        <AnimatedText text="Deploy with confidence. Real-time intelligence transforms your codebase into an unstoppable force. Autonomous analysis, optimization, and refactoring at lightning speed." delay={baseDelay + 400} />
      </p>

      <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
        <button 
          onClick={onGetStarted}
          className={`bg-white text-black font-semibold py-3 px-6 rounded-lg flex items-center gap-2 transition-all duration-1000 hover:bg-gray-200 hover:scale-105 transform ${isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`} style={{ transitionDelay: `${baseDelay + 600}ms` }}>
            Get Started
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
              <path d="M10.891 2.262a1 1 0 00-1.782 0l-1.517 3.074-3.4  .494a1 1 0 00-.554 1.705l2.46 2.398-.58 3.385a1 1 0 001.451 1.054L10 12.892l3.039 1.597a1 1 0 001.451-1.054l-.58-3.385 2.46-2.398a1 1 0 00-.554-1.705l-3.4-.494-1.517-3.074z" />
            </svg>
        </button>
        <button className={`border border-gray-600 text-white font-semibold py-3 px-6 rounded-lg flex items-center gap-2 transition-all duration-1000 hover:bg-gray-800/50 hover:border-gray-400 transform ${isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`} style={{ transitionDelay: `${baseDelay + 700}ms` }}>
            Book Demo
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
              <path fillRule="evenodd" d="M2 10a.75.75 0 01.75-.75h12.59l-2.1-1.95a.75.75 0 111.02-1.1l3.5 3.25a.75.75 0 010 1.1l-3.5 3.25a.75.75 0 11-1.02-1.1l2.1-1.95H2.75A.75.75 0 012 10z" clipRule="evenodd" />
            </svg>
        </button>
      </div>

      <div className="absolute bottom-10 w-full px-4">
        <div className="max-w-5xl mx-auto flex items-center justify-center sm:justify-between text-gray-400">
            <div className={`hidden sm:block transition-opacity duration-1000 ${isMounted ? 'opacity-100' : 'opacity-0'}`} style={{ transitionDelay: `${baseDelay + 900}ms` }}>
                <div className="w-8 h-8 rounded-full border-2 border-gray-600 flex items-center justify-center font-black text-lg">
                    C
                </div>
            </div>
            <div className={`flex items-center gap-8 md:gap-16 transition-opacity duration-1000 ${isMounted ? 'opacity-100' : 'opacity-0'}`} style={{ transitionDelay: `${baseDelay + 1000}ms` }}>
                <div className="flex items-center gap-2">
                    <StarIcon className="w-4 h-4 text-gray-500" />
                    <span className="font-medium">Long-context</span>
                </div>
                <div className="flex items-center gap-2">
                    <StarIcon className="w-4 h-4 text-gray-500" />
                    <span className="font-medium">Autonomous</span>
                </div>
                <div className="flex items-center gap-2">
                    <StarIcon className="w-4 h-4 text-gray-500" />
                    <span className="font-medium">Powerful</span>
                </div>
            </div>
             <div className="hidden sm:block opacity-0"> {/* Placeholder to balance flex */}
                <div className="w-8 h-8"></div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;

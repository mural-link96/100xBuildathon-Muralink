import { Sparkles } from "lucide-react";
import { FadeInUp } from "../common/animations";

// Types
interface DesignStep {
    number: string;
    title: string;
    desc: string;
    image: string;
    color: string;
  }

// Data
const DESIGN_STEPS: DesignStep[] = [
    {
      number: "01",
      title: "Knowing you better",
      desc: "We decode your design DNA because design is personal to everyone",
      image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=600&h=400&fit=crop",
      color: "bg-gradient-to-br from-blue-500 to-blue-600"
    },
    {
      number: "02",
      title: "Instant Personalized designs",
      desc: "Receive 3D room design images with real products chosen just for you",
      image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=600&h=400&fit=crop",
      color: "bg-gradient-to-br from-orange-500 to-red-500"
    },
    {
      number: "03",
      title: "Shop & Transform",
      desc: "Purchase curated items and watch your space come to life",
      image: "https://images.unsplash.com/photo-1565538810643-b5bdb714032a?w=600&h=400&fit=crop",
      color: "bg-gradient-to-br from-purple-500 to-pink-500"
    }
  ];
  
  // Components
  interface StepProps {
    step: DesignStep;
  }

  const StepContent: React.FC<StepProps> = ({ step }) => (
    <div className="w-full sm:w-1/2 lg:w-1/2 text-center sm:text-left flex flex-col justify-center">
      <div className={`inline-flex items-center justify-center w-20 h-20 mb-6 ${step.color} rounded-2xl text-white font-bold text-2xl hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-xl`}>
        {step.number}
      </div>
      <h3 className="text-2xl md:text-3xl font-bold mb-6 text-gray-900 leading-tight">{step.title}</h3>
      <p className="text-gray-600 text-lg md:text-xl leading-relaxed">{step.desc}</p>
    </div>
  );
  
  
 const StepImage: React.FC<StepProps> = ({ step }) => (
    <div className="w-full sm:w-1/2 lg:w-1/2">
      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-pink-600 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
        <img
          src={step.image}
          alt={step.title}
          className="relative w-full h-64 sm:h-72 lg:h-80 object-cover rounded-xl shadow-2xl group-hover:shadow-3xl transition-all duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-x-4 group-hover:translate-x-0">
          <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
        </div>
      </div>
    </div>
  );
  

 export const HowItWorksSection: React.FC = () => {
    return (
      <section id="how-it-works" className="py-16 md:py-24 px-4 md:px-6 bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="max-w-7xl mx-auto">
          <FadeInUp>
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                How The Magic Happens
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Three simple steps to transform your space into something extraordinary
              </p>
            </div>
          </FadeInUp>
          
          <div className="space-y-20 md:space-y-24">
            {DESIGN_STEPS.map((step: DesignStep, index: number) => (
              <FadeInUp key={index} delay={index * 200}>
                <div className="bg-white rounded-3xl p-8 md:p-12 lg:p-16 shadow-xl hover:shadow-2xl transition-all duration-700 hover:-translate-y-3 border border-gray-100">
                  <div className={`flex flex-col gap-8 lg:gap-16 items-center ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}>
                    <StepImage step={step} />
                    <StepContent step={step} />
                  </div>
                </div>
              </FadeInUp>
            ))}
          </div>
        </div>
      </section>
    );
  };
  
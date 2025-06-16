import { Star } from "lucide-react";
import { FadeInUp } from "../common/animations";

export const TestimonialsSection: React.FC = () => {
    const testimonialStyles = [
        {
            bg: 'bg-gradient-to-br from-purple-100 to-purple-50',
            color: 'bg-gradient-to-br from-purple-500 to-purple-600',
            accent: 'from-purple-400 to-purple-600',
            message: 'This was very helpful, and helped me decide which side table to buy. I like the ideas presented a lot. Thanks'
        },
        {
            bg: 'bg-gradient-to-br from-teal-100 to-teal-50',
            color: 'bg-gradient-to-br from-teal-500 to-teal-600',
            accent: 'from-teal-400 to-teal-600',
            message: 'Bookshelf in the first visualization really fills the space nicely. Appreciate it. I might buy it'
        },
        {
            bg: 'bg-gradient-to-br from-orange-100 to-orange-50',
            color: 'bg-gradient-to-br from-orange-500 to-orange-600',
            accent: 'from-orange-400 to-orange-600',
            message: 'This is so incredibly helpful!! Thank you so much. The woman blinds on the windows suit the room decor'
        }
    ];

    return (
        <section id="testimonials" className="py-16 md:py-24 px-4 md:px-6 bg-gray-900 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full -translate-x-48 -translate-y-48"></div>
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-pink-500 to-red-600 rounded-full translate-x-48 translate-y-48"></div>
            </div>

            <div className="max-w-7xl mx-auto relative">
                <FadeInUp>
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
                            Love From Our Community
                        </h2>
                        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                            See what our delighted customers have to say about their transformations
                        </p>
                    </div>
                </FadeInUp>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {testimonialStyles.map((style, i: number) => (
                        <FadeInUp key={i} delay={i * 200}>
                            <div className={`${style.bg} rounded-3xl p-8 hover:shadow-2xl transition-all duration-700 hover:-translate-y-4 group relative overflow-hidden`}>
                                {/* Gradient Border Effect */}
                                <div className={`absolute inset-0 bg-gradient-to-r ${style.accent} opacity-0 group-hover:opacity-20 transition-opacity duration-500 rounded-3xl`}></div>

                                <div className="relative">
                                    <div className="flex mb-6">
                                        {[...Array(5)].map((_, starIndex: number) => (
                                            <Star key={starIndex} className="w-6 h-6 fill-yellow-400 text-yellow-400 group-hover:scale-110 transition-transform duration-300" style={{ transitionDelay: `${starIndex * 50}ms` }} />
                                        ))}
                                    </div>
                                    <p className="text-gray-700 mb-6 text-lg leading-relaxed">
                                        {style.message}
                                    </p>
                                    <div className="flex items-center space-x-4">
                                        <div className={`w-14 h-14 ${style.color} rounded-2xl group-hover:scale-110 transition-transform duration-300 shadow-lg`}></div>
                                        <div>
                                            <p className="font-semibold text-gray-900 text-lg">Reddit User</p>
                                            {/* <p className="text-gray-600">Verified Buyer</p> */}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </FadeInUp>
                    ))}
                </div>
            </div>
        </section>
    );
};
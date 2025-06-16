import { ChangeEvent, FormEvent, useState } from "react";
import Button from "../common/Button";
import { Check } from "lucide-react";
import { sendEmail } from "../../services/emailService";

type FormData = {
    name: string;
    email: string;
  };

export const PreLaunchSection: React.FC = () => {
    const [formData, setFormData] = useState<FormData>({ name: '', email: '' });
    const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
  
    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    };
  
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setIsLoading(true);
      try {
        await sendEmail({ ...formData, userType: 'prelaunch' });
        setIsSubmitted(true);
        setTimeout(() => {
          setIsSubmitted(false);
          setFormData({ name: '', email: '' });
        }, 3000);
      } catch (error) {
        console.error('Error sending email:', error);
        alert('Failed to send email. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
  
    return (
      <section className="py-20 px-6 bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16 text-gray-900">
            Be the first to be notified when we launch
          </h2>
  
          <div className="max-w-lg mx-auto">
            <div className="bg-white rounded-3xl p-8 shadow-xl">
              <h3 className="text-2xl font-bold mb-6 text-indigo-600 text-center">
                Pre-Launch Interest Form
              </h3>
  
              {!isSubmitted ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                      placeholder="Enter your full name"
                    />
                  </div>
  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                      placeholder="Enter your email address"
                    />
                  </div>
  
                  <Button
                    type="submit"
                    variant="secondary"
                    className="w-full"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Sending...' : 'Notify Me at Launch'}
                  </Button>
                </form>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check className="w-8 h-8 text-green-500" />
                  </div>
                  <h4 className="text-xl font-semibold text-gray-900 mb-2">Thank you!</h4>
                  <p className="text-gray-600">We'll notify you as soon as we launch.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    );
  };


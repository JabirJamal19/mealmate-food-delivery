import { useState } from 'react';
import { Search, ChevronDown, ChevronRight, MessageCircle, Phone, Mail, Clock } from 'lucide-react';

const HelpCenter = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const categories = [
    {
      title: 'Getting Started',
      icon: '🚀',
      articles: 12,
      description: 'Learn the basics of using MealMate',
    },
    {
      title: 'Orders & Payment',
      icon: '💳',
      articles: 18,
      description: 'Managing orders, payments, and receipts',
    },
    {
      title: 'Delivery & Tracking',
      icon: '🚚',
      articles: 15,
      description: 'Track your orders and delivery information',
    },
    {
      title: 'Account & Profile',
      icon: '👤',
      articles: 10,
      description: 'Account settings and profile management',
    },
    {
      title: 'Restaurant Partners',
      icon: '🍽️',
      articles: 8,
      description: 'Information for restaurant partners',
    },
    {
      title: 'Technical Issues',
      icon: '⚙️',
      articles: 14,
      description: 'Troubleshooting and technical support',
    },
  ];

  const popularArticles = [
    'How to place your first order',
    'Payment methods and billing',
    'Tracking your delivery',
    'Canceling or modifying orders',
    'Creating an account',
    'Delivery fees and pricing',
    'Contact customer support',
    'App not working properly',
  ];

  const faqs = [
    {
      question: 'How do I track my order?',
      answer: 'You can track your order in real-time through the MealMate app or website. Go to "My Orders" and select your active order to see the delivery progress, estimated arrival time, and driver location.',
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards (Visa, MasterCard, American Express), debit cards, PayPal, Apple Pay, Google Pay, and cash on delivery in select areas.',
    },
    {
      question: 'Can I cancel my order?',
      answer: 'You can cancel your order within 2 minutes of placing it for a full refund. After that, cancellation depends on the restaurant\'s preparation status. Contact customer support for assistance.',
    },
    {
      question: 'How are delivery fees calculated?',
      answer: 'Delivery fees are based on distance from the restaurant, demand, and time of day. You\'ll see the exact fee before confirming your order. We also offer free delivery promotions regularly.',
    },
    {
      question: 'What if my order is incorrect or missing items?',
      answer: 'If your order has missing or incorrect items, please report it through the app within 24 hours. We\'ll provide a refund or credit for the affected items and work to resolve the issue quickly.',
    },
    {
      question: 'How do I become a restaurant partner?',
      answer: 'Restaurant owners can apply to become partners through our website. Fill out the partnership application, and our team will review your restaurant and contact you within 3-5 business days.',
    },
    {
      question: 'Is there a minimum order amount?',
      answer: 'Minimum order amounts vary by restaurant and location. You\'ll see the minimum order requirement on each restaurant\'s page before placing your order.',
    },
    {
      question: 'How do I contact customer support?',
      answer: 'You can reach our customer support team through the app\'s help section, email us at support@fooddelivery.com, or call our 24/7 hotline at (555) 123-FOOD.',
    },
  ];

  const toggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  const contactOptions = [
    {
      icon: MessageCircle,
      title: 'Live Chat',
      description: 'Chat with our support team',
      availability: 'Available 24/7',
      action: 'Start Chat',
    },
    {
      icon: Phone,
      title: 'Phone Support',
      description: 'Call our customer service',
      availability: '24/7 Support',
      action: 'Call Now',
    },
    {
      icon: Mail,
      title: 'Email Support',
      description: 'Send us an email',
      availability: 'Response within 2 hours',
      action: 'Send Email',
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-primary text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">How can we help you?</h1>
            <p className="text-xl mb-8">
              Find answers to common questions or get in touch with our support team.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto relative">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search for help articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 text-gray-900 bg-white rounded-lg border-0 shadow-lg focus:ring-2 focus:ring-primary-300 focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Help Categories */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Browse Help Topics</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Choose a category to find relevant articles and guides.
            </p>
          </div>

          <div className="max-w-6xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer">
                <div className="text-4xl mb-4">{category.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{category.title}</h3>
                <p className="text-gray-600 mb-4">{category.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">{category.articles} articles</span>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Articles */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Popular Articles</h2>
              <p className="text-lg text-gray-600">
                Quick access to our most helpful articles and guides.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {popularArticles.map((article, index) => (
                <div key={index} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow cursor-pointer">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-900 font-medium">{article}</span>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
              <p className="text-lg text-gray-600">
                Find quick answers to the most common questions about our service.
              </p>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="bg-white border border-gray-200 rounded-lg">
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                  >
                    <span className="font-medium text-gray-900">{faq.question}</span>
                    {expandedFaq === index ? (
                      <ChevronDown className="h-5 w-5 text-gray-500" />
                    ) : (
                      <ChevronRight className="h-5 w-5 text-gray-500" />
                    )}
                  </button>
                  {expandedFaq === index && (
                    <div className="px-6 pb-4">
                      <p className="text-gray-600">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Support */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Still Need Help?</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our customer support team is here to help you with any questions or issues.
            </p>
          </div>

          <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-6">
            {contactOptions.map((option, index) => {
              const Icon = option.icon;
              return (
                <div key={index} className="bg-white border border-gray-200 rounded-lg p-6 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 text-primary-600 rounded-full mb-4">
                    <Icon className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{option.title}</h3>
                  <p className="text-gray-600 mb-2">{option.description}</p>
                  <div className="flex items-center justify-center text-sm text-gray-500 mb-4">
                    <Clock className="h-4 w-4 mr-1" />
                    {option.availability}
                  </div>
                  <button className="btn-primary btn-md w-full">
                    {option.action}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Additional Resources */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Additional Resources</h2>
            <p className="text-lg text-gray-600 mb-8">
              Explore more ways to get help and stay updated with MealMate.
            </p>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-primary-50 border border-primary-200 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Community Forum</h3>
                <p className="text-gray-600 mb-4">
                  Connect with other users, share tips, and get help from the community.
                </p>
                <button className="btn-primary btn-md">
                  Visit Forum
                </button>
              </div>
              
              <div className="bg-secondary-50 border border-secondary-200 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Video Tutorials</h3>
                <p className="text-gray-600 mb-4">
                  Watch step-by-step video guides on how to use our platform effectively.
                </p>
                <button className="btn-secondary btn-md">
                  Watch Videos
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HelpCenter;

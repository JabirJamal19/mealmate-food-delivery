import { Calendar, Shield, AlertTriangle, FileText } from 'lucide-react';

const TermsOfService = () => {
  const lastUpdated = 'October 15, 2024';

  const sections = [
    {
      id: 'acceptance',
      title: '1. Acceptance of Terms',
      content: `By accessing and using MealMate's services, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.`,
    },
    {
      id: 'description',
      title: '2. Service Description',
      content: `MealMate is an online platform that connects customers with local restaurants and food establishments. We facilitate food ordering and delivery services through our website and mobile application. We act as an intermediary between customers and restaurants.`,
    },
    {
      id: 'eligibility',
      title: '3. User Eligibility',
      content: `You must be at least 18 years old to use our services. By using our platform, you represent and warrant that you have the legal capacity to enter into this agreement. If you are under 18, you may use our services only with the involvement of a parent or guardian.`,
    },
    {
      id: 'account',
      title: '4. User Accounts',
      content: `To access certain features of our service, you may be required to create an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account.`,
    },
    {
      id: 'ordering',
      title: '5. Ordering and Payment',
      content: `When you place an order through our platform, you are making an offer to purchase food items from the restaurant. Orders are subject to acceptance by the restaurant. Payment is due at the time of order placement. We accept various payment methods as displayed on our platform.`,
    },
    {
      id: 'delivery',
      title: '6. Delivery Services',
      content: `Delivery times are estimates and may vary based on various factors including weather, traffic, and restaurant preparation time. We strive to deliver orders within the estimated timeframe but cannot guarantee exact delivery times. Delivery fees and minimum order requirements may apply.`,
    },
    {
      id: 'cancellation',
      title: '7. Cancellation and Refunds',
      content: `Orders may be cancelled within a limited time after placement, subject to restaurant policies. Refunds are processed according to our refund policy. We reserve the right to cancel orders in cases of suspected fraud, technical errors, or other circumstances beyond our control.`,
    },
    {
      id: 'user-conduct',
      title: '8. User Conduct',
      content: `You agree not to use our services for any unlawful purpose or in any way that could damage, disable, or impair our platform. You shall not attempt to gain unauthorized access to our systems or engage in any activity that interferes with the proper functioning of our services.`,
    },
    {
      id: 'intellectual-property',
      title: '9. Intellectual Property',
      content: `All content on our platform, including but not limited to text, graphics, logos, images, and software, is the property of MealMate or its licensors and is protected by copyright and other intellectual property laws. You may not reproduce, distribute, or create derivative works without our express written permission.`,
    },
    {
      id: 'privacy',
      title: '10. Privacy Policy',
      content: `Your privacy is important to us. Our Privacy Policy explains how we collect, use, and protect your information when you use our services. By using our platform, you consent to the collection and use of your information as described in our Privacy Policy.`,
    },
    {
      id: 'disclaimers',
      title: '11. Disclaimers',
      content: `Our services are provided "as is" without warranties of any kind. We do not warrant that our services will be uninterrupted, error-free, or completely secure. We disclaim all warranties, express or implied, including but not limited to merchantability and fitness for a particular purpose.`,
    },
    {
      id: 'limitation',
      title: '12. Limitation of Liability',
      content: `To the fullest extent permitted by law, MealMate shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or relating to your use of our services. Our total liability shall not exceed the amount paid by you for the specific service giving rise to the claim.`,
    },
    {
      id: 'indemnification',
      title: '13. Indemnification',
      content: `You agree to indemnify and hold harmless MealMate, its officers, directors, employees, and agents from any claims, damages, losses, or expenses arising out of your use of our services, your violation of these terms, or your violation of any rights of another party.`,
    },
    {
      id: 'termination',
      title: '14. Termination',
      content: `We may terminate or suspend your account and access to our services at any time, with or without notice, for any reason, including if we believe you have violated these terms. Upon termination, your right to use our services will cease immediately.`,
    },
    {
      id: 'governing-law',
      title: '15. Governing Law',
      content: `These terms shall be governed by and construed in accordance with the laws of the State of California, without regard to its conflict of law provisions. Any disputes arising under these terms shall be subject to the exclusive jurisdiction of the courts of California.`,
    },
    {
      id: 'changes',
      title: '16. Changes to Terms',
      content: `We reserve the right to modify these terms at any time. We will notify users of any material changes by posting the updated terms on our platform and updating the "Last Updated" date. Your continued use of our services after such changes constitutes acceptance of the new terms.`,
    },
    {
      id: 'contact',
      title: '17. Contact Information',
      content: `If you have any questions about these Terms of Service, please contact us at legal@mealmate.com or write to us at MealMate Legal Department, 123 Food Street, San Francisco, CA 94105.`,
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-primary text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white bg-opacity-20 rounded-full mb-6">
              <FileText className="h-8 w-8" />
            </div>
            <h1 className="text-5xl font-bold mb-6">Terms of Service</h1>
            <p className="text-xl leading-relaxed">
              Please read these terms carefully before using MealMate's services. 
              These terms govern your use of our platform and services.
            </p>
            <div className="flex items-center justify-center mt-8 text-white text-opacity-90">
              <Calendar className="h-5 w-5 mr-2" />
              <span>Last updated: {lastUpdated}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Important Notice */}
      <section className="py-12 bg-yellow-50 border-b border-yellow-200">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-6 w-6 text-yellow-600 mt-1" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-yellow-800 mb-2">Important Notice</h3>
                <p className="text-yellow-700">
                  By using MealMate's services, you agree to these terms. Please read them carefully. 
                  If you don't agree with any part of these terms, you should not use our services.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Table of Contents */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Table of Contents</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {sections.map((section, index) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className="block p-3 bg-white border border-gray-200 rounded-lg hover:shadow-sm transition-shadow"
                >
                  <span className="text-primary-600 hover:text-primary-700 font-medium">
                    {section.title}
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Terms Content */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="space-y-12">
              {sections.map((section, index) => (
                <div key={section.id} id={section.id} className="scroll-mt-20">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">{section.title}</h2>
                  <div className="prose prose-lg max-w-none">
                    <p className="text-gray-700 leading-relaxed">{section.content}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Additional Information */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-100 text-primary-600 rounded-lg mb-4">
                  <Shield className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Privacy Protected</h3>
                <p className="text-gray-600 text-sm">
                  Your personal information is protected according to our Privacy Policy.
                </p>
              </div>
              
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-100 text-primary-600 rounded-lg mb-4">
                  <FileText className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Clear Terms</h3>
                <p className="text-gray-600 text-sm">
                  We strive to make our terms clear and understandable for all users.
                </p>
              </div>
              
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-100 text-primary-600 rounded-lg mb-4">
                  <Calendar className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Regular Updates</h3>
                <p className="text-gray-600 text-sm">
                  We update our terms regularly to reflect changes in our services.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-primary-600 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Questions About Our Terms?</h2>
            <p className="text-xl mb-8 text-white text-opacity-90">
              If you have any questions about these Terms of Service, our legal team is here to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="btn-secondary btn-lg">
                Contact Legal Team
              </button>
              <button className="btn-outline btn-lg border-white text-white hover:bg-white hover:text-primary-600">
                View Privacy Policy
              </button>
            </div>
            <div className="mt-8 text-white text-opacity-75">
              <p>Email: legal@fooddelivery.com</p>
              <p>Address: 123 Food Street, San Francisco, CA 94105</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TermsOfService;

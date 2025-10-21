import { MapPin, Clock, Users, Briefcase, Heart, TrendingUp } from 'lucide-react';

const Careers = () => {
  const benefits = [
    {
      icon: Heart,
      title: 'Health & Wellness',
      description: 'Comprehensive health insurance, dental, vision, and wellness programs.',
    },
    {
      icon: TrendingUp,
      title: 'Career Growth',
      description: 'Professional development opportunities, mentorship, and clear career paths.',
    },
    {
      icon: Clock,
      title: 'Work-Life Balance',
      description: 'Flexible working hours, remote work options, and generous PTO.',
    },
    {
      icon: Users,
      title: 'Great Team',
      description: 'Work with passionate, talented people in a collaborative environment.',
    },
  ];

  const openings = [
    {
      title: 'Senior Software Engineer',
      department: 'Engineering',
      location: 'San Francisco, CA',
      type: 'Full-time',
      description: 'Join our engineering team to build scalable systems that power our food delivery platform.',
      requirements: ['5+ years of software development experience', 'Proficiency in React, Node.js, and TypeScript', 'Experience with cloud platforms (AWS/GCP)', 'Strong problem-solving skills'],
    },
    {
      title: 'Product Manager',
      department: 'Product',
      location: 'New York, NY',
      type: 'Full-time',
      description: 'Lead product strategy and development for our customer-facing applications.',
      requirements: ['3+ years of product management experience', 'Experience with mobile and web applications', 'Strong analytical and communication skills', 'Background in consumer technology'],
    },
    {
      title: 'UX/UI Designer',
      department: 'Design',
      location: 'Remote',
      type: 'Full-time',
      description: 'Create intuitive and beautiful user experiences for our customers and restaurant partners.',
      requirements: ['4+ years of UX/UI design experience', 'Proficiency in Figma and design systems', 'Portfolio demonstrating mobile-first design', 'Experience with user research and testing'],
    },
    {
      title: 'Marketing Specialist',
      department: 'Marketing',
      location: 'Los Angeles, CA',
      type: 'Full-time',
      description: 'Drive customer acquisition and engagement through creative marketing campaigns.',
      requirements: ['2+ years of digital marketing experience', 'Experience with social media and content marketing', 'Knowledge of analytics tools (Google Analytics, etc.)', 'Creative thinking and execution skills'],
    },
    {
      title: 'Operations Manager',
      department: 'Operations',
      location: 'Chicago, IL',
      type: 'Full-time',
      description: 'Optimize our delivery operations and manage relationships with restaurant partners.',
      requirements: ['3+ years of operations experience', 'Experience in logistics or food service', 'Strong project management skills', 'Data-driven decision making'],
    },
    {
      title: 'Customer Success Representative',
      department: 'Customer Support',
      location: 'Austin, TX',
      type: 'Full-time',
      description: 'Provide exceptional support to customers and help resolve their inquiries.',
      requirements: ['1+ years of customer service experience', 'Excellent communication skills', 'Problem-solving mindset', 'Experience with support tools and CRM systems'],
    },
  ];

  const values = [
    'Innovation and continuous learning',
    'Customer-first mindset',
    'Collaboration and teamwork',
    'Diversity and inclusion',
    'Transparency and integrity',
    'Making a positive impact',
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-primary text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">Join Our Team</h1>
            <p className="text-xl leading-relaxed">
              Help us revolutionize food delivery and make a meaningful impact on how people 
              connect with their favorite restaurants. We're looking for passionate individuals 
              who want to grow with us.
            </p>
          </div>
        </div>
      </section>

      {/* Why Work With Us */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Why Work With Us?</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We believe in creating an environment where everyone can thrive, grow, and make a difference.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <div key={index} className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 text-primary-600 rounded-full mb-6">
                    <Icon className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{benefit.title}</h3>
                  <p className="text-gray-600">{benefit.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Values</h2>
              <p className="text-lg text-gray-600">
                These values guide our decisions and shape our culture every day.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {values.map((value, index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-primary-600 rounded-full mr-3"></div>
                    <p className="text-gray-900 font-medium">{value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Open Positions</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Explore our current openings and find the perfect role to advance your career.
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-6">
            {openings.map((job, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{job.title}</h3>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Briefcase className="h-4 w-4 mr-1" />
                        {job.department}
                      </div>
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        {job.location}
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {job.type}
                      </div>
                    </div>
                  </div>
                  <button className="btn-primary btn-md mt-4 lg:mt-0 lg:ml-4">
                    Apply Now
                  </button>
                </div>
                
                <p className="text-gray-600 mb-4">{job.description}</p>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Requirements:</h4>
                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                    {job.requirements.map((req, reqIndex) => (
                      <li key={reqIndex}>{req}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Application Process */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Hiring Process</h2>
              <p className="text-lg text-gray-600">
                We've designed our process to be transparent and efficient while getting to know you better.
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-lg font-bold">
                  1
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Application</h3>
                <p className="text-gray-600 text-sm">Submit your application and resume through our careers page.</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-lg font-bold">
                  2
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Phone Screen</h3>
                <p className="text-gray-600 text-sm">Initial conversation with our recruiting team to learn more about you.</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-lg font-bold">
                  3
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Interviews</h3>
                <p className="text-gray-600 text-sm">Meet with team members and hiring managers to discuss the role.</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-lg font-bold">
                  4
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Offer</h3>
                <p className="text-gray-600 text-sm">Receive an offer and join our amazing team!</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Make an Impact?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Don't see a role that fits? We're always looking for talented individuals. 
            Send us your resume and tell us how you'd like to contribute.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="btn-secondary btn-lg">
              View All Openings
            </button>
            <button className="btn-outline btn-lg border-white text-white hover:bg-white hover:text-primary-600">
              Send General Application
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Careers;

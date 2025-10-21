import { Calendar, Download, ExternalLink, Award, TrendingUp, Users } from 'lucide-react';

const Press = () => {
  const pressReleases = [
    {
      date: '2024-10-15',
      title: 'MealMate Expands to 5 New Cities, Bringing Total Coverage to 25 Markets',
      excerpt: 'The company continues its rapid expansion with new operations in Austin, Denver, Portland, Nashville, and Charlotte.',
      category: 'Expansion',
      link: '#',
    },
    {
      date: '2024-09-22',
      title: 'MealMate Partners with Local Food Banks to Fight Hunger',
      excerpt: 'New initiative will donate meals to families in need while supporting local restaurants during slow periods.',
      category: 'Community',
      link: '#',
    },
    {
      date: '2024-08-10',
      title: 'MealMate Raises $50M Series B to Accelerate Growth and Technology Innovation',
      excerpt: 'Funding round led by top-tier VCs will fuel expansion and enhance AI-powered delivery optimization.',
      category: 'Funding',
      link: '#',
    },
    {
      date: '2024-07-18',
      title: 'MealMate Launches Sustainability Initiative with Carbon-Neutral Deliveries',
      excerpt: 'Company commits to offsetting 100% of delivery emissions through renewable energy and tree planting programs.',
      category: 'Sustainability',
      link: '#',
    },
    {
      date: '2024-06-05',
      title: 'MealMate Reaches 1 Million Orders Milestone',
      excerpt: 'Platform celebrates major milestone with special promotions for customers and restaurant partners.',
      category: 'Milestone',
      link: '#',
    },
  ];

  const mediaKit = [
    {
      title: 'Company Logo Pack',
      description: 'High-resolution logos in various formats (PNG, SVG, EPS)',
      size: '2.5 MB',
      type: 'ZIP',
    },
    {
      title: 'Brand Guidelines',
      description: 'Complete brand style guide and usage instructions',
      size: '8.1 MB',
      type: 'PDF',
    },
    {
      title: 'Product Screenshots',
      description: 'App and website screenshots for editorial use',
      size: '15.3 MB',
      type: 'ZIP',
    },
    {
      title: 'Executive Photos',
      description: 'High-resolution headshots of leadership team',
      size: '12.7 MB',
      type: 'ZIP',
    },
  ];

  const awards = [
    {
      year: '2024',
      title: 'Best Food Delivery App',
      organization: 'Tech Innovation Awards',
      description: 'Recognized for outstanding user experience and innovative features.',
    },
    {
      year: '2024',
      title: 'Fastest Growing Startup',
      organization: 'Business Excellence Awards',
      description: 'Honored for exceptional growth and market expansion.',
    },
    {
      year: '2023',
      title: 'Customer Choice Award',
      organization: 'Consumer Technology Awards',
      description: 'Voted by customers as the preferred food delivery platform.',
    },
    {
      year: '2023',
      title: 'Best Workplace Culture',
      organization: 'Great Places to Work',
      description: 'Recognized for creating an inclusive and innovative work environment.',
    },
  ];

  const stats = [
    { label: 'Active Users', value: '500K+', icon: Users },
    { label: 'Partner Restaurants', value: '2,500+', icon: Award },
    { label: 'Orders Delivered', value: '2M+', icon: TrendingUp },
    { label: 'Cities Served', value: '25+', icon: TrendingUp },
  ];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-primary text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">Press & Media</h1>
            <p className="text-xl leading-relaxed">
              Stay updated with the latest news, announcements, and milestones from MealMate. 
              Find press releases, media resources, and company information for journalists and media professionals.
            </p>
          </div>
        </div>
      </section>

      {/* Company Stats */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">MealMate by the Numbers</h2>
            <p className="text-gray-600">Key metrics that showcase our growth and impact</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 text-primary-600 rounded-full mb-4">
                    <Icon className="h-8 w-8" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                  <div className="text-gray-600">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Press Releases */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Latest Press Releases</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Get the latest updates on our company milestones, partnerships, and industry insights.
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-6">
            {pressReleases.map((release, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-3">
                      <div className="flex items-center text-gray-500 text-sm">
                        <Calendar className="h-4 w-4 mr-1" />
                        {formatDate(release.date)}
                      </div>
                      <span className="px-2 py-1 bg-primary-100 text-primary-700 text-xs font-medium rounded-full">
                        {release.category}
                      </span>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">{release.title}</h3>
                    <p className="text-gray-600 mb-4">{release.excerpt}</p>
                  </div>
                  <div className="flex gap-2 mt-4 lg:mt-0 lg:ml-6">
                    <button className="btn-outline btn-sm flex items-center">
                      <ExternalLink className="h-4 w-4 mr-1" />
                      Read More
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <button className="btn-primary btn-lg">View All Press Releases</button>
          </div>
        </div>
      </section>

      {/* Media Kit */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Media Kit</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Download our media resources including logos, brand guidelines, and high-resolution images.
            </p>
          </div>

          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6">
            {mediaKit.map((item, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                    <p className="text-gray-600 mb-4">{item.description}</p>
                    <div className="flex items-center text-sm text-gray-500">
                      <span className="mr-4">Size: {item.size}</span>
                      <span>Format: {item.type}</span>
                    </div>
                  </div>
                  <button className="btn-outline btn-sm flex items-center ml-4">
                    <Download className="h-4 w-4 mr-1" />
                    Download
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Awards & Recognition */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Awards & Recognition</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We're honored to be recognized by industry leaders and organizations for our innovation and excellence.
            </p>
          </div>

          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
            {awards.map((award, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-16 h-16 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mr-4">
                    <Award className="h-8 w-8" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm text-primary-600 font-medium mb-1">{award.year}</div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{award.title}</h3>
                    <p className="text-gray-600 text-sm mb-2">{award.organization}</p>
                    <p className="text-gray-600">{award.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Media Contact */}
      <section className="py-20 bg-primary-600 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-6">Media Inquiries</h2>
            <p className="text-xl mb-8">
              For press inquiries, interview requests, or additional information, please contact our media team.
            </p>
            <div className="bg-white bg-opacity-10 rounded-lg p-8 max-w-2xl mx-auto">
              <div className="grid md:grid-cols-2 gap-6 text-left">
                <div>
                  <h3 className="font-semibold mb-2">Press Contact</h3>
                  <p className="mb-1">Sarah Mitchell</p>
                  <p className="mb-1">Director of Communications</p>
                  <p className="mb-1">press@fooddelivery.com</p>
                  <p>(555) 123-4567</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Business Inquiries</h3>
                  <p className="mb-1">Michael Chen</p>
                  <p className="mb-1">Head of Business Development</p>
                  <p className="mb-1">business@fooddelivery.com</p>
                  <p>(555) 987-6543</p>
                </div>
              </div>
            </div>
            <div className="mt-8">
              <button className="btn-secondary btn-lg mr-4">
                Contact Press Team
              </button>
              <button className="btn-outline btn-lg border-white text-white hover:bg-white hover:text-primary-600">
                Schedule Interview
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Press;

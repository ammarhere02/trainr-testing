import React, { useState } from 'react';
import { Check, Star, Zap, Crown, Rocket, ArrowRight, BookOpen, TrendingUp } from 'lucide-react';

export default function Pricing() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');

  const packages = [
    {
      name: 'Plan 1 (Basic)',
      description: 'Get the foundations right to set up your business.',
      monthlyPrice: 39.99,
      annualPrice: 29.99,
      originalMonthlyPrice: null,
      originalAnnualPrice: null,
      icon: BookOpen,
      color: 'blue',
      buttonStyle: 'black',
      popular: false,
      features: [
        '1 Website',
        '1 Product + 1 Community',
        '10,000 Contacts',
        '7,500 Marketing Emails',
        'Unlimited Landing Pages',
        'Group Onboarding Call',
        'Trainr URL',
        'Creator Studio'
      ]
    },
    {
      name: 'Plan 2 (Growth)',
      description: 'Everything you need to start your business.',
      monthlyPrice: 99,
      annualPrice: 79,
      originalMonthlyPrice: null,
      originalAnnualPrice: null,
      icon: TrendingUp,
      color: 'purple',
      buttonStyle: 'black',
      popular: true,
      features: [
        '1 Website',
        '3 Products',
        'Unlimited Contacts',
        'Unlimited Marketing Emails',
        'Unlimited Landing Pages',
        'Group Onboarding Call',
        'Creator Studio',
        'Custom URL',
        'Affiliate Programs',
        'Custom Domain',
        'Custom Branding'
      ]
    }
  ];

  const getPrice = (pkg: any) => {
    return billingCycle === 'annual' ? pkg.annualPrice : pkg.monthlyPrice;
  };

  const getOriginalPrice = (pkg: any) => {
    return billingCycle === 'annual' ? pkg.originalAnnualPrice : pkg.originalMonthlyPrice;
  };

  return (
    <div className="bg-gradient-to-br from-gray-50 via-white to-purple-50 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Choose Your Plan
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Start your journey with the perfect plan for your business needs. 
            All plans include our core features to help you succeed.
          </p>

          {/* Billing Toggle */}
          <div className="inline-flex items-center bg-gray-100 rounded-xl p-1">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-6 py-3 rounded-lg text-sm font-medium transition-all ${
                billingCycle === 'monthly'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('annual')}
              className={`px-6 py-3 rounded-lg text-sm font-medium transition-all relative ${
                billingCycle === 'annual'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Annual
              <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                Save 30%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {packages.map((pkg, index) => {
            const IconComponent = pkg.icon;
            const price = getPrice(pkg);
            const originalPrice = getOriginalPrice(pkg);
            
            return (
              <div
                key={index}
                className={`relative rounded-2xl border-2 transition-all duration-300 hover:shadow-xl ${
                  pkg.popular
                    ? 'border-purple-300 bg-gradient-to-br from-purple-50 to-pink-50 shadow-lg'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                {/* Popular Badge */}
                {pkg.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-full text-sm font-medium shadow-lg">
                      Most Popular
                    </div>
                  </div>
                )}

                <div className="p-8">
                  {/* Header */}
                  <div className="text-center mb-8">
                    <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 ${
                      pkg.color === 'blue' ? 'bg-blue-500' :
                      pkg.color === 'purple' ? 'bg-purple-500' :
                      pkg.popular ? 'bg-gradient-to-r from-purple-600 to-pink-600' : 'bg-gray-100'
                    }`}>
                      <IconComponent className={`w-8 h-8 ${
                        pkg.color === 'blue' ? 'text-white' :
                        pkg.color === 'purple' ? 'text-white' :
                        pkg.popular ? 'text-white' : 'text-gray-600'
                      }`} />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{pkg.name}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{pkg.description}</p>
                  </div>

                  {/* Pricing */}
                  <div className="text-center mb-8">
                    <div className="flex items-baseline justify-center mb-2">
                      <span className="text-5xl font-bold text-gray-900">${price}</span>
                      <span className="text-gray-600 ml-2">/mo*</span>
                    </div>
                    <div className="text-sm text-gray-600">
                      Billed {billingCycle}
                      {billingCycle === 'annual' && originalPrice && (
                        <div className="mt-1">
                          <span className="line-through text-gray-400">${originalPrice}/mo</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* CTA Button */}
                  <div className="mb-8">
                    {pkg.buttonStyle === 'gradient' ? (
                      <button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 px-6 rounded-xl font-semibold hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center">
                        Get Started for Free
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </button>
                    ) : (
                      <button className="w-full bg-gray-900 text-white py-4 px-6 rounded-xl font-semibold hover:bg-gray-800 transition-colors flex items-center justify-center">
                        Get Started for Free
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </button>
                    )}
                  </div>

                  {/* Features */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-4">Standout Features:</h4>
                    <ul className="space-y-3">
                      {pkg.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-start">
                          <div className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5 mr-3 ${
                            pkg.popular ? 'bg-purple-100' : 'bg-gray-100'
                          }`}>
                            <Check className={`w-3 h-3 ${
                              pkg.popular ? 'text-purple-600' : 'text-gray-600'
                            }`} />
                          </div>
                          <span className="text-gray-700 text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <p className="text-gray-600 mb-6">
            All plans include a 14-day free trial. No credit card required.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button className="text-purple-600 hover:text-purple-700 font-medium">
              Compare all features →
            </button>
            <span className="text-gray-400">•</span>
            <button className="text-purple-600 hover:text-purple-700 font-medium">
              Talk to sales
            </button>
            <span className="text-gray-400">•</span>
            <button className="text-purple-600 hover:text-purple-700 font-medium">
              View FAQ
            </button>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="mt-16 pt-16 border-t border-gray-200">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-gray-900 mb-2">10,000+</div>
              <div className="text-gray-600">Active Creators</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-900 mb-2">$50M+</div>
              <div className="text-gray-600">Revenue Generated</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-900 mb-2">99.9%</div>
              <div className="text-gray-600">Uptime Guarantee</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
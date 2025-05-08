
import { useState } from 'react';
import Layout from '../components/Layout';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from 'lucide-react';

const Plans = () => {
  const [isAnnual, setIsAnnual] = useState(false);
  
  // Plans data
  const plans = [
    {
      name: 'Free',
      description: 'For casual worldbuilders',
      monthlyPrice: 0,
      annualPrice: 0,
      features: [
        '3 Worlds',
        '25 Entities per World',
        'Basic Character Creation',
        'Export as PDF',
      ],
      buttonText: 'Current Plan',
      buttonVariant: 'outline',
      isCurrentPlan: true,
    },
    {
      name: 'Pro',
      description: 'For serious worldbuilders',
      monthlyPrice: 9.99,
      annualPrice: 99.99,
      features: [
        'Unlimited Worlds',
        'Unlimited Entities',
        'Advanced Character Creation',
        'Export as PDF and Images',
        'Timeline Creation',
        'Custom Maps (Coming Soon)',
        'Priority Support',
      ],
      buttonText: 'Upgrade to Pro',
      buttonVariant: 'default',
      isCurrentPlan: false,
      popular: true,
    }
  ];
  
  const handlePlanSelect = (planName: string) => {
    // This will be integrated with Stripe checkout in the future
    if (planName === 'Pro') {
      alert('This will redirect to Stripe checkout in the full implementation');
    }
  };
  
  return (
    <Layout>
      <div className="py-12 max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-3">Choose Your Plan</h1>
        <p className="text-center text-muted-foreground mb-8">
          Unlock the full potential of FateEngine with our Pro subscription.
        </p>
        
        {/* Billing Toggle */}
        <div className="flex justify-center items-center mb-10">
          <span className={`mr-2 ${isAnnual ? 'text-muted-foreground' : ''}`}>Monthly</span>
          <div 
            className="w-12 h-6 flex items-center bg-muted rounded-full p-1 cursor-pointer" 
            onClick={() => setIsAnnual(!isAnnual)}
          >
            <div
              className={`bg-primary h-4 w-4 rounded-full shadow-md transform transition-transform duration-300 ${
                isAnnual ? 'translate-x-6' : ''
              }`}
            />
          </div>
          <span className={`ml-2 ${!isAnnual ? 'text-muted-foreground' : ''}`}>
            Annual <span className="text-primary text-sm font-medium ml-1">Save 20%</span>
          </span>
        </div>
        
        {/* Plan Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {plans.map(plan => (
            <Card 
              key={plan.name} 
              className={`bg-card border ${
                plan.popular ? 'border-primary' : ''
              } relative overflow-hidden`}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-3 py-1 text-xs font-semibold">
                  POPULAR
                </div>
              )}
              
              <CardHeader>
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">
                    ${isAnnual ? plan.annualPrice : plan.monthlyPrice}
                  </span>
                  {plan.monthlyPrice > 0 && (
                    <span className="text-muted-foreground ml-2">
                      /{isAnnual ? 'year' : 'month'}
                    </span>
                  )}
                </div>
              </CardHeader>
              
              <CardContent>
                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <Check size={20} className="text-primary shrink-0 mr-2" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              
              <CardFooter>
                <Button
                  className="w-full"
                  variant={plan.buttonVariant as any}
                  onClick={() => handlePlanSelect(plan.name)}
                  disabled={plan.isCurrentPlan}
                >
                  {plan.buttonText}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        
        {/* FAQ Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-2">Can I cancel my subscription anytime?</h3>
              <p className="text-muted-foreground">
                Yes, you can cancel your subscription at any time. If you cancel, your Pro features will remain active until the end of your billing period.
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-2">What payment methods are accepted?</h3>
              <p className="text-muted-foreground">
                We accept all major credit cards, as well as PayPal.
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-2">Will my data be lost if I downgrade?</h3>
              <p className="text-muted-foreground">
                No, your data won't be deleted. However, if you exceed the Free plan limits, you won't be able to create new worlds or entities until you're within the limits.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Plans;

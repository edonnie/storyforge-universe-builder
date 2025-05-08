
import Layout from '../components/Layout';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, MessageSquare } from 'lucide-react';

const Support = () => {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto py-12">
        <h1 className="text-3xl font-bold text-center mb-12">Support</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="bg-card">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Mail className="mr-2" />
                Email Support
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                For general inquiries, bug reports, or account issues, please contact us via email.
              </p>
              <p className="font-medium text-lg">support@fateengine.com</p>
              <p className="text-sm text-muted-foreground">
                We typically respond within 24 hours on weekdays.
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-card">
            <CardHeader>
              <CardTitle className="flex items-center">
                <MessageSquare className="mr-2" />
                Live Chat (Pro Only)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Pro subscribers have access to our live chat support during business hours.
              </p>
              <Button className="w-full">
                Upgrade to Pro
              </Button>
              <p className="text-sm text-muted-foreground">
                Available Monday-Friday, 9am-5pm EST.
              </p>
            </CardContent>
          </Card>
        </div>
        
        <Card className="mt-8 bg-card">
          <CardHeader>
            <CardTitle>Frequently Asked Questions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-2">How do I export my worlds?</h3>
              <p className="text-muted-foreground">
                You can export your worlds and entities as PDFs or images from the dashboard. Look for the export options in the right sidebar.
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-2">How do I cancel my subscription?</h3>
              <p className="text-muted-foreground">
                You can cancel your subscription at any time from your account settings page.
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-2">Are there limits to how many worlds I can create?</h3>
              <p className="text-muted-foreground">
                Free users can create up to 3 worlds with 25 entities per world. Pro subscribers have unlimited worlds and entities.
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-2">Can I collaborate with others?</h3>
              <p className="text-muted-foreground">
                Collaboration features are coming soon! Stay tuned for updates.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Support;

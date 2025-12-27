import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Shield,
  FileText,
  Clock,
  BarChart3,
  Map,
  RefreshCw,
  CheckCircle,
  ArrowRight,
  Users,
  Zap,
} from 'lucide-react';

const features = [
  {
    icon: FileText,
    title: 'Easy Complaint Submission',
    description: 'Submit civic issues with photos, location, and category selection in seconds.',
  },
  {
    icon: Clock,
    title: 'Visual SLA Tracking',
    description: '24-hour SLA countdown with color-coded status indicators.',
  },
  {
    icon: RefreshCw,
    title: 'Re-Open Flow',
    description: 'Citizens can re-open unresolved complaints with new evidence.',
  },
  {
    icon: Map,
    title: 'Interactive Map View',
    description: 'Visualize all complaints on an interactive map with filters.',
  },
  {
    icon: BarChart3,
    title: 'Public Dashboard',
    description: 'Ward-wise accountability dashboard with performance metrics.',
  },
  {
    icon: Users,
    title: 'Role-Based Access',
    description: 'Separate views for citizens, ward officers, and administrators.',
  },
];

const stats = [
  { value: '6', label: 'Demo Complaints' },
  { value: '5', label: 'Wards Covered' },
  { value: '24h', label: 'SLA Target' },
  { value: '3', label: 'User Roles' },
];

export default function Index() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden gradient-hero">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,hsl(var(--accent)/0.1),transparent_50%)]" />
        <div className="container mx-auto px-4 py-16 lg:py-24">
          <div className="max-w-4xl mx-auto text-center relative">
            {/* Badge removed */}
            
            <h1 className="text-4xl lg:text-6xl font-bold text-foreground mb-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
              Smart Civic Issue
              <span className="block text-accent">Reporting System</span>
            </h1>
            
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: '0.2s' }}>
              A modern platform for citizens to report and track civic issues with visual SLA tracking, 
              re-open workflows, and ward-wise public accountability dashboards.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <Link to="/login">
                <Button size="lg" className="gap-2 gradient-primary text-primary-foreground">
                  Get Started
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/ward-stats">
                <Button size="lg" variant="outline" className="gap-2">
                  <BarChart3 className="h-4 w-4" />
                  View Public Dashboard
                </Button>
              </Link>
            </div>

            {/* Logo */}
            <div className="mt-12 flex items-center justify-center gap-3 animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <div className="flex h-14 w-14 items-center justify-center rounded-xl gradient-primary shadow-lg">
                <Shield className="h-7 w-7 text-primary-foreground" />
              </div>
              <div className="text-left">
                <h2 className="text-xl font-bold text-foreground">CivicReport</h2>
                <p className="text-xs text-muted-foreground">Smart City Solutions</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <p className="text-3xl lg:text-4xl font-bold text-accent">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Key Features</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Built for hackathon demonstration, showcasing modern civic tech capabilities
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="group hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10 text-accent mb-4 group-hover:bg-accent group-hover:text-accent-foreground transition-colors">
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Demo Credentials section removed per user request */}

      {/* CTA Section */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <Card className="overflow-hidden">
            <div className="gradient-primary p-8 lg:p-12 text-center">
              <h2 className="text-2xl lg:text-3xl font-bold text-primary-foreground mb-4">
                Ready to Explore?
              </h2>
              <p className="text-primary-foreground/80 mb-6 max-w-xl mx-auto">
                Sign in to experience the full demo with complaint submission, 
                status tracking, and ward-wise analytics.
              </p>
              <Link to="/login">
                <Button size="lg" variant="secondary" className="gap-2">
                  Login to Demo
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-primary">
                <Shield className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-semibold text-foreground">CivicReport</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 CivicReport
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

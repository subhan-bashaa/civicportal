import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/lib/authContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, AlertCircle, User, Users, UserCog } from 'lucide-react';
import { cn } from '@/lib/utils';

const demoCredentials = [
  { email: 'citizen@demo.com', password: 'demo123', role: 'Citizen', icon: User, description: 'Submit & track complaints' },
  { email: 'officer@demo.com', password: 'demo123', role: 'Ward Officer', icon: Users, description: 'Manage ward complaints' },
  { email: 'admin@demo.com', password: 'demo123', role: 'Admin', icon: UserCog, description: 'Full system access' },
];

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const result = await login(email, password);
    
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error || 'Login failed');
    }
    
    setIsLoading(false);
  };

  const handleQuickLogin = async (cred: typeof demoCredentials[0]) => {
    setEmail(cred.email);
    setPassword(cred.password);
    setError('');
    setIsLoading(true);

    const result = await login(cred.email, cred.password);
    
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error || 'Login failed');
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen gradient-hero flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative animated blobs behind the card */}
      <div className="login-blobs">
        <div className="login-blob b1" />
        <div className="login-blob b2" />
        <div className="login-blob b3" />
      </div>

      <div className="w-full max-w-md animate-fade-in relative z-10">
        {/* Logo */}
          <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl shadow-lg transform-gpu animate-bounce-slow" style={{ background: 'linear-gradient(135deg,#0ea5a4,#06b6d4)' }}>
              <Shield className="h-6 w-6 text-white" />
            </div>
            </Link>
          <h1 className="mt-4 text-2xl login-h1 text-foreground">Welcome Back</h1>
          <p className="mt-1 text-muted-foreground">Sign in to CivicReport</p>
        </div>
        <Card className="shadow-2xl border-border/30 backdrop-blur-md text-foreground bg-white" style={{ borderColor: 'rgba(2,6,23,0.06)' }}>
          <CardHeader>
            <CardTitle className="text-lg text-foreground font-semibold">Sign In</CardTitle>
            <CardDescription className="text-muted-foreground">
              Enter your credentials or use a demo account
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Demo Quick Login Buttons */}
            <div className="mb-6">
                <p className="text-xs text-muted-foreground mb-3 font-semibold">Quick Demo Login:</p>
              <div className="grid gap-2">
                  {demoCredentials.map((cred) => (
                  <button
                    key={cred.email}
                    type="button"
                    onClick={() => handleQuickLogin(cred)}
                    disabled={isLoading}
                    className={cn(
                      "justify-start h-auto py-2.5 rounded-lg text-left w-full px-3 flex items-center gap-3 transition-transform transform hover:-translate-y-0.5 text-white"
                    )}
                    style={{
                      background: cred.role === 'Citizen'
                        ? 'linear-gradient(90deg,#0ea5a4,#06b6d4)'
                        : cred.role === 'Ward Officer'
                        ? 'linear-gradient(90deg,#00ffd5,#06b6d4)'
                        : 'linear-gradient(90deg,#06b6d4,#00ffd5)'
                    }}
                  >
                    <cred.icon className="h-4 w-4 mr-2 opacity-90" />
                    <div>
                      <p className="font-medium text-sm text-foreground">{cred.role}</p>
                      <p className="text-xs text-muted-foreground">{cred.description}</p>
                    </div>
                  </button>
                 ))}
              </div>
            </div>

            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-muted-foreground">Or continue with email</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="flex items-center gap-2 p-3 text-sm text-destructive bg-destructive/10 rounded-lg">
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-muted-foreground">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-muted-foreground">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full text-white shadow-md hover:shadow-lg"
                style={{ background: 'linear-gradient(90deg,#0ea5a4,#06b6d4)' }}
                disabled={isLoading}
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>

            <p className="mt-4 text-center text-xs text-muted-foreground">
              Demo password for all accounts: <code className="bg-gray-100 px-1 py-0.5 rounded text-foreground">demo123</code>
            </p>
          </CardContent>
        </Card>

        <p className="mt-6 text-center text-sm text-white/80">
          <Link to="/ward-stats" className="text-accent hover:underline">
            View Public Ward Dashboard →
          </Link>
        </p>
      </div>
    </div>
  );
}

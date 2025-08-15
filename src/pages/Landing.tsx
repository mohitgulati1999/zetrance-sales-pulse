import { GradientButton } from '@/components/ui/gradient-button';
import { Card, CardContent } from '@/components/ui/card';
import { UserPlus, LogIn, BarChart3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary p-4">
      <div className="container mx-auto max-w-md">
        {/* Header */}
        <div className="text-center mb-12 pt-8">
          <div className="flex items-center justify-center mb-4">
            <BarChart3 className="h-12 w-12 text-primary mr-3" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Zetrance Sales AI
            </h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Intelligent Sales Analytics Platform
          </p>
        </div>

        {/* Main Actions */}
        <Card className="mb-8 shadow-lg">
          <CardContent className="p-8 space-y-6">
            <GradientButton
              size="lg"
              className="w-full h-16 text-lg"
              onClick={() => navigate('/create-user')}
            >
              <UserPlus className="mr-3 h-6 w-6" />
              Create User
            </GradientButton>

            <GradientButton
              size="lg"
              gradient="accent"
              className="w-full h-16 text-lg"
              onClick={() => navigate('/login')}
            >
              <LogIn className="mr-3 h-6 w-6" />
              Login
            </GradientButton>
          </CardContent>
        </Card>

        {/* Features */}
        <div className="grid gap-4">
          <Card className="p-4">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <BarChart3 className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Real-time Analytics</h3>
                <p className="text-sm text-muted-foreground">Track sales performance instantly</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
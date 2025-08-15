import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { GradientButton } from '@/components/ui/gradient-button';
import { MetricCard } from '@/components/ui/metric-card';
import { SalesRecording } from '@/components/SalesRecording';
import { 
  Mic, 
  TrendingUp, 
  FileText, 
  ArrowLeft,
  Target,
  Phone,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { storage } from '@/utils/storage';
import { api } from '@/utils/api';
import { Analytics } from '@/types/user';
import { useToast } from '@/hooks/use-toast';

type ViewMode = 'dashboard' | 'record-sales' | 'analytics' | 'reports';

export default function SalesmanDashboard() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentView, setCurrentView] = useState<ViewMode>('dashboard');
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(false);

  const user = storage.getUser();

  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }
  }, [user, navigate]);

  const loadAnalytics = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const data = await api.getUserAnalytics(user.id);
      setAnalytics(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load analytics data.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    storage.removeUser();
    navigate('/');
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary p-4">
      <div className="container mx-auto max-w-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 pt-4">
          {currentView !== 'dashboard' ? (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCurrentView('dashboard')}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          ) : (
            <div />
          )}
          
          <h1 className="text-xl font-bold">
            {currentView === 'dashboard' && `Welcome, ${user.name}`}
            {currentView === 'record-sales' && 'Record Sales'}
            {currentView === 'analytics' && 'My Analytics'}
            {currentView === 'reports' && 'Performance Reports'}
          </h1>
          
          <Button variant="outline" size="sm" onClick={handleLogout}>
            Logout
          </Button>
        </div>

        {/* Dashboard View */}
        {currentView === 'dashboard' && (
          <div className="space-y-6">
            <Card className="p-6">
              <div className="text-center mb-4">
                <h2 className="text-lg font-semibold text-muted-foreground">
                  Salesman Dashboard
                </h2>
                <p className="text-sm text-muted-foreground">
                  {user.storeName && `Store: ${user.storeName}`}
                </p>
              </div>
              
              <div className="space-y-3">
                <GradientButton
                  className="w-full h-14"
                  onClick={() => setCurrentView('record-sales')}
                >
                  <Mic className="mr-3 h-5 w-5" />
                  Record Sales
                </GradientButton>

                <GradientButton
                  gradient="accent"
                  className="w-full h-14"
                  onClick={() => {
                    setCurrentView('analytics');
                    loadAnalytics();
                  }}
                >
                  <TrendingUp className="mr-3 h-5 w-5" />
                  My Analytics
                </GradientButton>

                <GradientButton
                  gradient="secondary"
                  className="w-full h-14 text-foreground"
                  onClick={() => setCurrentView('reports')}
                >
                  <FileText className="mr-3 h-5 w-5" />
                  Performance Reports
                </GradientButton>
              </div>
            </Card>
          </div>
        )}

        {/* Record Sales View */}
        {currentView === 'record-sales' && (
          <SalesRecording onComplete={() => setCurrentView('dashboard')} />
        )}

        {/* Analytics View */}
        {currentView === 'analytics' && (
          <div className="space-y-6">
            {loading ? (
              <Card className="p-8 text-center">
                <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4" />
                <p>Loading analytics...</p>
              </Card>
            ) : analytics ? (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <MetricCard
                    title="Total Sales"
                    value={analytics.totalSales}
                    icon={Target}
                  />
                  <MetricCard
                    title="Conversions"
                    value={analytics.conversions}
                    icon={CheckCircle}
                    changeType="positive"
                  />
                  <MetricCard
                    title="Lost Sales"
                    value={analytics.lostSales}
                    icon={XCircle}
                    changeType="negative"
                  />
                  <MetricCard
                    title="Conversion Rate"
                    value={`${analytics.conversionRate}%`}
                    icon={TrendingUp}
                  />
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Performance Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between">
                      <span>Daily Performance</span>
                      <span className="font-semibold">{analytics.performance.daily}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Weekly Performance</span>
                      <span className="font-semibold">{analytics.performance.weekly}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Monthly Performance</span>
                      <span className="font-semibold">{analytics.performance.monthly}</span>
                    </div>
                  </CardContent>
                </Card>

                {analytics.commonObjections.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Common Objections</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {analytics.commonObjections.map((objection, index) => (
                          <li key={index} className="text-sm border-l-2 border-primary pl-3">
                            {objection}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}
              </>
            ) : (
              <Card className="p-8 text-center">
                <p className="text-muted-foreground">No analytics data available yet.</p>
                <Button 
                  onClick={() => setCurrentView('record-sales')}
                  className="mt-4"
                >
                  Record Your First Sale
                </Button>
              </Card>
            )}
          </div>
        )}

        {/* Reports View */}
        {currentView === 'reports' && (
          <Card>
            <CardHeader>
              <CardTitle>Performance Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-semibold text-sm">Daily</h3>
                    <p className="text-2xl font-bold text-primary">
                      {analytics?.performance.daily || 0}
                    </p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-semibold text-sm">Weekly</h3>
                    <p className="text-2xl font-bold text-accent">
                      {analytics?.performance.weekly || 0}
                    </p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-semibold text-sm">Monthly</h3>
                    <p className="text-2xl font-bold text-success">
                      {analytics?.performance.monthly || 0}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MetricCard } from '@/components/ui/metric-card';
import { 
  Users, 
  TrendingUp, 
  Target,
  AlertTriangle,
  CheckCircle,
  XCircle,
  BarChart3
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { storage } from '@/utils/storage';
import { api } from '@/utils/api';
import { useToast } from '@/hooks/use-toast';

export default function StoreManagerDashboard() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const user = storage.getUser();

  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }
    loadStoreAnalytics();
  }, [user, navigate]);

  const loadStoreAnalytics = async () => {
    if (!user?.storeName) return;
    
    setLoading(true);
    try {
      const data = await api.getStoreAnalytics(user.storeName);
      setAnalytics(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load store analytics.",
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
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 pt-4">
          <div>
            <h1 className="text-2xl font-bold">Store Manager Dashboard</h1>
            <p className="text-sm text-muted-foreground">
              {user.storeName && `Managing: ${user.storeName}`}
            </p>
          </div>
          
          <Button variant="outline" size="sm" onClick={handleLogout}>
            Logout
          </Button>
        </div>

        {loading ? (
          <Card className="p-8 text-center">
            <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4" />
            <p>Loading store analytics...</p>
          </Card>
        ) : analytics ? (
          <div className="space-y-6">
            {/* Overview Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <MetricCard
                title="Total Sales Attempts"
                value={analytics.totalAttempts || 0}
                icon={Target}
              />
              <MetricCard
                title="Conversions"
                value={analytics.conversions || 0}
                icon={CheckCircle}
                changeType="positive"
              />
              <MetricCard
                title="Lost Sales"
                value={analytics.lostSales || 0}
                icon={XCircle}
                changeType="negative"
              />
              <MetricCard
                title="Conversion Rate"
                value={`${analytics.conversionRate || 0}%`}
                icon={TrendingUp}
              />
            </div>

            {/* Team Performance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="mr-2 h-5 w-5 text-primary" />
                  Team Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                {analytics.teamMembers && analytics.teamMembers.length > 0 ? (
                  <div className="space-y-4">
                    {analytics.teamMembers.map((member: any, index: number) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <h4 className="font-semibold">{member.name}</h4>
                          <p className="text-sm text-muted-foreground">{member.role}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">{member.sales} sales</p>
                          <p className="text-sm text-muted-foreground">{member.conversionRate}% rate</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-4">
                    No team data available yet.
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Common Objections */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertTriangle className="mr-2 h-5 w-5 text-warning" />
                  Common Objections
                </CardTitle>
              </CardHeader>
              <CardContent>
                {analytics.commonObjections && analytics.commonObjections.length > 0 ? (
                  <div className="space-y-3">
                    {analytics.commonObjections.map((objection: string, index: number) => (
                      <div key={index} className="p-3 bg-muted/30 rounded-lg border-l-4 border-warning">
                        <p className="text-sm">{objection}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-4">
                    No objection data available yet.
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Store Performance Trends */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="mr-2 h-5 w-5 text-accent" />
                  Performance Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="p-4 bg-primary/10 rounded-lg">
                    <h3 className="font-semibold text-sm text-primary">This Week</h3>
                    <p className="text-2xl font-bold text-primary">
                      {analytics.weeklyPerformance || 0}
                    </p>
                    <p className="text-xs text-muted-foreground">Sales</p>
                  </div>
                  <div className="p-4 bg-accent/10 rounded-lg">
                    <h3 className="font-semibold text-sm text-accent">This Month</h3>
                    <p className="text-2xl font-bold text-accent">
                      {analytics.monthlyPerformance || 0}
                    </p>
                    <p className="text-xs text-muted-foreground">Sales</p>
                  </div>
                  <div className="p-4 bg-success/10 rounded-lg">
                    <h3 className="font-semibold text-sm text-success">Target</h3>
                    <p className="text-2xl font-bold text-success">
                      {analytics.target || 0}
                    </p>
                    <p className="text-xs text-muted-foreground">Goal</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">No analytics data available for your store yet.</p>
          </Card>
        )}
      </div>
    </div>
  );
}
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MetricCard } from '@/components/ui/metric-card';
import { 
  Building2, 
  Users, 
  TrendingUp, 
  Target,
  Award,
  AlertTriangle,
  BarChart3,
  MapPin
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { storage } from '@/utils/storage';
import { api } from '@/utils/api';
import { useToast } from '@/hooks/use-toast';

export default function ZonalManagerDashboard() {
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
    loadZoneAnalytics();
  }, [user, navigate]);

  const loadZoneAnalytics = async () => {
    if (!user?.zoneName) return;
    
    setLoading(true);
    try {
      const data = await api.getZoneAnalytics(user.zoneName);
      setAnalytics(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load zone analytics.",
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
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 pt-4">
          <div>
            <h1 className="text-2xl font-bold">Zonal Manager Dashboard</h1>
            <p className="text-sm text-muted-foreground flex items-center">
              <MapPin className="h-4 w-4 mr-1" />
              {user.zoneName && `Zone: ${user.zoneName}`}
            </p>
          </div>
          
          <Button variant="outline" size="sm" onClick={handleLogout}>
            Logout
          </Button>
        </div>

        {loading ? (
          <Card className="p-8 text-center">
            <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4" />
            <p>Loading zone analytics...</p>
          </Card>
        ) : analytics ? (
          <div className="space-y-6">
            {/* Zone Overview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <MetricCard
                title="Total Stores"
                value={analytics.totalStores || 0}
                icon={Building2}
              />
              <MetricCard
                title="Total Salespeople"
                value={analytics.totalSalespeople || 0}
                icon={Users}
              />
              <MetricCard
                title="Zone Revenue"
                value={`$${analytics.totalRevenue || 0}`}
                icon={Target}
                changeType="positive"
              />
              <MetricCard
                title="Avg Conversion"
                value={`${analytics.avgConversionRate || 0}%`}
                icon={TrendingUp}
              />
            </div>

            {/* Performance Rankings */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Top Performing Stores */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Award className="mr-2 h-5 w-5 text-success" />
                    Top Performing Stores
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {analytics.topStores && analytics.topStores.length > 0 ? (
                    <div className="space-y-3">
                      {analytics.topStores.map((store: any, index: number) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-success/10 rounded-lg">
                          <div>
                            <h4 className="font-semibold">{store.name}</h4>
                            <p className="text-sm text-muted-foreground">{store.manager}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-success">{store.sales} sales</p>
                            <p className="text-sm text-muted-foreground">{store.conversionRate}%</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-center py-4">
                      No store data available.
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Low Performing Stores */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <AlertTriangle className="mr-2 h-5 w-5 text-warning" />
                    Stores Needing Attention
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {analytics.lowPerformingStores && analytics.lowPerformingStores.length > 0 ? (
                    <div className="space-y-3">
                      {analytics.lowPerformingStores.map((store: any, index: number) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-warning/10 rounded-lg">
                          <div>
                            <h4 className="font-semibold">{store.name}</h4>
                            <p className="text-sm text-muted-foreground">{store.manager}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-warning">{store.sales} sales</p>
                            <p className="text-sm text-muted-foreground">{store.conversionRate}%</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-center py-4">
                      All stores performing well!
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Top Salespeople */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="mr-2 h-5 w-5 text-primary" />
                  Top Performing Salespeople
                </CardTitle>
              </CardHeader>
              <CardContent>
                {analytics.topSalespeople && analytics.topSalespeople.length > 0 ? (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {analytics.topSalespeople.map((person: any, index: number) => (
                      <div key={index} className="p-4 border rounded-lg bg-primary/5">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold">{person.name}</h4>
                          <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded">
                            #{index + 1}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-1">{person.store}</p>
                        <div className="flex justify-between text-sm">
                          <span>{person.sales} sales</span>
                          <span className="text-primary">{person.conversionRate}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-4">
                    No salesperson data available.
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Zone Performance Trends */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="mr-2 h-5 w-5 text-accent" />
                  Zone Performance Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-primary/10 rounded-lg">
                    <h3 className="font-semibold text-sm text-primary">This Week</h3>
                    <p className="text-xl font-bold text-primary">
                      {analytics.weeklyPerformance || 0}
                    </p>
                    <p className="text-xs text-muted-foreground">Sales</p>
                  </div>
                  <div className="text-center p-4 bg-accent/10 rounded-lg">
                    <h3 className="font-semibold text-sm text-accent">This Month</h3>
                    <p className="text-xl font-bold text-accent">
                      {analytics.monthlyPerformance || 0}
                    </p>
                    <p className="text-xs text-muted-foreground">Sales</p>
                  </div>
                  <div className="text-center p-4 bg-success/10 rounded-lg">
                    <h3 className="font-semibold text-sm text-success">Target</h3>
                    <p className="text-xl font-bold text-success">
                      {analytics.target || 0}
                    </p>
                    <p className="text-xs text-muted-foreground">Goal</p>
                  </div>
                  <div className="text-center p-4 bg-warning/10 rounded-lg">
                    <h3 className="font-semibold text-sm text-warning">Achievement</h3>
                    <p className="text-xl font-bold text-warning">
                      {analytics.achievementRate || 0}%
                    </p>
                    <p className="text-xs text-muted-foreground">of Target</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">No analytics data available for your zone yet.</p>
          </Card>
        )}
      </div>
    </div>
  );
}
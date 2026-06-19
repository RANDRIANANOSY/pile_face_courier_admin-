import React from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { mockCourierPerformance } from '@/lib/mock-data';
import { TrendingUp, Award, Target } from 'lucide-react';

export default function Performance() {
  const topPerformers = [...mockCourierPerformance].sort((a, b) => b.rating - a.rating).slice(0, 5);

  const performanceData = mockCourierPerformance.map((p) => ({
    name: p.courierName.split(' ')[0],
    successRate: p.successRate,
    punctuality: p.punctualityRate,
  }));

  return (
    <DashboardLayout>
      <div className="p-4 md:p-6 space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Courier Performance</h1>
          <p className="text-muted-foreground mt-1">Track and analyze courier performance metrics</p>
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Avg Success Rate</p>
                  <p className="text-3xl font-bold mt-2">
                    {(mockCourierPerformance.reduce((a, b) => a + b.successRate, 0) / mockCourierPerformance.length).toFixed(1)}%
                  </p>
                </div>
                <div className="bg-green-50 p-3 rounded-lg">
                  <TrendingUp className="text-green-600 w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Avg Punctuality</p>
                  <p className="text-3xl font-bold mt-2">
                    {(mockCourierPerformance.reduce((a, b) => a + b.punctualityRate, 0) / mockCourierPerformance.length).toFixed(1)}%
                  </p>
                </div>
                <div className="bg-blue-50 p-3 rounded-lg">
                  <Target className="text-blue-600 w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Avg Delivery Time</p>
                  <p className="text-3xl font-bold mt-2">
                    {Math.round(mockCourierPerformance.reduce((a, b) => a + b.averageDeliveryTime, 0) / mockCourierPerformance.length)} min
                  </p>
                </div>
                <div className="bg-purple-50 p-3 rounded-lg">
                  <Award className="text-purple-600 w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Performance Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Success Rate vs Punctuality */}
          <Card>
            <CardHeader>
              <CardTitle>Success Rate vs Punctuality</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="name" stroke="#6B7280" />
                  <YAxis stroke="#6B7280" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #E5E7EB',
                      borderRadius: '8px',
                    }}
                  />
                  <Legend />
                  <Bar dataKey="successRate" fill="#10B981" name="Success Rate %" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="punctuality" fill="#3B82F6" name="Punctuality %" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Delivery Time Trend */}
          <Card>
            <CardHeader>
              <CardTitle>Average Delivery Time</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="name" stroke="#6B7280" />
                  <YAxis stroke="#6B7280" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #E5E7EB',
                      borderRadius: '8px',
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="successRate"
                    stroke="#1E3A8A"
                    strokeWidth={2}
                    dot={{ fill: '#1E3A8A' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Top Performers */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award size={20} className="text-accent" />
              Top Performers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topPerformers.map((performer, index) => (
                <div key={performer.courierId} className="flex items-center justify-between p-4 bg-secondary rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-8 h-8 bg-primary text-white rounded-full font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium">{performer.courierName}</p>
                      <p className="text-sm text-muted-foreground">{performer.totalDeliveries} deliveries</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm font-medium">{performer.rating.toFixed(1)}</p>
                      <p className="text-xs text-muted-foreground">Rating</p>
                    </div>
                    <Badge className="bg-green-100 text-green-800">{performer.successRate.toFixed(1)}%</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

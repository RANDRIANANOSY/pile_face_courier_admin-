import React, { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { mockMonthlyStats } from '@/lib/mock-data';
import { Download, FileText, Calendar } from 'lucide-react';
import { toast } from 'sonner';

export default function Reports() {
  const [reportType, setReportType] = useState<'daily' | 'weekly' | 'monthly'>('monthly');

  const handleExport = (format: 'pdf' | 'excel') => {
    toast.success(`Report exported as ${format.toUpperCase()}`);
  };

  const reportOptions = [
    { id: 'daily', label: 'Daily Report', icon: Calendar },
    { id: 'weekly', label: 'Weekly Report', icon: Calendar },
    { id: 'monthly', label: 'Monthly Report', icon: Calendar },
  ];

  return (
    <DashboardLayout>
      <div className="p-4 md:p-6 space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Reports</h1>
          <p className="text-muted-foreground mt-1">Generate and export delivery reports</p>
        </div>

        {/* Report Type Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Select Report Type</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {reportOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => setReportType(option.id as any)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    reportType === option.id
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary'
                  }`}
                >
                  <option.icon size={24} className="mb-2 text-primary" />
                  <p className="font-medium">{option.label}</p>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Monthly Deliveries Chart */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Delivery Statistics</CardTitle>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleExport('pdf')}
                  className="gap-2"
                >
                  <Download size={16} />
                  PDF
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleExport('excel')}
                  className="gap-2"
                >
                  <Download size={16} />
                  Excel
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={mockMonthlyStats}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="month" stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                <Bar dataKey="deliveries" fill="#1E3A8A" name="Total" radius={[8, 8, 0, 0]} />
                <Bar dataKey="completed" fill="#10B981" name="Completed" radius={[8, 8, 0, 0]} />
                <Bar dataKey="cancelled" fill="#EF4444" name="Cancelled" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Summary Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div>
                <p className="text-sm text-muted-foreground">Total Deliveries</p>
                <p className="text-3xl font-bold mt-2">
                  {mockMonthlyStats.reduce((a, b) => a + b.deliveries, 0)}
                </p>
                <p className="text-xs text-green-600 mt-2">↑ 12% from last period</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-3xl font-bold mt-2">
                  {mockMonthlyStats.reduce((a, b) => a + b.completed, 0)}
                </p>
                <p className="text-xs text-green-600 mt-2">
                  {(
                    (mockMonthlyStats.reduce((a, b) => a + b.completed, 0) /
                      mockMonthlyStats.reduce((a, b) => a + b.deliveries, 0)) *
                    100
                  ).toFixed(1)}
                  % success
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div>
                <p className="text-sm text-muted-foreground">Cancelled</p>
                <p className="text-3xl font-bold mt-2">
                  {mockMonthlyStats.reduce((a, b) => a + b.cancelled, 0)}
                </p>
                <p className="text-xs text-red-600 mt-2">
                  {(
                    (mockMonthlyStats.reduce((a, b) => a + b.cancelled, 0) /
                      mockMonthlyStats.reduce((a, b) => a + b.deliveries, 0)) *
                    100
                  ).toFixed(1)}
                  % cancellation
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div>
                <p className="text-sm text-muted-foreground">Avg per Month</p>
                <p className="text-3xl font-bold mt-2">
                  {Math.round(mockMonthlyStats.reduce((a, b) => a + b.deliveries, 0) / mockMonthlyStats.length)}
                </p>
                <p className="text-xs text-blue-600 mt-2">deliveries/month</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Reports */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {['June 2024', 'May 2024', 'April 2024'].map((month, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileText size={20} className="text-primary" />
                    <div>
                      <p className="font-medium">{month} Report</p>
                      <p className="text-xs text-muted-foreground">Generated on {new Date().toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={() => handleExport('pdf')}>
                      PDF
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleExport('excel')}>
                      Excel
                    </Button>
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

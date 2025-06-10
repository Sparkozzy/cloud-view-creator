
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { TrendingDown } from 'lucide-react';

interface Lead {
  id: number;
  'atendido?': string;
  'Reuniao_marcada?': string;
}

interface ConversionFunnelProps {
  leads: Lead[];
}

export const ConversionFunnel: React.FC<ConversionFunnelProps> = ({ leads }) => {
  const totalCalls = leads.length;
  const answeredCalls = leads.filter(lead => lead['atendido?'] === 'sim').length;
  const scheduledMeetings = leads.filter(lead => lead['Reuniao_marcada?'] === 'sim').length;

  const funnelData = [
    {
      stage: 'Ligações Realizadas',
      count: totalCalls,
      percentage: 100,
      color: '#3b82f6'
    },
    {
      stage: 'Ligações Atendidas',
      count: answeredCalls,
      percentage: totalCalls > 0 ? (answeredCalls / totalCalls) * 100 : 0,
      color: '#10b981'
    },
    {
      stage: 'Reuniões Marcadas',
      count: scheduledMeetings,
      percentage: totalCalls > 0 ? (scheduledMeetings / totalCalls) * 100 : 0,
      color: '#8b5cf6'
    }
  ];

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <TrendingDown className="h-5 w-5" />
          Funil de Conversão
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Chart */}
          <div>
            <ChartContainer 
              config={{
                count: { label: "Quantidade", color: "#8b5cf6" }
              }} 
              className="h-80"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={funnelData} layout="horizontal">
                  <XAxis type="number" stroke="#9ca3af" />
                  <YAxis dataKey="stage" type="category" stroke="#9ca3af" width={120} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="count" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>

          {/* Funnel Visual */}
          <div className="space-y-4">
            {funnelData.map((stage, index) => (
              <div key={stage.stage} className="relative">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white font-medium">{stage.stage}</span>
                  <span className="text-gray-400">{stage.count} ({stage.percentage.toFixed(1)}%)</span>
                </div>
                <div className="relative h-12 bg-gray-700 rounded-lg overflow-hidden">
                  <div
                    className="h-full transition-all duration-500 ease-out rounded-lg"
                    style={{
                      width: `${stage.percentage}%`,
                      backgroundColor: stage.color
                    }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-white font-bold text-sm">
                      {stage.count}
                    </span>
                  </div>
                </div>
                {index < funnelData.length - 1 && (
                  <div className="flex justify-center my-2">
                    <div className="w-0 h-0 border-l-4 border-r-4 border-t-8 border-l-transparent border-r-transparent border-t-gray-500" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};


import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Phone, Calendar, DollarSign, Clock, TrendingUp, Users } from 'lucide-react';

interface Lead {
  id: number;
  Nome: string;
  email_lead: string;
  Numero: string;
  Data_horario_ligação: string;
  Duracao: number;
  tentativas: string;
  Custo_total: number;
  'Reuniao_marcada?': string;
  Resumo_ligação: string;
  Sentimento_do_usuário: string;
  email_closer: string;
  dateTime: string;
  'atendido?': string;
}

interface MetricsCardsProps {
  leads: Lead[];
  isLoading: boolean;
}

export const MetricsCards: React.FC<MetricsCardsProps> = ({ leads, isLoading }) => {
  const totalCalls = leads.length;
  const answeredCalls = leads.filter(lead => lead['atendido?'] === 'sim').length;
  const scheduledMeetings = leads.filter(lead => lead['Reuniao_marcada?'] === 'sim').length;
  const totalCost = leads.reduce((sum, lead) => sum + (lead.Custo_total || 0), 0);
  const totalDuration = leads.reduce((sum, lead) => sum + (lead.Duracao || 0), 0);
  const avgAttempts = leads.length > 0 
    ? leads.reduce((sum, lead) => sum + (parseInt(lead.tentativas) || 0), 0) / leads.length 
    : 0;

  const metrics = [
    {
      title: 'Total de Ligações',
      value: totalCalls.toLocaleString(),
      icon: Phone,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10'
    },
    {
      title: 'Ligações Atendidas',
      value: answeredCalls.toLocaleString(),
      icon: Users,
      color: 'text-green-400',
      bgColor: 'bg-green-500/10',
      subtitle: `${totalCalls > 0 ? ((answeredCalls / totalCalls) * 100).toFixed(1) : 0}% taxa de atendimento`
    },
    {
      title: 'Reuniões Marcadas',
      value: scheduledMeetings.toLocaleString(),
      icon: Calendar,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10',
      subtitle: `${answeredCalls > 0 ? ((scheduledMeetings / answeredCalls) * 100).toFixed(1) : 0}% conversão`
    },
    {
      title: 'Custo Total',
      value: `R$ ${totalCost.toFixed(2)}`,
      icon: DollarSign,
      color: 'text-red-400',
      bgColor: 'bg-red-500/10',
      subtitle: `R$ ${totalCalls > 0 ? (totalCost / totalCalls).toFixed(2) : 0} por ligação`
    },
    {
      title: 'Duração Total',
      value: `${Math.floor(totalDuration / 60)}h ${totalDuration % 60}m`,
      icon: Clock,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/10',
      subtitle: `${totalCalls > 0 ? Math.floor(totalDuration / totalCalls) : 0}s média por ligação`
    },
    {
      title: 'Tentativas/Lead',
      value: avgAttempts.toFixed(1),
      icon: TrendingUp,
      color: 'text-indigo-400',
      bgColor: 'bg-indigo-500/10'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
      {metrics.map((metric, index) => {
        const Icon = metric.icon;
        return (
          <Card key={index} className="bg-gray-800 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">
                {metric.title}
              </CardTitle>
              <div className={`p-2 rounded-full ${metric.bgColor}`}>
                <Icon className={`h-4 w-4 ${metric.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {isLoading ? '...' : metric.value}
              </div>
              {metric.subtitle && (
                <p className="text-xs text-gray-400 mt-1">
                  {metric.subtitle}
                </p>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

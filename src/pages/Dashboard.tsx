
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { Phone, Calendar, DollarSign, Clock, TrendingUp, Users } from 'lucide-react';
import { LeadDetailsPanel } from '@/components/dashboard/LeadDetailsPanel';
import { MetricsCards } from '@/components/dashboard/MetricsCards';
import { ConversionFunnel } from '@/components/dashboard/ConversionFunnel';
import { TimeAnalysis } from '@/components/dashboard/TimeAnalysis';

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

const Dashboard = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [dateFilter, setDateFilter] = useState({ start: '', end: '' });
  const [emailFilter, setEmailFilter] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Fetch initial data
  useEffect(() => {
    fetchLeads();
    
    // Setup real-time subscription
    const channel = supabase
      .channel('retell-leads-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'Retell_Leads'
        },
        () => {
          console.log('Real-time update detected, refreshing data...');
          fetchLeads();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchLeads = async () => {
    try {
      setIsLoading(true);
      let query = supabase
        .from('Retell_Leads')
        .select('*')
        .order('created_at', { ascending: false });

      if (dateFilter.start && dateFilter.end) {
        query = query
          .gte('created_at', dateFilter.start)
          .lte('created_at', dateFilter.end);
      }

      if (emailFilter) {
        query = query.ilike('email_lead', `%${emailFilter}%`);
      }

      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching leads:', error);
        return;
      }

      setLeads(data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Apply filters when they change
  useEffect(() => {
    fetchLeads();
  }, [dateFilter, emailFilter]);

  const filteredLeads = leads;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white">Dashboard - Agente IA Imobiliário</h1>
            <p className="text-gray-400 mt-2">Monitoramento em tempo real da performance de ligações</p>
          </div>
          <div className="flex gap-4">
            <Input
              placeholder="Filtrar por email..."
              value={emailFilter}
              onChange={(e) => setEmailFilter(e.target.value)}
              className="w-64 bg-gray-800 border-gray-700 text-white"
            />
            <Input
              type="date"
              value={dateFilter.start}
              onChange={(e) => setDateFilter(prev => ({ ...prev, start: e.target.value }))}
              className="bg-gray-800 border-gray-700 text-white"
            />
            <Input
              type="date"
              value={dateFilter.end}
              onChange={(e) => setDateFilter(prev => ({ ...prev, end: e.target.value }))}
              className="bg-gray-800 border-gray-700 text-white"
            />
          </div>
        </div>

        {/* Metrics Cards */}
        <MetricsCards leads={filteredLeads} isLoading={isLoading} />

        {/* Charts Section */}
        <Tabs defaultValue="funnel" className="space-y-6">
          <TabsList className="bg-gray-800 border-gray-700">
            <TabsTrigger value="funnel" className="data-[state=active]:bg-gray-700">Funil de Conversão</TabsTrigger>
            <TabsTrigger value="trends" className="data-[state=active]:bg-gray-700">Tendências</TabsTrigger>
            <TabsTrigger value="time" className="data-[state=active]:bg-gray-700">Análise Temporal</TabsTrigger>
          </TabsList>

          <TabsContent value="funnel" className="space-y-6">
            <ConversionFunnel leads={filteredLeads} />
          </TabsContent>

          <TabsContent value="trends" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Evolução Semanal de Ligações
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={{ calls: { label: "Ligações", color: "#8b5cf6" } }} className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={getWeeklyData(filteredLeads)}>
                        <XAxis dataKey="day" stroke="#9ca3af" />
                        <YAxis stroke="#9ca3af" />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Line type="monotone" dataKey="calls" stroke="#8b5cf6" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    Evolução de Custos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={{ cost: { label: "Custo", color: "#ef4444" } }} className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={getCostData(filteredLeads)}>
                        <XAxis dataKey="day" stroke="#9ca3af" />
                        <YAxis stroke="#9ca3af" />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Line type="monotone" dataKey="cost" stroke="#ef4444" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="time" className="space-y-6">
            <TimeAnalysis leads={filteredLeads} />
          </TabsContent>
        </Tabs>

        {/* Recent Leads Table */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Users className="h-5 w-5" />
              Leads Recentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left p-3 text-gray-300">Nome</th>
                    <th className="text-left p-3 text-gray-300">Email</th>
                    <th className="text-left p-3 text-gray-300">Telefone</th>
                    <th className="text-left p-3 text-gray-300">Status</th>
                    <th className="text-left p-3 text-gray-300">Reunião</th>
                    <th className="text-left p-3 text-gray-300">Custo</th>
                    <th className="text-left p-3 text-gray-300">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLeads.slice(0, 10).map((lead) => (
                    <tr key={lead.id} className="border-b border-gray-700 hover:bg-gray-750">
                      <td className="p-3 text-white">{lead.Nome || 'N/A'}</td>
                      <td className="p-3 text-gray-300">{lead.email_lead || 'N/A'}</td>
                      <td className="p-3 text-gray-300">{lead.Numero || 'N/A'}</td>
                      <td className="p-3">
                        <span className={`px-2 py-1 rounded text-xs ${
                          lead['atendido?'] === 'sim' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
                        }`}>
                          {lead['atendido?'] === 'sim' ? 'Atendido' : 'Não Atendido'}
                        </span>
                      </td>
                      <td className="p-3">
                        <span className={`px-2 py-1 rounded text-xs ${
                          lead['Reuniao_marcada?'] === 'sim' ? 'bg-blue-600 text-white' : 'bg-gray-600 text-white'
                        }`}>
                          {lead['Reuniao_marcada?'] === 'sim' ? 'Marcada' : 'Não Marcada'}
                        </span>
                      </td>
                      <td className="p-3 text-green-400">R$ {(lead.Custo_total || 0).toFixed(2)}</td>
                      <td className="p-3">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedLead(lead)}
                          className="border-gray-600 text-gray-300 hover:bg-gray-700"
                        >
                          Ver Detalhes
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lead Details Panel */}
      <LeadDetailsPanel 
        lead={selectedLead} 
        onClose={() => setSelectedLead(null)} 
      />
    </div>
  );
};

// Helper functions
const getWeeklyData = (leads: Lead[]) => {
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return {
      day: date.toLocaleDateString('pt-BR', { weekday: 'short' }),
      date: date.toISOString().split('T')[0],
      calls: 0
    };
  }).reverse();

  leads.forEach(lead => {
    if (lead.Data_horario_ligação) {
      const leadDate = new Date(lead.Data_horario_ligação).toISOString().split('T')[0];
      const dayData = last7Days.find(d => d.date === leadDate);
      if (dayData) dayData.calls++;
    }
  });

  return last7Days;
};

const getCostData = (leads: Lead[]) => {
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return {
      day: date.toLocaleDateString('pt-BR', { weekday: 'short' }),
      date: date.toISOString().split('T')[0],
      cost: 0
    };
  }).reverse();

  leads.forEach(lead => {
    if (lead.Data_horario_ligação && lead.Custo_total) {
      const leadDate = new Date(lead.Data_horario_ligação).toISOString().split('T')[0];
      const dayData = last7Days.find(d => d.date === leadDate);
      if (dayData) dayData.cost += lead.Custo_total;
    }
  });

  return last7Days;
};

export default Dashboard;

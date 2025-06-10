
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, Phone, Mail, Calendar, Clock, DollarSign, MessageSquare, Heart, User } from 'lucide-react';

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

interface LeadDetailsPanelProps {
  lead: Lead | null;
  onClose: () => void;
}

export const LeadDetailsPanel: React.FC<LeadDetailsPanelProps> = ({ lead, onClose }) => {
  if (!lead) return null;

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment?.toLowerCase()) {
      case 'positivo':
        return 'text-green-400';
      case 'negativo':
        return 'text-red-400';
      case 'neutro':
        return 'text-yellow-400';
      default:
        return 'text-gray-400';
    }
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment?.toLowerCase()) {
      case 'positivo':
        return '😊';
      case 'negativo':
        return '😞';
      case 'neutro':
        return '😐';
      default:
        return '❓';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="bg-gray-800 border-gray-700 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-white flex items-center gap-2">
            <User className="h-5 w-5" />
            Detalhes do Lead
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-gray-300">
                <User className="h-4 w-4" />
                <span className="text-sm">Nome:</span>
              </div>
              <div className="text-white font-medium">{lead.Nome || 'N/A'}</div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-gray-300">
                <Mail className="h-4 w-4" />
                <span className="text-sm">Email:</span>
              </div>
              <div className="text-white font-medium">{lead.email_lead || 'N/A'}</div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-gray-300">
                <Phone className="h-4 w-4" />
                <span className="text-sm">Telefone:</span>
              </div>
              <div className="text-white font-medium">{lead.Numero || 'N/A'}</div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-gray-300">
                <User className="h-4 w-4" />
                <span className="text-sm">Responsável:</span>
              </div>
              <div className="text-white font-medium">{lead.email_closer || 'N/A'}</div>
            </div>
          </div>

          {/* Call Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-700 p-4 rounded-lg">
              <div className="flex items-center gap-2 text-gray-300 mb-2">
                <Phone className="h-4 w-4" />
                <span className="text-sm">Tentativas</span>
              </div>
              <div className="text-2xl font-bold text-white">{lead.tentativas || '0'}</div>
            </div>
            
            <div className="bg-gray-700 p-4 rounded-lg">
              <div className="flex items-center gap-2 text-gray-300 mb-2">
                <Clock className="h-4 w-4" />
                <span className="text-sm">Duração</span>
              </div>
              <div className="text-2xl font-bold text-white">
                {lead.Duracao ? `${Math.floor(lead.Duracao / 60)}:${(lead.Duracao % 60).toString().padStart(2, '0')}` : '0:00'}
              </div>
            </div>
            
            <div className="bg-gray-700 p-4 rounded-lg">
              <div className="flex items-center gap-2 text-gray-300 mb-2">
                <DollarSign className="h-4 w-4" />
                <span className="text-sm">Custo</span>
              </div>
              <div className="text-2xl font-bold text-green-400">
                R$ {(lead.Custo_total || 0).toFixed(2)}
              </div>
            </div>
          </div>

          {/* Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-gray-300">
                <Phone className="h-4 w-4" />
                <span className="text-sm">Status da Ligação:</span>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                lead['atendido?'] === 'sim' 
                  ? 'bg-green-600 text-white' 
                  : 'bg-red-600 text-white'
              }`}>
                {lead['atendido?'] === 'sim' ? 'Atendido' : 'Não Atendido'}
              </span>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-gray-300">
                <Calendar className="h-4 w-4" />
                <span className="text-sm">Reunião:</span>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                lead['Reuniao_marcada?'] === 'sim' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-600 text-white'
              }`}>
                {lead['Reuniao_marcada?'] === 'sim' ? 'Marcada' : 'Não Marcada'}
              </span>
            </div>
          </div>

          {/* Sentiment */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-gray-300">
              <Heart className="h-4 w-4" />
              <span className="text-sm">Sentimento do Usuário:</span>
            </div>
            <div className={`flex items-center gap-2 font-medium ${getSentimentColor(lead.Sentimento_do_usuário)}`}>
              <span className="text-lg">{getSentimentIcon(lead.Sentimento_do_usuário)}</span>
              <span className="capitalize">{lead.Sentimento_do_usuário || 'Não informado'}</span>
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-gray-300">
                <Calendar className="h-4 w-4" />
                <span className="text-sm">Data da Ligação:</span>
              </div>
              <div className="text-white">
                {lead.Data_horario_ligação 
                  ? new Date(lead.Data_horario_ligação).toLocaleString('pt-BR')
                  : 'N/A'
                }
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-gray-300">
                <Calendar className="h-4 w-4" />
                <span className="text-sm">Data/Hora Agendada:</span>
              </div>
              <div className="text-white">
                {lead.dateTime 
                  ? new Date(lead.dateTime).toLocaleString('pt-BR')
                  : 'N/A'
                }
              </div>
            </div>
          </div>

          {/* Summary */}
          {lead.Resumo_ligação && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-gray-300">
                <MessageSquare className="h-4 w-4" />
                <span className="text-sm">Resumo da Ligação:</span>
              </div>
              <div className="bg-gray-700 p-4 rounded-lg text-white text-sm leading-relaxed">
                {lead.Resumo_ligação}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

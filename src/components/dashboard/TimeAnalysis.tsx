
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, Calendar } from 'lucide-react';

interface Lead {
  id: number;
  Data_horario_ligação: string;
  'atendido?': string;
}

interface TimeAnalysisProps {
  leads: Lead[];
}

export const TimeAnalysis: React.FC<TimeAnalysisProps> = ({ leads }) => {
  // Helper function to get hour heatmap data
  const getHourHeatmap = () => {
    const hours = Array.from({ length: 24 }, (_, i) => ({
      hour: i,
      total: 0,
      answered: 0,
      rate: 0
    }));

    leads.forEach(lead => {
      if (lead.Data_horario_ligação) {
        const hour = new Date(lead.Data_horario_ligação).getHours();
        hours[hour].total++;
        if (lead['atendido?'] === 'sim') {
          hours[hour].answered++;
        }
      }
    });

    hours.forEach(hour => {
      hour.rate = hour.total > 0 ? (hour.answered / hour.total) * 100 : 0;
    });

    return hours;
  };

  // Helper function to get weekday heatmap data
  const getWeekdayHeatmap = () => {
    const weekdays = [
      'Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'
    ].map((name, index) => ({
      name,
      day: index,
      total: 0,
      answered: 0,
      rate: 0
    }));

    leads.forEach(lead => {
      if (lead.Data_horario_ligação) {
        const day = new Date(lead.Data_horario_ligação).getDay();
        weekdays[day].total++;
        if (lead['atendido?'] === 'sim') {
          weekdays[day].answered++;
        }
      }
    });

    weekdays.forEach(day => {
      day.rate = day.total > 0 ? (day.answered / day.total) * 100 : 0;
    });

    return weekdays;
  };

  const hourData = getHourHeatmap();
  const weekdayData = getWeekdayHeatmap();

  const getHeatmapColor = (rate: number) => {
    if (rate === 0) return 'bg-gray-700';
    if (rate < 25) return 'bg-red-600';
    if (rate < 50) return 'bg-yellow-600';
    if (rate < 75) return 'bg-blue-600';
    return 'bg-green-600';
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Hour Heatmap */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Melhores Horários (Taxa de Atendimento)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-6 gap-2">
            {hourData.map((hour) => (
              <div
                key={hour.hour}
                className={`relative p-3 rounded text-center text-xs text-white font-medium ${getHeatmapColor(hour.rate)}`}
                title={`${hour.hour}h: ${hour.rate.toFixed(1)}% (${hour.answered}/${hour.total})`}
              >
                <div>{hour.hour}h</div>
                <div className="text-xs opacity-75">{hour.rate.toFixed(0)}%</div>
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center justify-between text-xs text-gray-400">
            <span>0%</span>
            <div className="flex gap-1">
              <div className="w-4 h-4 bg-gray-700 rounded"></div>
              <div className="w-4 h-4 bg-red-600 rounded"></div>
              <div className="w-4 h-4 bg-yellow-600 rounded"></div>
              <div className="w-4 h-4 bg-blue-600 rounded"></div>
              <div className="w-4 h-4 bg-green-600 rounded"></div>
            </div>
            <span>100%</span>
          </div>
        </CardContent>
      </Card>

      {/* Weekday Heatmap */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Melhores Dias da Semana
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {weekdayData.map((day) => (
              <div key={day.name} className="flex items-center gap-4">
                <div className="w-20 text-sm text-gray-300">{day.name}</div>
                <div className="flex-1 relative">
                  <div className="h-8 bg-gray-700 rounded overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 ${getHeatmapColor(day.rate)}`}
                      style={{ width: `${Math.max(day.rate, 5)}%` }}
                    />
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center text-xs text-white font-medium">
                    {day.rate.toFixed(1)}% ({day.answered}/{day.total})
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};


import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { BarChart3, Phone, TrendingUp, Users } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:60px_60px]" />
        <div className="relative max-w-7xl mx-auto px-6 py-24">
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-cyan-400 bg-clip-text text-transparent">
                Dashboard IA
              </h1>
              <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
                Monitoramento em tempo real da performance do seu agente de IA para ligações imobiliárias
              </p>
            </div>
            
            <div className="flex justify-center">
              <Link to="/dashboard">
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg">
                  Acessar Dashboard
                  <BarChart3 className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Recursos do Dashboard
          </h2>
          <p className="text-xl text-gray-400">
            Tudo que você precisa para monitorar e otimizar suas campanhas
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              icon: Phone,
              title: "Monitoramento de Ligações",
              description: "Acompanhe todas as ligações realizadas pelo agente IA em tempo real"
            },
            {
              icon: TrendingUp,
              title: "Análise de Performance",
              description: "Métricas detalhadas de conversão e taxa de atendimento"
            },
            {
              icon: BarChart3,
              title: "Relatórios Visuais",
              description: "Gráficos interativos e dashboards personalizáveis"
            },
            {
              icon: Users,
              title: "Gestão de Leads",
              description: "Controle completo dos leads e reuniões agendadas"
            }
          ].map((feature, index) => (
            <Card key={index} className="bg-gray-800 border-gray-700 hover:bg-gray-750 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-white">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-400">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 border-t border-gray-700">
        <div className="max-w-7xl mx-auto px-6 py-16 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Pronto para otimizar suas campanhas?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Acesse o dashboard e comece a monitorar a performance do seu agente IA agora mesmo.
          </p>
          <Link to="/dashboard">
            <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg">
              Começar Agora
              <BarChart3 className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Index;

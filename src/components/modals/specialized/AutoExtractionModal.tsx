import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Globe, 
  Database, 
  FileText, 
  Bot, 
  Download, 
  Search, 
  Clock, 
  CheckCircle, 
  XCircle,
  AlertCircle,
  Play,
  Pause,
  RefreshCw
} from 'lucide-react';

interface AutoExtractionModalProps {
  isOpen: boolean;
  onClose: () => void;
  context: 'procedures' | 'legal-texts';
  data?: any;
}

export function AutoExtractionModal({ isOpen, onClose, context, data }: AutoExtractionModalProps) {
  const [activeTab, setActiveTab] = useState('sources');
  const [extractionProgress, setExtractionProgress] = useState(0);
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractionResults, setExtractionResults] = useState<any[]>([]);

  const contextConfig = {
    procedures: {
      title: 'Extraction automatique - Procédures administratives',
      description: 'Extraire automatiquement des procédures administratives depuis différentes sources',
      sources: [
        { id: 'joradp', name: 'Journal Officiel (JORADP)', type: 'official', url: 'joradp.dz', status: 'available' },
        { id: 'gov-portals', name: 'Portails gouvernementaux', type: 'official', url: 'algeria.gov.dz', status: 'available' },
        { id: 'ministries', name: 'Sites ministériels', type: 'official', url: 'multiple', status: 'available' },
        { id: 'local-admin', name: 'Administrations locales', type: 'local', url: 'wilayas', status: 'limited' }
      ]
    },
    'legal-texts': {
      title: 'Extraction automatique - Textes juridiques',
      description: 'Extraire automatiquement des textes juridiques depuis différentes sources',
      sources: [
        { id: 'joradp-legal', name: 'Journal Officiel - Section Juridique', type: 'official', url: 'joradp.dz', status: 'available' },
        { id: 'constitutional-council', name: 'Conseil Constitutionnel', type: 'official', url: 'conseil-constitutionnel.dz', status: 'available' },
        { id: 'supreme-court', name: 'Cour Suprême', type: 'judicial', url: 'cour-supreme.dz', status: 'available' },
        { id: 'legal-databases', name: 'Bases de données juridiques', type: 'database', url: 'multiple', status: 'premium' }
      ]
    }
  };

  const config = contextConfig[context];

  const mockExtractionResults = [
    { id: 1, title: context === 'procedures' ? 'Procédure de demande de permis de construire' : 'Loi n° 08-15 relative au droit d\'auteur', source: 'JORADP', date: '2024-01-15', status: 'extracted', confidence: 95 },
    { id: 2, title: context === 'procedures' ? 'Démarches d\'état civil' : 'Code de procédure civile et administrative', source: 'Gov Portal', date: '2024-01-14', status: 'extracted', confidence: 88 },
    { id: 3, title: context === 'procedures' ? 'Procédures fiscales' : 'Ordonnance relative au commerce électronique', source: 'Ministry', date: '2024-01-13', status: 'processing', confidence: 0 },
    { id: 4, title: context === 'procedures' ? 'Formalités douanières' : 'Loi de finances 2024', source: 'JORADP', date: '2024-01-12', status: 'pending', confidence: 0 }
  ];

  const handleStartExtraction = () => {
    setIsExtracting(true);
    setActiveTab('progress');
    
    // Simulation du processus d'extraction
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 15;
      if (progress >= 100) {
        progress = 100;
        setIsExtracting(false);
        setExtractionResults(mockExtractionResults);
        setActiveTab('results');
        clearInterval(interval);
      }
      setExtractionProgress(progress);
    }, 800);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'extracted': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'processing': return <RefreshCw className="w-4 h-4 text-blue-600 animate-spin" />;
      case 'pending': return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'error': return <XCircle className="w-4 h-4 text-red-600" />;
      default: return <AlertCircle className="w-4 h-4 text-gray-600" />;
    }
  };

  const getSourceTypeIcon = (type: string) => {
    switch (type) {
      case 'official': return <Globe className="w-4 h-4 text-blue-600" />;
      case 'judicial': return <FileText className="w-4 h-4 text-purple-600" />;
      case 'database': return <Database className="w-4 h-4 text-green-600" />;
      case 'local': return <Bot className="w-4 h-4 text-orange-600" />;
      default: return <Search className="w-4 h-4 text-gray-600" />;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900">{config.title}</DialogTitle>
          <DialogDescription className="text-gray-600">
            {config.description}
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="sources">Sources disponibles</TabsTrigger>
            <TabsTrigger value="progress" disabled={!isExtracting && extractionProgress === 0}>
              Progression
            </TabsTrigger>
            <TabsTrigger value="results" disabled={extractionResults.length === 0}>
              Résultats ({extractionResults.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="sources" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {config.sources.map((source) => (
                <Card key={source.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {getSourceTypeIcon(source.type)}
                        <CardTitle className="text-lg">{source.name}</CardTitle>
                      </div>
                      <Badge variant={source.status === 'available' ? 'default' : source.status === 'limited' ? 'secondary' : 'destructive'}>
                        {source.status === 'available' ? 'Disponible' : 
                         source.status === 'limited' ? 'Limité' : 
                         source.status === 'premium' ? 'Premium' : 'Indisponible'}
                      </Badge>
                    </div>
                    <CardDescription>{source.url}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-3">
                      {source.type === 'official' ? 'Source officielle gouvernementale' :
                       source.type === 'judicial' ? 'Institution judiciaire' :
                       source.type === 'database' ? 'Base de données spécialisée' :
                       'Administration locale'}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Taux de réussite: 92%</span>
                      <span className="text-sm text-gray-500">Dernière extraction: il y a 2h</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="flex justify-between items-center pt-4 border-t">
              <div className="text-sm text-gray-600">
                <p><strong>{config.sources.filter(s => s.status === 'available').length}</strong> sources disponibles</p>
                <p>Extraction estimée: <strong>15-30 minutes</strong></p>
              </div>
              <Button 
                onClick={handleStartExtraction} 
                disabled={isExtracting}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Play className="w-4 h-4 mr-2" />
                Démarrer l'extraction
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="progress" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <RefreshCw className={`w-5 h-5 ${isExtracting ? 'animate-spin text-blue-600' : 'text-gray-400'}`} />
                  <span>Extraction en cours...</span>
                </CardTitle>
                <CardDescription>
                  Traitement automatique des sources sélectionnées
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Progression globale</span>
                    <span>{Math.round(extractionProgress)}%</span>
                  </div>
                  <Progress value={extractionProgress} className="w-full" />
                </div>
                
                <div className="space-y-2">
                  <div className="text-sm font-medium">Étapes en cours:</div>
                  <div className="space-y-1 text-sm text-gray-600">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span>Connexion aux sources</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span>Authentification</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RefreshCw className="w-4 h-4 text-blue-600 animate-spin" />
                      <span>Analyse et extraction du contenu</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span>Validation et nettoyage</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span>Import dans la base de données</span>
                    </div>
                  </div>
                </div>

                {isExtracting && (
                  <div className="flex justify-center">
                    <Button variant="outline" onClick={() => setIsExtracting(false)}>
                      <Pause className="w-4 h-4 mr-2" />
                      Suspendre
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="results" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">
                {extractionResults.length} éléments extraits
              </h3>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Exporter
                </Button>
                <Button size="sm" onClick={() => {
                  // Logic to import all extracted items
                  console.log('Importing all items...');
                  onClose();
                }}>
                  Tout importer
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              {extractionResults.map((result) => (
                <Card key={result.id} className="hover:shadow-sm transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          {getStatusIcon(result.status)}
                          <h4 className="font-medium text-gray-900">{result.title}</h4>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span>Source: {result.source}</span>
                          <span>Date: {result.date}</span>
                          {result.confidence > 0 && (
                            <span className="flex items-center space-x-1">
                              <span>Confiance:</span>
                              <Badge variant={result.confidence >= 90 ? 'default' : result.confidence >= 70 ? 'secondary' : 'destructive'}>
                                {result.confidence}%
                              </Badge>
                            </span>
                          )}
                        </div>
                      </div>
                      {result.status === 'extracted' && (
                        <Button variant="outline" size="sm">
                          Importer
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end space-x-2 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Fermer
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
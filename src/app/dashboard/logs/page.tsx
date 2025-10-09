'use client';

import { useState, useEffect, useRef } from 'react';
import { AndePage } from '@/components/ui/AndePage';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Activity, Database, Cpu, Layers, Info } from 'lucide-react';

const containers = ['All', 'single-sequencer', 'ev-reth-sequencer', 'local-da', 'relayer'];
const MAX_LOGS = 200;

const getContainerColor = (container: string) => {
  switch (container) {
    case 'single-sequencer': return 'text-blue-400';
    case 'ev-reth-sequencer': return 'text-purple-400';
    case 'local-da': return 'text-yellow-400';
    case 'relayer': return 'text-green-400';
    default: return 'text-gray-400';
  }
};

const getContainerInfo = (container: string) => {
  switch (container) {
    case 'single-sequencer':
      return {
        name: 'Sequencer',
        description: 'Block production and ordering',
        icon: Activity,
        color: 'text-blue-400'
      };
    case 'ev-reth-sequencer':
      return {
        name: 'EVM Execution',
        description: 'ev-reth with ANDE precompile',
        icon: Cpu,
        color: 'text-purple-400'
      };
    case 'local-da':
      return {
        name: 'Data Availability',
        description: 'Mock Celestia DA layer',
        icon: Database,
        color: 'text-yellow-400'
      };
    case 'relayer':
      return {
        name: 'Bridge Relayer',
        description: 'Cross-chain bridge relayer',
        icon: Layers,
        color: 'text-green-400'
      };
    default:
      return {
        name: 'All Services',
        description: 'Complete infrastructure logs',
        icon: Activity,
        color: 'text-gray-400'
      };
  }
};

const LogsPage = () => {
  const [logs, setLogs] = useState<{ [key: string]: { line: string, timestamp: string, container: string }[] }>({});
  const [isPaused, setIsPaused] = useState(false);
  const [autoScroll, setAutoScroll] = useState(true);
  const [userHasScrolled, setUserHasScrolled] = useState(false);
  const logsContainerRefs = useRef<{ [key: string]: null | HTMLDivElement }>({});
  const logsEndRefs = useRef<{ [key: string]: null | HTMLDivElement }>({});

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8080');

    ws.onmessage = (event) => {
      if (!isPaused) {
        const logData = JSON.parse(event.data);
        const newLog = { ...logData, timestamp: new Date().toLocaleTimeString() };

        setLogs(prevLogs => {
          const allLogs = [...(prevLogs['All'] || []), newLog].slice(-MAX_LOGS);
          const containerLogs = [...(prevLogs[newLog.container] || []), newLog].slice(-MAX_LOGS);
          return { ...prevLogs, 'All': allLogs, [newLog.container]: containerLogs };
        });
      }
    };

    return () => {
      ws.close();
    };
  }, [isPaused]);

  useEffect(() => {
    if (autoScroll && !userHasScrolled) {
      Object.values(logsEndRefs.current).forEach(ref => {
        ref?.scrollIntoView({ behavior: 'smooth' });
      });
    }
  }, [logs, autoScroll, userHasScrolled]);

  const handleScroll = () => {
    setUserHasScrolled(true);
    setAutoScroll(false);
  };

  const scrollToBottom = (container: string) => {
    logsEndRefs.current[container]?.scrollIntoView({ behavior: 'smooth' });
    setUserHasScrolled(false);
    setAutoScroll(true);
  };

  const clearLogs = (container: string) => {
    setLogs(prevLogs => ({ ...prevLogs, [container]: [] }));
  };

  return (
    <AndePage pageId="logs">
      {/* Logs tabs con altura completa */}
      <div className="h-full flex flex-col">
        <Tabs defaultValue="All" className="flex-1 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <TabsList className="grid grid-cols-5 gap-2">
              {containers.map(container => {
                const info = getContainerInfo(container);
                const Icon = info.icon;
                return (
                  <TabsTrigger key={container} value={container} className="flex items-center gap-2">
                    <Icon className="w-4 h-4" />
                    <span className="hidden sm:inline">{info.name}</span>
                  </TabsTrigger>
                );
              })}
            </TabsList>
            <div className="flex items-center space-x-4">
              <button onClick={() => setIsPaused(!isPaused)} className="px-4 py-2 bg-blue-500 text-white rounded-md">
                {isPaused ? 'Resume' : 'Pause'}
              </button>
              <button onClick={() => clearLogs('All')} className="px-4 py-2 bg-red-500 text-white rounded-md">
                Clear All Logs
              </button>
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="autoscroll" checked={autoScroll} onChange={() => setAutoScroll(!autoScroll)} />
                <label htmlFor="autoscroll">Auto-scroll</label>
              </div>
            </div>
          </div>
          {containers.map(container => {
            const info = getContainerInfo(container);
            const Icon = info.icon;
            return (
              <TabsContent key={container} value={container} className="flex-1 space-y-4">
                <Card className="bg-gray-900 border-gray-800">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-white">
                      <Icon className={`w-5 h-5 ${info.color}`} />
                      {info.name}
                    </CardTitle>
                    <CardDescription className="text-gray-400">
                      {info.description}
                    </CardDescription>
                  </CardHeader>
                </Card>

                <div className="flex-1 bg-gray-900 text-white font-mono text-sm rounded-lg p-4 relative h-96">
                  <div className="absolute inset-0 overflow-y-scroll" onWheel={handleScroll}>
                    {(logs[container] || []).map((log, index) => (
                      <div key={index} className="mb-1">
                        <span className="text-gray-500">{log.timestamp}</span>{' '}
                        <span className={getContainerColor(log.container)}>[{log.container}]</span>{' '}
                        <span className="text-gray-300">{log.line}</span>
                      </div>
                    ))}
                    <div ref={el => logsEndRefs.current[container] = el} />
                  </div>
                  {!autoScroll && (
                    <button onClick={() => scrollToBottom(container)} className="absolute bottom-4 right-4 px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600">
                      Scroll to Bottom
                    </button>
                  )}
                </div>

                {container === 'ev-reth-sequencer' && (
                  <Alert className="border-purple-800 bg-purple-950/20">
                    <Info className="h-4 w-4 text-purple-400" />
                    <AlertDescription className="text-purple-300 text-sm">
                      Este servicio ejecuta ev-reth con el precompile de ANDE en 0x00000000000000000000000000000000000000FD,
                      permitiendo que ANDE funcione como native gas token y ERC20 simultáneamente.
                    </AlertDescription>
                  </Alert>
                )}

                {container === 'local-da' && (
                  <Alert className="border-yellow-800 bg-yellow-950/20">
                    <Info className="h-4 w-4 text-yellow-400" />
                    <AlertDescription className="text-yellow-300 text-sm">
                      En producción, este servicio será reemplazado por Celestia mainnet para Data Availability.
                      Actualmente simula el comportamiento de Celestia para desarrollo.
                    </AlertDescription>
                  </Alert>
                )}
              </TabsContent>
            );
          })}
        </Tabs>
      </div>
    </AndePage>
  );
};

export default LogsPage;

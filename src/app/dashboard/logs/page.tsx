'use client';

import { useState, useEffect, useRef } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const containers = ['All', 'single-sequencer', 'ev-reth-sequencer', 'local-da'];
const MAX_LOGS = 200;

const getContainerColor = (container: string) => {
  switch (container) {
    case 'single-sequencer': return 'text-blue-400';
    case 'ev-reth-sequencer': return 'text-purple-400';
    case 'local-da': return 'text-yellow-400';
    default: return 'text-gray-400';
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
    <div className="p-4 h-full flex flex-col">
      <h1 className="text-2xl font-bold mb-4">Live Logs</h1>
      <Tabs defaultValue="All" className="flex-1 flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            {containers.map(container => (
              <TabsTrigger key={container} value={container}>{container}</TabsTrigger>
            ))}
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
        {containers.map(container => (
          <TabsContent key={container} value={container} className="flex-1 bg-gray-900 text-white font-mono text-sm rounded-lg p-4 relative">
            <div className="absolute inset-0 overflow-y-scroll" onWheel={handleScroll}>
              {(logs[container] || []).map((log, index) => (
                <div key={index}>
                  <span className="text-gray-500">{log.timestamp}</span> <span className={getContainerColor(log.container)}>[{log.container}]</span> {log.line}
                </div>
              ))}
              <div ref={el => logsEndRefs.current[container] = el} />
            </div>
            {!autoScroll && (
              <button onClick={() => scrollToBottom(container)} className="absolute bottom-4 right-4 px-4 py-2 bg-gray-700 text-white rounded-md">
                Scroll to Bottom
              </button>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default LogsPage;

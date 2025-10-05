'use client';

import { useState, useMemo } from 'react';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { FileCode, Send, Loader, CheckCircle, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { parseEther, formatEther, isAddress } from 'viem';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Textarea } from "@/components/ui/textarea";

function DynamicFunction({ abiItem, contractAddress }) {
  const [inputs, setInputs] = useState({});
  const [result, setResult] = useState(null);

  const isRead = abiItem.stateMutability === 'view' || abiItem.stateMutability === 'pure';

  const { data: readData, error: readError, isLoading: isReading } = useReadContract({
    address: isAddress(contractAddress) ? contractAddress : undefined,
    abi: [abiItem],
    functionName: abiItem.name,
    args: abiItem.inputs.map(input => inputs[input.name]),
    query: {
      enabled: isRead && abiItem.inputs.every(input => inputs[input.name] !== undefined),
    },
  });

  const { data: hash, writeContract, isPending, isError } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });

  const handleInputChange = (name, value) => {
    setInputs(prev => ({ ...prev, [name]: value }));
  };

  const handleAction = () => {
    if (isRead) {
      // For read, data is fetched automatically by wagmi
    } else {
      writeContract({
        address: contractAddress,
        abi: [abiItem],
        functionName: abiItem.name,
        args: abiItem.inputs.map(input => inputs[input.name]),
      });
    }
  };

  return (
    <div className="p-4 border rounded-lg space-y-2">
      <h4 className="font-semibold">{abiItem.name}</h4>
      {abiItem.inputs.map((input, index) => (
        <Input
          key={index}
          placeholder={`${input.name} (${input.type})`}
          onChange={(e) => handleInputChange(input.name, e.target.value)}
        />
      ))}
      <Button onClick={handleAction} disabled={isPending || isConfirming || isReading} className="w-full">
        {isRead ? (isReading ? 'Leyendo...' : 'Leer') : (isPending || isConfirming ? 'Escribiendo...' : 'Escribir')}
      </Button>
      {readData && <p>Resultado: {readData.toString()}</p>}
      {hash && <p>Hash: {hash}</p>}
      {isConfirmed && <p>Confirmado!</p>}
      {isError && <p>Error en la escritura.</p>}
      {readError && <p>Error en la lectura.</p>}
    </div>
  );
}

export function ContractInteraction() {
  const [contractAddress, setContractAddress] = useState('');
  const [abiString, setAbiString] = useState('');
  const [abi, setAbi] = useState(null);
  const [showAbiInput, setShowAbiInput] = useState(true);

  const { readFunctions, writeFunctions } = useMemo(() => {
    if (!abi) return { readFunctions: [], writeFunctions: [] };
    const reads = abi.filter(item => item.type === 'function' && (item.stateMutability === 'view' || item.stateMutability === 'pure'));
    const writes = abi.filter(item => item.type === 'function' && item.stateMutability !== 'view' && item.stateMutability !== 'pure');
    return { readFunctions: reads, writeFunctions: writes };
  }, [abi]);

  const handleAbiChange = (e) => {
    const newAbiString = e.target.value;
    setAbiString(newAbiString);
    try {
      const parsedAbi = JSON.parse(newAbiString);
      if (Array.isArray(parsedAbi)) {
        setAbi(parsedAbi);
      }
    } catch (error) {
      setAbi(null);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>📜 Interacción Dinámica con Contratos</CardTitle>
        <CardDescription>Pega un ABI y la dirección de un contrato para interactuar con él.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium">Dirección del Contrato</label>
          <Input
            type="text"
            value={contractAddress}
            onChange={(e) => setContractAddress(e.target.value)}
            placeholder="0x..."
            className="font-mono"
          />
        </div>
        
        <div className="space-y-2">
            <Button variant="outline" size="sm" onClick={() => setShowAbiInput(!showAbiInput)} className="w-full flex justify-between items-center">
                <span>{showAbiInput ? 'Ocultar' : 'Mostrar'} Editor de ABI</span>
                {showAbiInput ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </Button>
            {showAbiInput && (
                <Textarea
                    value={abiString}
                    onChange={handleAbiChange}
                    placeholder='[{"inputs":[...],"name":"...","outputs":[...],"stateMutability":"...","type":"function"},...]'
                    className="font-mono h-48"
                />
            )}
        </div>

        {isAddress(contractAddress) && abi ? (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Funciones de Lectura (Read)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {readFunctions.length > 0 ? (
                  readFunctions.map((item, index) => (
                    <DynamicFunction key={index} abiItem={item} contractAddress={contractAddress} />
                  ))
                ) : <p>No se encontraron funciones de solo lectura en el ABI.</p>}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Funciones de Escritura (Write)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {writeFunctions.length > 0 ? (
                  writeFunctions.map((item, index) => (
                    <DynamicFunction key={index} abiItem={item} contractAddress={contractAddress} />
                  ))
                ) : <p>No se encontraron funciones de escritura en el ABI.</p>}
              </CardContent>
            </Card>
          </div>
        ) : (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Ingresa una dirección de contrato válida y un ABI en formato JSON para comenzar.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}

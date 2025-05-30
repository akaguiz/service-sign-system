
import React, { useRef, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Eraser, Pen } from 'lucide-react';

interface SignatureCanvasProps {
  onSignatureChange: (signature: string) => void;
  width?: number;
  height?: number;
}

const SignatureCanvas: React.FC<SignatureCanvasProps> = ({ 
  onSignatureChange, 
  width = 400, 
  height = 200 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isEmpty, setIsEmpty] = useState(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    // Configurar o canvas
    context.strokeStyle = '#000000';
    context.lineWidth = 2;
    context.lineCap = 'round';
    context.lineJoin = 'round';
  }, []);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const context = canvas.getContext('2d');
    if (context) {
      context.beginPath();
      context.moveTo(x, y);
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const context = canvas.getContext('2d');
    if (context) {
      context.lineTo(x, y);
      context.stroke();
      setIsEmpty(false);
      onSignatureChange(canvas.toDataURL());
    }
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (context) {
      context.clearRect(0, 0, canvas.width, canvas.height);
      setIsEmpty(true);
      onSignatureChange('');
    }
  };

  return (
    <div className="space-y-4">
      <div className="border-2 border-gray-300 rounded-lg p-4 bg-white">
        <canvas
          ref={canvasRef}
          width={width}
          height={height}
          className="border border-gray-200 rounded cursor-crosshair w-full"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          style={{ touchAction: 'none' }}
        />
      </div>
      <div className="flex justify-between items-center">
        <div className="flex items-center text-sm text-gray-600">
          <Pen className="w-4 h-4 mr-2" />
          Assine com o mouse no campo acima
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={clearSignature}
          disabled={isEmpty}
        >
          <Eraser className="w-4 h-4 mr-2" />
          Limpar
        </Button>
      </div>
    </div>
  );
};

export default SignatureCanvas;

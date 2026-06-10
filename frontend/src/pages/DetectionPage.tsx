import React, { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadCloud, Image as ImageIcon, AlertCircle, Clock, CheckCircle2, Download } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';

interface PredictionResult {
  annotated_image: string;
  detections_count: number;
  confidence_scores: number[];
  processing_time: number;
  message?: string;
}

export const DetectionPage: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) {
      setError("Please select an image file.");
      return;
    }
    setError(null);
    setSelectedFile(file);
    setResult(null);
    
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  }, []);

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  }, [handleFileSelect]);

  const handlePredict = async () => {
    if (!selectedFile) return;
    
    setIsLoading(true);
    setError(null);
    
    const formData = new FormData();
    formData.append('file', selectedFile);

    const apiUrl = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

    try {
      const response = await fetch(`${apiUrl}/predict`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Prediction request failed. Is the backend running?');
      }

      const data: PredictionResult = await response.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message || "An error occurred during prediction.");
    } finally {
      setIsLoading(false);
    }
  };

  const clearSelection = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const avgConfidence = result?.confidence_scores?.length 
    ? (result.confidence_scores.reduce((a, b) => a + b, 0) / result.confidence_scores.length * 100).toFixed(1)
    : 0;

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Pothole Detection</h1>
        <p className="text-foreground/60">Upload an image to identify road damage instantly.</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Upload Section */}
        <div className="space-y-6">
          <Card className="glass border-white/10">
            <CardHeader>
              <CardTitle>Image Upload</CardTitle>
              <CardDescription>Drag & drop or click to select</CardDescription>
            </CardHeader>
            <CardContent>
              <div 
                className={`relative border-2 border-dashed rounded-xl p-8 transition-all flex flex-col items-center justify-center min-h-[300px] text-center
                  ${isDragging ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50 hover:bg-white/[0.02]'}
                  ${!selectedFile && isLoading ? 'animate-pulse-slow border-primary/50' : ''}
                `}
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                onDrop={onDrop}
                onClick={() => !selectedFile && fileInputRef.current?.click()}
              >
                <input 
                  type="file" 
                  ref={fileInputRef}
                  className="hidden" 
                  accept="image/*"
                  onChange={(e) => e.target.files && handleFileSelect(e.target.files[0])}
                />

                <AnimatePresence mode="wait">
                  {!selectedFile ? (
                    <motion.div 
                      key="upload-prompt"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex flex-col items-center cursor-pointer"
                    >
                      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 text-primary">
                        <UploadCloud className="w-8 h-8" />
                      </div>
                      <p className="text-lg font-medium mb-1">Click or drag image here</p>
                      <p className="text-sm text-foreground/50">Supports JPG, PNG, WEBP</p>
                    </motion.div>
                  ) : (
                    <motion.div 
                      key="preview"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="w-full h-full flex flex-col items-center"
                    >
                      <div className="relative w-full rounded-lg overflow-hidden mb-4 group aspect-video bg-black/40 flex items-center justify-center">
                        {previewUrl && (
                          <img 
                            src={previewUrl} 
                            alt="Preview" 
                            className="max-w-full max-h-[300px] object-contain"
                          />
                        )}
                        {isLoading && (
                          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex flex-col items-center justify-center">
                            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
                            <p className="font-medium animate-pulse text-primary">Analyzing Model...</p>
                          </div>
                        )}
                      </div>
                      <div className="flex gap-4 w-full">
                        <Button variant="outline" className="flex-1" onClick={clearSelection} disabled={isLoading}>
                          Clear
                        </Button>
                        <Button className="flex-1" onClick={handlePredict} disabled={isLoading || !!result}>
                          {isLoading ? 'Processing...' : 'Run Detection'}
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 p-4 rounded-md bg-danger/10 border border-danger/20 text-danger flex items-center gap-3"
                >
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <p className="text-sm">{error}</p>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Results Section */}
        <div className="space-y-6">
          <Card className="glass border-white/10 h-full flex flex-col">
            <CardHeader>
              <CardTitle>Analysis Results</CardTitle>
              <CardDescription>AI detection breakdown</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              {!result ? (
                <div className="flex-1 flex flex-col items-center justify-center text-foreground/40 min-h-[300px]">
                  <ImageIcon className="w-12 h-12 mb-4 opacity-50" />
                  <p>Results will appear here after analysis</p>
                </div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col gap-6"
                >
                  {result.message && (
                     <div className="p-3 rounded-md bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 text-sm">
                       {result.message}
                     </div>
                  )}
                  
                  {/* Stats Grid */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-white/5 border border-white/10 rounded-lg p-4 flex flex-col items-center text-center">
                      <AlertCircle className="w-5 h-5 text-red-400 mb-2" />
                      <span className="text-2xl font-bold text-red-400">{result.detections_count}</span>
                      <span className="text-xs text-foreground/60 uppercase tracking-wider mt-1">Detections</span>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-lg p-4 flex flex-col items-center text-center">
                      <CheckCircle2 className="w-5 h-5 text-green-400 mb-2" />
                      <span className="text-2xl font-bold text-green-400">{avgConfidence}%</span>
                      <span className="text-xs text-foreground/60 uppercase tracking-wider mt-1">Avg Conf</span>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-lg p-4 flex flex-col items-center text-center">
                      <Clock className="w-5 h-5 text-blue-400 mb-2" />
                      <span className="text-2xl font-bold text-blue-400">{result.processing_time}</span>
                      <span className="text-xs text-foreground/60 uppercase tracking-wider mt-1">Time (ms)</span>
                    </div>
                  </div>

                  {/* Image Result */}
                  <div className="relative rounded-lg overflow-hidden border border-white/10 bg-black/50 aspect-video flex items-center justify-center group">
                    <img 
                      src={result.annotated_image} 
                      alt="Annotated Results" 
                      className="max-w-full max-h-[350px] object-contain"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                       <Button variant="outline" className="gap-2" onClick={() => {
                         const a = document.createElement('a');
                         a.href = result.annotated_image;
                         a.download = 'roadguard-result.jpg';
                         a.click();
                       }}>
                         <Download className="w-4 h-4" /> Download Annotated
                       </Button>
                    </div>
                  </div>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

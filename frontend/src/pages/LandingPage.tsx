import React from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, Zap, Activity, ChevronRight } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';

const features = [
  {
    title: "Real-time Detection",
    description: "Lightning fast YOLO-based inference delivering immediate results for road safety.",
    icon: Zap,
    color: "text-blue-500"
  },
  {
    title: "High Accuracy",
    description: "Custom trained SAM model ensures minimal false positives in diverse lighting conditions.",
    icon: Activity,
    color: "text-green-500"
  },
  {
    title: "Safety First",
    description: "Identify and report severe road damage before accidents occur.",
    icon: ShieldAlert,
    color: "text-red-500"
  }
];

export const LandingPage: React.FC<{ onNavigate: (page: 'landing' | 'detection') => void }> = ({ onNavigate }) => {
  return (
    <div className="flex flex-col items-center w-full">
      {/* Hero Section */}
      <section className="w-full py-24 md:py-32 flex flex-col items-center text-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-[800px] flex flex-col items-center"
        >
          <div className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-sm text-primary mb-6">
            <span className="flex h-2 w-2 rounded-full bg-primary mr-2 animate-pulse"></span>
            AI-Powered Infrastructure Intelligence
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 bg-gradient-to-br from-white to-white/50 bg-clip-text text-transparent">
            Next Generation <br className="hidden md:block"/> Pothole Detection
          </h1>
          <p className="text-lg md:text-xl text-foreground/60 mb-10 max-w-[600px]">
            Upload road surface imagery and instantly identify hazards with our custom-trained YOLO architecture. Built for municipal safety and infrastructure maintenance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" onClick={() => onNavigate('detection')} className="gap-2 group">
              Try the Model
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button size="lg" variant="outline">
              View Documentation
            </Button>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="w-full py-20 bg-black/20 border-t border-white/5 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-3 gap-6">
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 + idx * 0.1 }}
              >
                <Card className={`glass hover:bg-white/10 transition-all duration-300 border-white/5 hover:-translate-y-1 hover:${feature.color === 'text-blue-500' ? 'glow-blue' : feature.color === 'text-green-500' ? 'glow-green' : 'glow-red'}`}>
                  <CardHeader>
                    <div className={`w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center mb-4 border border-white/10`}>
                      <feature.icon className={`w-6 h-6 ${feature.color}`} />
                    </div>
                    <CardTitle>{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Examples Section */}
      <section className="w-full py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">Real-World Detections</h2>
            <p className="text-foreground/60 max-w-2xl mx-auto">
              Our model is trained to identify severe road damage across varying environments, angles, and lighting conditions.
            </p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((num) => (
              <motion.div
                key={num}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: num * 0.1 }}
                className="relative group rounded-xl overflow-hidden glass border-white/10 glow-blue hover:-translate-y-2 transition-all duration-300"
              >
                <div className="aspect-[4/3] bg-black/40">
                  <img 
                    src={`/example${num}.png`} 
                    alt={`Pothole Detection Example ${num}`}
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-300"
                  />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                  <div className="flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium">Verified Detection</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

import { useState, useEffect, useRef, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TrendingUp, TrendingDown, Calculator, Target, Percent, DollarSign, AlertTriangle, BarChart3 } from "lucide-react";

const LOT_SIZES: Record<string, number> = {
  NIFTY: 75,
  BANKNIFTY: 35,
  FINNIFTY: 65,
  MIDCPNIFTY: 140,
  NIFTYNEXT50: 25,
  SENSEX: 20,
};

const INSTRUMENTS = Object.keys(LOT_SIZES);

interface CalculationResult {
  pointsCaptured: number;
  profitLoss: number;
  capitalRequired: number;
  roi: number;
  breakevenPrice: number;
  stopLossRisk: number;
  isProfit: boolean;
}

function useAnimatedCounter(targetValue: number, duration: number = 800) {
  const [displayValue, setDisplayValue] = useState(0);
  const animationRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const startValueRef = useRef(0);

  useEffect(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    startValueRef.current = displayValue;
    startTimeRef.current = null;

    const animate = (timestamp: number) => {
      if (!startTimeRef.current) {
        startTimeRef.current = timestamp;
      }

      const elapsed = timestamp - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);
      
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentValue = startValueRef.current + (targetValue - startValueRef.current) * easeOut;

      setDisplayValue(currentValue);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [targetValue, duration]);

  return displayValue;
}

export default function CalculatorPage() {
  const [instrument, setInstrument] = useState<string>("NIFTY");
  const [lotSize, setLotSize] = useState<number>(LOT_SIZES.NIFTY);
  const [entryPrice, setEntryPrice] = useState<string>("");
  const [exitPrice, setExitPrice] = useState<string>("");
  const [numberOfLots, setNumberOfLots] = useState<string>("1");
  const [stopLossPrice, setStopLossPrice] = useState<string>("");
  const [result, setResult] = useState<CalculationResult | null>(null);

  const animatedProfitLoss = useAnimatedCounter(result?.profitLoss ?? 0);

  useEffect(() => {
    setLotSize(LOT_SIZES[instrument] || 75);
  }, [instrument]);

  const calculateResults = useCallback(() => {
    const entry = parseFloat(entryPrice);
    const exit = parseFloat(exitPrice);
    const lots = parseInt(numberOfLots) || 1;
    const stopLoss = parseFloat(stopLossPrice);

    if (isNaN(entry) || isNaN(exit) || entry <= 0) {
      setResult(null);
      return;
    }

    const pointsCaptured = exit - entry;
    const totalQuantity = lotSize * lots;
    const profitLoss = pointsCaptured * totalQuantity;
    const capitalRequired = entry * totalQuantity;
    const roi = capitalRequired > 0 ? (profitLoss / capitalRequired) * 100 : 0;
    const breakevenPrice = entry;
    
    let stopLossRisk = 0;
    if (!isNaN(stopLoss) && stopLoss > 0) {
      stopLossRisk = Math.abs(entry - stopLoss) * totalQuantity;
    }

    setResult({
      pointsCaptured,
      profitLoss,
      capitalRequired,
      roi,
      breakevenPrice,
      stopLossRisk,
      isProfit: profitLoss >= 0,
    });
  }, [entryPrice, exitPrice, numberOfLots, stopLossPrice, lotSize]);

  useEffect(() => {
    calculateResults();
  }, [calculateResults]);

  const handleQuickProfit = (points: number) => {
    const entry = parseFloat(entryPrice);
    if (!isNaN(entry) && entry > 0) {
      setExitPrice((entry + points).toString());
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(value);
  };

  const formatNumber = (value: number, decimals: number = 2) => {
    return value.toFixed(decimals);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 md:p-8 relative overflow-hidden">
      <div 
        className="fixed inset-0 z-0"
        style={{
          background: "linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)",
        }}
      />
      
      <div className="fixed inset-0 z-0 opacity-30">
        <div 
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl"
          style={{ background: "radial-gradient(circle, rgba(0,212,255,0.15) 0%, transparent 70%)" }}
        />
        <div 
          className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full blur-3xl"
          style={{ background: "radial-gradient(circle, rgba(0,153,255,0.1) 0%, transparent 70%)" }}
        />
      </div>

      <Card 
        className="relative z-10 w-full max-w-5xl border border-white/10 shadow-2xl"
        style={{
          background: "rgba(255, 255, 255, 0.05)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderRadius: "20px",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5), inset 0 1px 0 0 rgba(255, 255, 255, 0.1)",
        }}
      >
        <div className="p-6 md:p-8">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-2">
              <div 
                className="p-2 rounded-xl"
                style={{
                  background: "linear-gradient(135deg, rgba(0,212,255,0.2) 0%, rgba(0,153,255,0.2) 100%)",
                  boxShadow: "0 0 20px rgba(0,212,255,0.3)",
                }}
              >
                <Calculator className="w-6 h-6 text-cyan-400" />
              </div>
              <h1 
                className="text-2xl md:text-3xl font-bold text-white"
                style={{ textShadow: "0 0 30px rgba(0,212,255,0.3)" }}
                data-testid="text-title"
              >
                Option Scalper Calculator
              </h1>
            </div>
            <p className="text-white/60 text-sm" data-testid="text-subtitle">
              Premium calculator for Indian derivatives market
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="space-y-4">
                <h2 className="text-xs font-medium uppercase tracking-wider text-white/50 flex items-center gap-2">
                  <BarChart3 className="w-4 h-4" />
                  Input Parameters
                </h2>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="instrument" className="text-white/70 text-sm">
                      Instrument
                    </Label>
                    <Select value={instrument} onValueChange={setInstrument}>
                      <SelectTrigger 
                        id="instrument"
                        data-testid="select-instrument"
                        className="w-full bg-white/5 border-white/10 text-white focus:ring-cyan-400/50 focus:border-cyan-400/50 transition-all duration-300 hover:bg-white/10"
                        style={{ borderRadius: "14px" }}
                      >
                        <SelectValue placeholder="Select instrument" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-900/95 border-white/10 backdrop-blur-xl">
                        {INSTRUMENTS.map((inst) => (
                          <SelectItem 
                            key={inst} 
                            value={inst}
                            className="text-white hover:bg-white/10 focus:bg-white/10"
                            data-testid={`option-instrument-${inst}`}
                          >
                            {inst} (Lot: {LOT_SIZES[inst]})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lotSize" className="text-white/70 text-sm">
                      Lot Size
                    </Label>
                    <Input
                      id="lotSize"
                      type="number"
                      value={lotSize}
                      readOnly
                      data-testid="input-lot-size"
                      className="w-full bg-white/5 border-white/10 text-white/50 cursor-not-allowed"
                      style={{ borderRadius: "14px" }}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="entryPrice" className="text-white/70 text-sm">
                      Entry Price
                    </Label>
                    <Input
                      id="entryPrice"
                      type="number"
                      step="0.05"
                      placeholder="Enter entry price"
                      value={entryPrice}
                      onChange={(e) => setEntryPrice(e.target.value)}
                      data-testid="input-entry-price"
                      className="w-full bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 transition-all duration-300 hover:bg-white/10 focus:scale-[1.02] focus:shadow-[0_0_20px_rgba(0,212,255,0.3)]"
                      style={{ borderRadius: "14px" }}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="exitPrice" className="text-white/70 text-sm">
                      Exit Price
                    </Label>
                    <Input
                      id="exitPrice"
                      type="number"
                      step="0.05"
                      placeholder="Enter exit price"
                      value={exitPrice}
                      onChange={(e) => setExitPrice(e.target.value)}
                      data-testid="input-exit-price"
                      className="w-full bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 transition-all duration-300 hover:bg-white/10 focus:scale-[1.02] focus:shadow-[0_0_20px_rgba(0,212,255,0.3)]"
                      style={{ borderRadius: "14px" }}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="numberOfLots" className="text-white/70 text-sm">
                      Number of Lots
                    </Label>
                    <Input
                      id="numberOfLots"
                      type="number"
                      min="1"
                      placeholder="1"
                      value={numberOfLots}
                      onChange={(e) => setNumberOfLots(e.target.value)}
                      data-testid="input-number-of-lots"
                      className="w-full bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 transition-all duration-300 hover:bg-white/10 focus:scale-[1.02] focus:shadow-[0_0_20px_rgba(0,212,255,0.3)]"
                      style={{ borderRadius: "14px" }}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="stopLoss" className="text-white/70 text-sm">
                      Stop-Loss Price (Optional)
                    </Label>
                    <Input
                      id="stopLoss"
                      type="number"
                      step="0.05"
                      placeholder="Enter stop-loss price"
                      value={stopLossPrice}
                      onChange={(e) => setStopLossPrice(e.target.value)}
                      data-testid="input-stop-loss"
                      className="w-full bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 transition-all duration-300 hover:bg-white/10 focus:scale-[1.02] focus:shadow-[0_0_20px_rgba(0,212,255,0.3)]"
                      style={{ borderRadius: "14px" }}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h2 className="text-xs font-medium uppercase tracking-wider text-white/50 flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  Quick Profit Preview
                </h2>
                <div className="flex flex-wrap gap-2">
                  {[1, 2, 5, 10].map((points) => (
                    <Button
                      key={points}
                      variant="outline"
                      onClick={() => handleQuickProfit(points)}
                      disabled={!entryPrice || parseFloat(entryPrice) <= 0}
                      data-testid={`button-quick-profit-${points}`}
                      className="flex-1 min-w-[60px] bg-white/5 border-white/20 text-white hover:bg-cyan-500/20 hover:border-cyan-400/50 hover:text-cyan-300 transition-all duration-300 hover:shadow-[0_0_15px_rgba(0,212,255,0.3)] hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{ borderRadius: "14px" }}
                    >
                      +{points}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h2 className="text-xs font-medium uppercase tracking-wider text-white/50 flex items-center gap-2">
                {result && result.isProfit ? (
                  <TrendingUp className="w-4 h-4 text-green-400" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-400" />
                )}
                Calculation Results
              </h2>

              {result ? (
                <div 
                  className="p-6 space-y-5 transition-all duration-300 animate-in fade-in-0"
                  style={{
                    background: result.isProfit 
                      ? "rgba(16, 185, 129, 0.1)" 
                      : "rgba(239, 68, 68, 0.1)",
                    border: result.isProfit 
                      ? "1px solid rgba(16, 185, 129, 0.3)" 
                      : "1px solid rgba(239, 68, 68, 0.3)",
                    borderRadius: "14px",
                    boxShadow: result.isProfit
                      ? "inset 0 2px 10px rgba(16, 185, 129, 0.1)"
                      : "inset 0 2px 10px rgba(239, 68, 68, 0.1)",
                  }}
                  data-testid="card-results"
                >
                  <div className="text-center pb-4 border-b border-white/10">
                    <p className="text-white/50 text-xs uppercase tracking-wider mb-2">
                      Profit / Loss
                    </p>
                    <p 
                      className={`text-4xl md:text-5xl font-bold ${
                        result.isProfit ? "text-green-400" : "text-red-400"
                      }`}
                      style={{
                        textShadow: result.isProfit 
                          ? "0 0 30px rgba(16, 185, 129, 0.5)" 
                          : "0 0 30px rgba(239, 68, 68, 0.5)",
                      }}
                      data-testid="text-profit-loss"
                    >
                      {formatCurrency(animatedProfitLoss)}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-white/50 text-xs">
                        <TrendingUp className="w-3 h-3" />
                        Points Captured
                      </div>
                      <p className="text-white text-lg font-semibold" data-testid="text-points-captured">
                        {formatNumber(result.pointsCaptured)}
                      </p>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-white/50 text-xs">
                        <DollarSign className="w-3 h-3" />
                        Capital Required
                      </div>
                      <p className="text-white text-lg font-semibold" data-testid="text-capital-required">
                        {formatCurrency(result.capitalRequired)}
                      </p>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-white/50 text-xs">
                        <Percent className="w-3 h-3" />
                        ROI
                      </div>
                      <p 
                        className={`text-lg font-semibold ${
                          result.roi >= 0 ? "text-green-400" : "text-red-400"
                        }`}
                        data-testid="text-roi"
                      >
                        {formatNumber(result.roi)}%
                      </p>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-white/50 text-xs">
                        <Target className="w-3 h-3" />
                        Breakeven Price
                      </div>
                      <p className="text-white text-lg font-semibold" data-testid="text-breakeven">
                        {formatNumber(result.breakevenPrice)}
                      </p>
                    </div>
                  </div>

                  {result.stopLossRisk > 0 && (
                    <div 
                      className="mt-4 p-4 border border-red-500/30 bg-red-500/10"
                      style={{ borderRadius: "10px" }}
                    >
                      <div className="flex items-center gap-2 text-red-400 text-xs mb-1">
                        <AlertTriangle className="w-4 h-4" />
                        Stop-Loss Risk
                      </div>
                      <p 
                        className="text-red-400 text-xl font-bold"
                        data-testid="text-stop-loss-risk"
                      >
                        {formatCurrency(result.stopLossRisk)}
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div 
                  className="p-8 flex flex-col items-center justify-center text-center"
                  style={{
                    background: "rgba(255, 255, 255, 0.02)",
                    border: "1px dashed rgba(255, 255, 255, 0.1)",
                    borderRadius: "14px",
                    minHeight: "300px",
                  }}
                  data-testid="card-empty-state"
                >
                  <div 
                    className="p-4 rounded-full mb-4"
                    style={{ background: "rgba(255, 255, 255, 0.05)" }}
                  >
                    <Calculator className="w-10 h-10 text-white/30" />
                  </div>
                  <p className="text-white/40 text-sm">
                    Enter entry and exit prices to see your calculation results
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

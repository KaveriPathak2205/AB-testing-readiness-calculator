import { useState, useMemo } from "react";
import { Slider } from "@/components/ui/slider";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle2, AlertTriangle, XCircle, ArrowRight, RotateCcw } from "lucide-react";

interface CalculatorInputs {
  monthlyVisitors: number;
  conversionRate: number;
  expectedLift: number;
  confidenceLevel: number;
  hypothesis: string;
  companySize: string;
  testDuration: number;
}

const Calculator = () => {
  const [inputs, setInputs] = useState<CalculatorInputs>({
    monthlyVisitors: 10000,
    conversionRate: 3,
    expectedLift: 10,
    confidenceLevel: 95,
    hypothesis: "",
    companySize: "",
    testDuration: 14,
  });

  const [showResults, setShowResults] = useState(false);

  const results = useMemo(() => {
    const { monthlyVisitors, conversionRate, expectedLift, confidenceLevel } = inputs;
    
    // Calculate required sample size using simplified formula
    // Based on: n = 2 * (Z_alpha/2 + Z_beta)^2 * p * (1-p) / (delta)^2
    const p = conversionRate / 100;
    const delta = (conversionRate * expectedLift / 100) / 100;
    
    // Z-scores for common confidence levels
    const zScores: Record<number, number> = {
      90: 1.645,
      95: 1.96,
      99: 2.576,
    };
    const zAlpha = zScores[confidenceLevel] || 1.96;
    const zBeta = 0.84; // 80% power
    
    // Sample size per variation
    const sampleSize = Math.ceil(
      2 * Math.pow(zAlpha + zBeta, 2) * p * (1 - p) / Math.pow(delta, 2)
    );
    
    // Total sample needed (control + variation)
    const totalSampleNeeded = sampleSize * 2;
    
    // Days needed to reach sample size
    const dailyVisitors = monthlyVisitors / 30;
    const daysNeeded = Math.ceil(totalSampleNeeded / dailyVisitors);
    
    // Determine readiness
    let readiness: "ready" | "caution" | "not-ready";
    let message: string;
    let recommendation: string;
    
    if (daysNeeded <= inputs.testDuration) {
      readiness = "ready";
      message = "You're ready for A/B testing!";
      recommendation = `With your current traffic, you can reach statistical significance within your planned ${inputs.testDuration}-day test period. Start with high-impact changes for best results.`;
    } else if (daysNeeded <= inputs.testDuration * 2) {
      readiness = "caution";
      message = "A/B testing is possible, but may exceed your timeline";
      recommendation = `Your test needs ~${daysNeeded} days but you planned for ${inputs.testDuration} days. Consider testing larger changes or extending your test period.`;
    } else {
      readiness = "not-ready";
      message = "A/B testing may not be ideal right now";
      recommendation = `You'd need ~${daysNeeded} days, far exceeding your ${inputs.testDuration}-day plan. Consider qualitative research, building more traffic, or testing larger changes (20%+ expected lift).`;
    }
    
    return {
      sampleSize,
      totalSampleNeeded,
      daysNeeded,
      dailyVisitors: Math.round(dailyVisitors),
      readiness,
      message,
      recommendation,
    };
  }, [inputs]);

  const handleReset = () => {
    setShowResults(false);
    setInputs({
      monthlyVisitors: 10000,
      conversionRate: 3,
      expectedLift: 10,
      confidenceLevel: 95,
      hypothesis: "",
      companySize: "",
      testDuration: 14,
    });
  };

  const companySizes = [
    { value: "startup", label: "Startup (1-10)" },
    { value: "small", label: "Small (11-50)" },
    { value: "medium", label: "Mid-size (51-200)" },
    { value: "large", label: "Large (201-1000)" },
    { value: "enterprise", label: "Enterprise (1000+)" },
  ];

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat().format(num);
  };

  const ReadinessIcon = () => {
    switch (results.readiness) {
      case "ready":
        return <CheckCircle2 className="w-12 h-12 text-success" />;
      case "caution":
        return <AlertTriangle className="w-12 h-12 text-warning" />;
      default:
        return <XCircle className="w-12 h-12 text-destructive" />;
    }
  };

  const getReadinessStyles = () => {
    switch (results.readiness) {
      case "ready":
        return "border-success/30 bg-success/5";
      case "caution":
        return "border-warning/30 bg-warning/5";
      default:
        return "border-destructive/30 bg-destructive/5";
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {!showResults ? (
        <Card className="p-8 shadow-card gradient-card animate-fade-in">
          <div className="space-y-8">
            {/* Monthly Visitors */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-foreground">
                  Monthly Visitors
                </label>
                <span className="text-2xl font-bold text-primary">
                  {formatNumber(inputs.monthlyVisitors)}
                </span>
              </div>
              <Slider
                value={[inputs.monthlyVisitors]}
                onValueChange={([value]) => setInputs(prev => ({ ...prev, monthlyVisitors: value }))}
                min={1000}
                max={1000000}
                step={1000}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>1K</span>
                <span>1M</span>
              </div>
            </div>

            {/* Conversion Rate */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-foreground">
                  Current Conversion Rate
                </label>
                <span className="text-2xl font-bold text-primary">
                  {inputs.conversionRate}%
                </span>
              </div>
              <Slider
                value={[inputs.conversionRate]}
                onValueChange={([value]) => setInputs(prev => ({ ...prev, conversionRate: value }))}
                min={0.5}
                max={20}
                step={0.5}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>0.5%</span>
                <span>20%</span>
              </div>
            </div>

            {/* Expected Lift */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-foreground">
                  Minimum Detectable Effect (Expected Lift)
                </label>
                <span className="text-2xl font-bold text-primary">
                  {inputs.expectedLift}%
                </span>
              </div>
              <Slider
                value={[inputs.expectedLift]}
                onValueChange={([value]) => setInputs(prev => ({ ...prev, expectedLift: value }))}
                min={5}
                max={50}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>5%</span>
                <span>50%</span>
              </div>
            </div>

            {/* Confidence Level */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-foreground">
                  Statistical Confidence Level
                </label>
                <span className="text-2xl font-bold text-primary">
                  {inputs.confidenceLevel}%
                </span>
              </div>
              <div className="flex gap-3">
                {[90, 95, 99].map((level) => (
                  <button
                    key={level}
                    onClick={() => setInputs(prev => ({ ...prev, confidenceLevel: level }))}
                    className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
                      inputs.confidenceLevel === level
                        ? "bg-primary text-primary-foreground shadow-md"
                        : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                    }`}
                  >
                    {level}%
                  </button>
                ))}
              </div>
            </div>

            {/* Test Duration */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-foreground">
                  Planned Test Duration
                </label>
                <span className="text-2xl font-bold text-primary">
                  {inputs.testDuration} days
                </span>
              </div>
              <Slider
                value={[inputs.testDuration]}
                onValueChange={([value]) => setInputs(prev => ({ ...prev, testDuration: value }))}
                min={7}
                max={90}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>7 days</span>
                <span>90 days</span>
              </div>
            </div>

            {/* Company Size */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-foreground">
                  Company Size
                </label>
                <span className="text-xs text-muted-foreground">Optional</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {companySizes.map((size) => (
                  <button
                    key={size.value}
                    onClick={() => setInputs(prev => ({ ...prev, companySize: size.value }))}
                    className={`py-3 px-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                      inputs.companySize === size.value
                        ? "bg-primary text-primary-foreground shadow-md"
                        : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                    }`}
                  >
                    {size.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Hypothesis */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-foreground">
                  Actionable Hypothesis
                </label>
                <span className="text-xs text-muted-foreground">Optional</span>
              </div>
              <Textarea
                value={inputs.hypothesis}
                onChange={(e) => setInputs(prev => ({ ...prev, hypothesis: e.target.value }))}
                placeholder="e.g., Changing the CTA button from 'Sign Up' to 'Start Free Trial' will increase conversions by 15% because it reduces perceived commitment..."
                className="min-h-[100px] resize-none"
              />
            </div>

            <Button
              variant="accent"
              size="xl"
              className="w-full mt-6"
              onClick={() => setShowResults(true)}
            >
              Calculate Readiness
              <ArrowRight className="w-5 h-5" />
            </Button>
          </div>
        </Card>
      ) : (
        <div className="space-y-6 animate-slide-up">
          {/* Main Result Card */}
          <Card className={`p-8 shadow-card border-2 ${getReadinessStyles()}`}>
            <div className="flex flex-col items-center text-center space-y-4">
              <ReadinessIcon />
              <h2 className="text-2xl font-bold text-foreground">
                {results.message}
              </h2>
              <p className="text-muted-foreground max-w-md">
                {results.recommendation}
              </p>
            </div>
          </Card>

          {/* Context Display */}
          {(inputs.hypothesis || inputs.companySize) && (
            <Card className="p-6 shadow-card gradient-card space-y-3">
              {inputs.companySize && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Company Size</p>
                  <p className="text-foreground font-medium">
                    {companySizes.find(s => s.value === inputs.companySize)?.label}
                  </p>
                </div>
              )}
              {inputs.hypothesis && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Your Hypothesis</p>
                  <p className="text-foreground italic">"{inputs.hypothesis}"</p>
                </div>
              )}
            </Card>
          )}

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-6 shadow-card gradient-card text-center">
              <p className="text-sm text-muted-foreground mb-1">Sample Size Needed</p>
              <p className="text-3xl font-bold text-primary">
                {formatNumber(results.totalSampleNeeded)}
              </p>
              <p className="text-xs text-muted-foreground mt-1">visitors total</p>
            </Card>
            <Card className="p-6 shadow-card gradient-card text-center">
              <p className="text-sm text-muted-foreground mb-1">Days to Significance</p>
              <p className="text-3xl font-bold text-primary">
                {results.daysNeeded}
              </p>
              <p className="text-xs text-muted-foreground mt-1">days minimum</p>
            </Card>
            <Card className="p-6 shadow-card gradient-card text-center">
              <p className="text-sm text-muted-foreground mb-1">Daily Visitors</p>
              <p className="text-3xl font-bold text-primary">
                {formatNumber(results.dailyVisitors)}
              </p>
              <p className="text-xs text-muted-foreground mt-1">per day avg</p>
            </Card>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <Button
              variant="outline"
              size="lg"
              className="flex-1"
              onClick={handleReset}
            >
              <RotateCcw className="w-4 h-4" />
              Recalculate
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calculator;

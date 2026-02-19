import { FlaskConical, TrendingUp, Clock } from "lucide-react";

const Hero = () => {
  return (
    <div className="text-center mb-12 animate-fade-in">
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium mb-6">
        <FlaskConical className="w-4 h-4" />
        A/B Testing Readiness Calculator
      </div>
      
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-foreground mb-4 tracking-tight">
        Is it the right time for{" "}
        <span className="text-accent">A/B testing</span>?
      </h1>
      
      <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
        Find out if you have enough traffic to run statistically significant experiments. 
        Don't waste time on tests that won't give you reliable results.
      </p>

      <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-accent" />
          <span>Data-driven decisions</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-accent" />
          <span>Save weeks of testing</span>
        </div>
        <div className="flex items-center gap-2">
          <FlaskConical className="w-4 h-4 text-accent" />
          <span>Statistical confidence</span>
        </div>
      </div>
    </div>
  );
};

export default Hero;

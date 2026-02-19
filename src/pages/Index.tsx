import Hero from "@/components/Hero";
import Calculator from "@/components/Calculator";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-4xl mx-auto px-4 py-12 md:py-20">
        <Hero />
        <Calculator />
        <Footer />
      </div>
    </div>
  );
};

export default Index;

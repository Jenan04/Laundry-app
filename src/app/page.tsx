import React from 'react'
import Header from './component/header';
import HeroSection from './component/heroSection';
import FeaturesSection from './component/featuresSection';
import HowItWorks from './component/howItsWork'
import FAQ from './component/faq'
import Footer from './component/footer'

function page() {
  return (
   <div className="min-h-screen font-sans">
      <Header />
      <hr/>
      <HeroSection />
      <FeaturesSection />
      <HowItWorks />
      <FAQ />
      <Footer />

    </div>  
  )
}

export default page
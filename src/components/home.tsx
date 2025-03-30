import React from "react";
import { Helmet } from "react-helmet";
import LoanApplicationWidget from "./LoanApplicationWidget";
import { cn } from "../lib/utils";

interface HomeProps {
  title?: string;
  description?: string;
  backgroundColor?: string;
}

const Home: React.FC<HomeProps> = ({
  title = "Hard Money Mortgage Loan Application",
  description = "Apply for a hard money mortgage loan with our simple application process. Get quick funding for your real estate investment.",
  backgroundColor = "#f8fafc", // light gray background
}) => {
  // Handle application submission
  const handleApplicationSubmit = async (applicationData: any) => {
    console.log("Application submitted:", applicationData);
    // In a real implementation, this would call the NotionService and EmailService
    // to save the data and send notifications
  };

  return (
    <div
      className="min-h-screen w-full bg-background"
      style={{ backgroundColor }}
    >
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Helmet>

      <header className="w-full bg-white shadow-sm py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-primary">
              Mortgage Funding Partners
            </h1>
            <p className="text-sm text-muted-foreground">
              Fast & Reliable Hard Money Loans
            </p>
          </div>
          <div>
            <a
              href="#contact"
              className={cn(
                "px-4 py-2 rounded-md bg-primary text-white",
                "hover:bg-primary/90 transition-colors",
              )}
            >
              Contact Us
            </a>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <section className="mb-12 text-center">
            <h2 className="text-3xl font-bold mb-4">
              Apply for a Hard Money Mortgage Loan
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Complete the application below to get started with your hard money
              loan. Our team will review your information and contact you within
              24-48 hours.
            </p>
          </section>

          <section className="mb-16">
            <LoanApplicationWidget
              widgetTitle="Hard Money Mortgage Loan Application"
              widgetDescription="Fill out the form below to apply for funding. All information is kept confidential."
              primaryColor="#1e40af" // deep blue
              onApplicationSubmit={handleApplicationSubmit}
            />
          </section>

          <section
            id="contact"
            className="bg-white rounded-xl shadow-md p-8 mb-12"
          >
            <h2 className="text-2xl font-bold mb-4">Have Questions?</h2>
            <p className="mb-6">
              Our loan specialists are here to help you with any questions about
              the application process or our loan programs.
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-start space-x-4">
                <div className="bg-primary/10 p-3 rounded-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-primary"
                  >
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold">Call Us</h3>
                  <p className="text-muted-foreground">(888) 555-1234</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Mon-Fri: 9am-5pm EST
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-primary/10 p-3 rounded-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-primary"
                  >
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold">Email Us</h3>
                  <p className="text-muted-foreground">
                    loans@mortgagefundingpartners.com
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    We typically respond within 24 hours
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">
                Mortgage Funding Partners
              </h3>
              <p className="text-gray-400">
                Providing fast and reliable hard money loans for real estate
                investors since 2010.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Home
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    About Us
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Loan Programs
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    FAQ
                  </a>
                </li>
                <li>
                  <a
                    href="#contact"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    NMLS #123456
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-6 text-center text-gray-500">
            <p>
              &copy; {new Date().getFullYear()} Mortgage Funding Partners. All
              rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;

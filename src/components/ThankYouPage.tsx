import React from "react";
import { Button } from "./ui/button";
import { CheckCircle, Calendar, Phone, Mail } from "lucide-react";
import { Link } from "react-router-dom";

interface ThankYouPageProps {
  applicantName?: string;
  applicationId?: string;
  estimatedResponseTime?: string;
  contactEmail?: string;
  contactPhone?: string;
}

const ThankYouPage: React.FC<ThankYouPageProps> = ({
  applicantName = "John",
  applicationId = "LN-2023-7845",
  estimatedResponseTime = "24-48 hours",
  contactEmail = "loans@hardmoneylender.com",
  contactPhone = "(555) 123-4567",
}) => {
  // Clear saved form data from localStorage when thank you page is shown
  React.useEffect(() => {
    try {
      localStorage.removeItem("loanApplicationProgress");
    } catch (error) {
      console.error("Error clearing localStorage:", error);
    }
  }, []);
  return (
    <div className="w-full max-w-3xl mx-auto p-8 rounded-lg shadow-lg bg-white">
      <div className="flex flex-col items-center text-center mb-8">
        <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
          <CheckCircle className="h-10 w-10 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Thank You!</h1>
        <p className="text-xl text-gray-700 mb-2">
          Your loan application has been submitted successfully.
        </p>
        <div className="bg-gray-100 px-4 py-2 rounded-md text-gray-700 font-medium">
          Application ID: {applicationId}
        </div>
      </div>

      <div className="space-y-6 mb-8">
        <div className="bg-blue-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">
            What Happens Next?
          </h2>
          <ul className="space-y-3">
            <li className="flex items-start">
              <div className="flex-shrink-0 h-6 w-6 text-blue-600 mr-2">
                <Calendar className="h-5 w-5" />
              </div>
              <div>
                <p className="text-gray-700">
                  Our loan officers will review your application within{" "}
                  <span className="font-medium">{estimatedResponseTime}</span>.
                </p>
              </div>
            </li>
            <li className="flex items-start">
              <div className="flex-shrink-0 h-6 w-6 text-blue-600 mr-2">
                <Mail className="h-5 w-5" />
              </div>
              <div>
                <p className="text-gray-700">
                  You'll receive a confirmation email with your application
                  details.
                </p>
              </div>
            </li>
            <li className="flex items-start">
              <div className="flex-shrink-0 h-6 w-6 text-blue-600 mr-2">
                <Phone className="h-5 w-5" />
              </div>
              <div>
                <p className="text-gray-700">
                  A loan specialist will contact you to discuss next steps and
                  any additional documentation needed.
                </p>
              </div>
            </li>
          </ul>
        </div>

        <div className="border border-gray-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">
            Need Assistance?
          </h2>
          <p className="text-gray-700 mb-4">
            If you have any questions or need to provide additional information,
            please don't hesitate to contact us:
          </p>
          <div className="space-y-2">
            <div className="flex items-center">
              <Phone className="h-5 w-5 text-gray-500 mr-2" />
              <a
                href={`tel:${contactPhone}`}
                className="text-blue-600 hover:underline"
              >
                {contactPhone}
              </a>
            </div>
            <div className="flex items-center">
              <Mail className="h-5 w-5 text-gray-500 mr-2" />
              <a
                href={`mailto:${contactEmail}`}
                className="text-blue-600 hover:underline"
              >
                {contactEmail}
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <Button variant="outline" asChild>
          <Link to="/">Return to Home</Link>
        </Button>
        <Button asChild>
          <a href="#" onClick={(e) => e.preventDefault()}>
            Track Application Status
          </a>
        </Button>
      </div>
    </div>
  );
};

export default ThankYouPage;

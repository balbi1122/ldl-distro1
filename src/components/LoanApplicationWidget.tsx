import React, { useState } from "react";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle } from "lucide-react";

import ProgressIndicator from "./ProgressIndicator";
import PersonalInformationForm from "./forms/PersonalInformationForm";
import PropertyDetailsForm from "./forms/PropertyDetailsForm";
import LoanRequirementsForm from "./forms/LoanRequirementsForm";
import ApplicationReview from "./ApplicationReview";
import ThankYouPage from "./ThankYouPage";
import NavigationControls from "./NavigationControls";
import { Alert, AlertDescription } from "./ui/alert";

// Define schemas for each form step
const personalInfoSchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(10),
  address: z.string().min(5),
  city: z.string().min(2),
  state: z.string().min(2),
  zipCode: z.string().min(5),
  creditScore: z.string(),
  annualIncome: z.string(),
});

const propertyDetailsSchema = z.object({
  propertyAddress: z.string().min(5),
  propertyCity: z.string().min(2),
  propertyState: z.string().min(2),
  propertyZip: z.string().min(5),
  propertyType: z.string().min(1),
  propertyValue: z.string().min(1),
  purchasePrice: z.string().min(1),
  yearBuilt: z.string().min(4),
  squareFootage: z.string().min(1),
  propertyDescription: z.string().optional(),
});

const loanRequirementsSchema = z.object({
  loanAmount: z.string().min(1),
  loanPurpose: z.string().min(1),
  loanTerm: z.string().min(1),
  exitStrategy: z.string().min(1),
  timeframe: z.string().min(1),
  additionalInfo: z.string().optional(),
});

type PersonalInfoData = z.infer<typeof personalInfoSchema>;
type PropertyDetailsData = z.infer<typeof propertyDetailsSchema>;
type LoanRequirementsData = z.infer<typeof loanRequirementsSchema>;

interface LoanApplicationWidgetProps {
  widgetTitle?: string;
  widgetDescription?: string;
  notionDatabaseId?: string;
  sendgridTemplateId?: string;
  primaryColor?: string;
  onApplicationSubmit?: (applicationData: any) => void;
}

const LoanApplicationWidget: React.FC<LoanApplicationWidgetProps> = ({
  widgetTitle = "Hard Money Mortgage Loan Application",
  widgetDescription = "Complete the form below to apply for a hard money mortgage loan. Our team will review your application and contact you shortly.",
  notionDatabaseId = "",
  sendgridTemplateId = "",
  primaryColor = "#3b82f6", // Default to blue-500
  onApplicationSubmit = () => {},
}) => {
  // Track current step
  const [currentStep, setCurrentStep] = useState(0);

  // Form data state
  const [personalInfo, setPersonalInfo] = useState<PersonalInfoData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    creditScore: "",
    annualIncome: "",
  });

  const [propertyDetails, setPropertyDetails] = useState<PropertyDetailsData>({
    propertyAddress: "",
    propertyCity: "",
    propertyState: "",
    propertyZip: "",
    propertyType: "",
    propertyValue: "",
    purchasePrice: "",
    yearBuilt: "",
    squareFootage: "",
    propertyDescription: "",
  });

  const [loanRequirements, setLoanRequirements] =
    useState<LoanRequirementsData>({
      loanAmount: "",
      loanPurpose: "",
      loanTerm: "",
      exitStrategy: "",
      timeframe: "",
      additionalInfo: "",
    });

  // Track form validation errors
  const [formErrors, setFormErrors] = useState<string[]>([]);

  // Track submission status
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  // Track form completion status for each step
  const [stepsCompleted, setStepsCompleted] = useState<Record<number, boolean>>(
    {
      0: false, // Personal Information
      1: false, // Property Details
      2: false, // Loan Requirements
    },
  );

  // Save form progress to localStorage when steps change
  const saveProgressToLocalStorage = () => {
    try {
      const formData = {
        personalInfo,
        propertyDetails,
        loanRequirements,
        lastUpdated: new Date().toISOString(),
      };
      localStorage.setItem("loanApplicationProgress", JSON.stringify(formData));
    } catch (error) {
      console.error("Error saving progress to localStorage:", error);
    }
  };

  // Load saved progress from localStorage on initial render
  React.useEffect(() => {
    try {
      const savedProgress = localStorage.getItem("loanApplicationProgress");
      if (savedProgress) {
        const parsedData = JSON.parse(savedProgress);
        // Check if data is less than 24 hours old
        const lastUpdated = new Date(parsedData.lastUpdated);
        const now = new Date();
        const hoursDiff =
          (now.getTime() - lastUpdated.getTime()) / (1000 * 60 * 60);

        if (hoursDiff < 24) {
          // Only restore if data is recent
          if (parsedData.personalInfo) setPersonalInfo(parsedData.personalInfo);
          if (parsedData.propertyDetails)
            setPropertyDetails(parsedData.propertyDetails);
          if (parsedData.loanRequirements)
            setLoanRequirements(parsedData.loanRequirements);
        }
      }
    } catch (error) {
      console.error("Error loading progress from localStorage:", error);
    }
  }, []);

  // Save progress whenever form data changes
  React.useEffect(() => {
    saveProgressToLocalStorage();
  }, [personalInfo, propertyDetails, loanRequirements]);

  // Steps configuration
  const steps = [
    "Personal Information",
    "Property Details",
    "Loan Requirements",
    "Review",
  ];

  // Handle form navigation
  const goToNextStep = () => {
    // Validate current step before proceeding
    if (validateCurrentStep()) {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length));
      setFormErrors([]);
    }
  };

  const goToPreviousStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
    setFormErrors([]);
  };

  const goToStep = (step: number) => {
    if (step < currentStep) {
      setCurrentStep(step);
      setFormErrors([]);
    }
  };

  // Validate current step
  const validateCurrentStep = (): boolean => {
    try {
      switch (currentStep) {
        case 0: // Personal Information
          personalInfoSchema.parse(personalInfo);
          return true;
        case 1: // Property Details
          propertyDetailsSchema.parse(propertyDetails);
          return true;
        case 2: // Loan Requirements
          loanRequirementsSchema.parse(loanRequirements);
          return true;
        default:
          return true;
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        setFormErrors(
          error.errors.map((err) => `${err.path.join(".")} - ${err.message}`),
        );
      } else {
        setFormErrors(["An unexpected error occurred. Please try again."]);
      }
      return false;
    }
  };

  // Handle form submissions for each step
  const handlePersonalInfoSubmit = (data: PersonalInfoData) => {
    setPersonalInfo(data);
    setStepsCompleted((prev) => ({ ...prev, 0: true }));
    goToNextStep();
  };

  const handlePropertyDetailsSubmit = (data: PropertyDetailsData) => {
    setPropertyDetails(data);
    setStepsCompleted((prev) => ({ ...prev, 1: true }));
    goToNextStep();
  };

  const handleLoanRequirementsSubmit = (data: LoanRequirementsData) => {
    setLoanRequirements(data);
    setStepsCompleted((prev) => ({ ...prev, 2: true }));
    goToNextStep();
  };

  // Handle final submission
  const handleSubmitApplication = async () => {
    try {
      setIsSubmitting(true);
      setSubmissionError(null);

      // Generate application ID
      const applicationId = `LN-${Date.now().toString().slice(-6)}`;
      const submissionDate = new Date().toISOString();

      // Prepare application data
      const applicationData = {
        personalInfo,
        propertyDetails,
        loanRequirements,
        submissionDate,
        applicationId,
      };

      // Import services dynamically to avoid loading them unnecessarily
      const [NotionService, EmailService] = await Promise.all([
        import("../services/NotionService").then((module) => module.default),
        import("../services/EmailService").then((module) => module.default),
      ]);

      // Initialize services
      // Pass the Notion database ID from props or environment variable
      const notionDatabaseIdToUse =
        notionDatabaseId || import.meta.env.NOTION_DATABASE_ID || "";
      const notionService = new NotionService(notionDatabaseIdToUse);
      const emailService = new EmailService();

      // Submit to Notion
      console.log(
        "Submitting to Notion with database ID:",
        notionDatabaseIdToUse,
      );
      const notionResult = await notionService.submitApplication({
        firstName: personalInfo.firstName,
        lastName: personalInfo.lastName,
        email: personalInfo.email,
        phone: personalInfo.phone,
        address: personalInfo.address,
        city: personalInfo.city,
        state: personalInfo.state,
        zipCode: personalInfo.zipCode,
        propertyAddress: propertyDetails.propertyAddress,
        propertyCity: propertyDetails.propertyCity,
        propertyState: propertyDetails.propertyState,
        propertyZipCode: propertyDetails.propertyZip,
        propertyType: propertyDetails.propertyType,
        propertyValue: Number(
          propertyDetails.propertyValue.replace(/[^0-9.-]+/g, ""),
        ),
        loanAmount: Number(
          loanRequirements.loanAmount.replace(/[^0-9.-]+/g, ""),
        ),
        loanPurpose: loanRequirements.loanPurpose,
        loanTerm: Number(loanRequirements.loanTerm.replace(/[^0-9.-]+/g, "")),
        exitStrategy: loanRequirements.exitStrategy,
        timeframe: loanRequirements.timeframe,
        additionalNotes: loanRequirements.additionalInfo,
      });

      // Send emails if Notion submission was successful
      if (notionResult.success) {
        console.log("Notion submission successful, sending emails");
        // Format data for emails
        const formattedDate = new Date().toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });

        const loanAmountFormatted = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(
          Number(loanRequirements.loanAmount.replace(/[^0-9.-]+/g, "")),
        );

        // Send emails
        await emailService.sendApplicationEmails(
          {
            applicantName: `${personalInfo.firstName} ${personalInfo.lastName}`,
            applicantEmail: personalInfo.email,
            applicationId,
            applicationDate: formattedDate,
            loanAmount: loanAmountFormatted,
            propertyAddress: `${propertyDetails.propertyAddress}, ${propertyDetails.propertyCity}, ${propertyDetails.propertyState} ${propertyDetails.propertyZip}`,
          },
          {
            applicantName: `${personalInfo.firstName} ${personalInfo.lastName}`,
            applicantEmail: personalInfo.email,
            applicantPhone: personalInfo.phone,
            applicationId,
            applicationDate: formattedDate,
            loanAmount: loanAmountFormatted,
            propertyAddress: `${propertyDetails.propertyAddress}, ${propertyDetails.propertyCity}, ${propertyDetails.propertyState} ${propertyDetails.propertyZip}`,
            propertyType: getPropertyTypeLabel(propertyDetails.propertyType),
            loanPurpose: getLoanPurposeLabel(loanRequirements.loanPurpose),
          },
        );
      }

      // Call the submission callback
      await onApplicationSubmit(applicationData);

      // Move to thank you page
      setIsSubmitted(true);
      setCurrentStep(steps.length); // Move to the step after review
    } catch (error) {
      console.error("Error submitting application:", error);
      setSubmissionError(
        "There was an error submitting your application. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Function to check if a step is complete
  const isStepComplete = (step: number): boolean => {
    return stepsCompleted[step] || false;
  };

  // Render the current step
  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0: // Personal Information
        return (
          <PersonalInformationForm
            onSubmit={handlePersonalInfoSubmit}
            defaultValues={personalInfo}
          />
        );
      case 1: // Property Details
        return (
          <PropertyDetailsForm
            onSubmit={handlePropertyDetailsSubmit}
            defaultValues={propertyDetails}
          />
        );
      case 2: // Loan Requirements
        return (
          <LoanRequirementsForm
            onSubmit={handleLoanRequirementsSubmit}
            defaultValues={loanRequirements}
          />
        );
      case 3: // Review
        return (
          <ApplicationReview
            personalInfo={{
              ...personalInfo,
              creditScore: getCreditScoreLabel(personalInfo.creditScore),
              annualIncome: getIncomeLabel(personalInfo.annualIncome),
            }}
            propertyDetails={{
              ...propertyDetails,
              propertyType: getPropertyTypeLabel(propertyDetails.propertyType),
              currentValue: `$${propertyDetails.propertyValue}`,
              purchasePrice: `$${propertyDetails.purchasePrice}`,
              propertyZipCode: propertyDetails.propertyZip,
            }}
            loanRequirements={{
              ...loanRequirements,
              loanAmount: `$${loanRequirements.loanAmount}`,
              loanPurpose: getLoanPurposeLabel(loanRequirements.loanPurpose),
              loanTerm: getLoanTermLabel(loanRequirements.loanTerm),
              exitStrategy: getExitStrategyLabel(loanRequirements.exitStrategy),
              timeframe: getTimeframeLabel(loanRequirements.timeframe),
            }}
            onEdit={goToStep}
            onSubmit={handleSubmitApplication}
          />
        );
      case 4: // Thank You
        return (
          <ThankYouPage
            applicantName={`${personalInfo.firstName} ${personalInfo.lastName}`}
            applicationId={`LN-${Date.now().toString().slice(-6)}`}
          />
        );
      default:
        return null;
    }
  };

  // Helper functions to convert codes to labels
  const getCreditScoreLabel = (code: string): string => {
    const labels: Record<string, string> = {
      excellent: "Excellent (720+)",
      good: "Good (680-719)",
      fair: "Fair (620-679)",
      poor: "Poor (580-619)",
      bad: "Bad (Below 580)",
    };
    return labels[code] || code;
  };

  const getIncomeLabel = (code: string): string => {
    const labels: Record<string, string> = {
      under50k: "Under $50,000",
      "50k-75k": "$50,000 - $75,000",
      "75k-100k": "$75,000 - $100,000",
      "100k-150k": "$100,000 - $150,000",
      "150k-200k": "$150,000 - $200,000",
      over200k: "Over $200,000",
    };
    return labels[code] || code;
  };

  const getPropertyTypeLabel = (code: string): string => {
    const labels: Record<string, string> = {
      single_family: "Single Family Home",
      multi_family: "Multi-Family",
      condo: "Condominium",
      townhouse: "Townhouse",
      commercial: "Commercial",
      land: "Vacant Land",
    };
    return labels[code] || code;
  };

  const getLoanPurposeLabel = (code: string): string => {
    const labels: Record<string, string> = {
      purchase: "Purchase",
      refinance: "Refinance",
      cashout: "Cash-Out Refinance",
      construction: "Construction",
      renovation: "Renovation",
      other: "Other",
    };
    return labels[code] || code;
  };

  const getLoanTermLabel = (code: string): string => {
    const labels: Record<string, string> = {
      "6months": "6 Months",
      "12months": "12 Months",
      "18months": "18 Months",
      "24months": "24 Months",
      "36months": "36 Months",
      custom: "Custom Term",
    };
    return labels[code] || code;
  };

  const getExitStrategyLabel = (code: string): string => {
    const labels: Record<string, string> = {
      sell: "Sell Property",
      refinance: "Refinance to Traditional Loan",
      rental: "Convert to Rental",
      other: "Other",
    };
    return labels[code] || code;
  };

  const getTimeframeLabel = (code: string): string => {
    const labels: Record<string, string> = {
      immediate: "Immediate (ASAP)",
      "30days": "Within 30 Days",
      "60days": "Within 60 Days",
      "90days": "Within 90 Days",
      flexible: "Flexible",
    };
    return labels[code] || code;
  };

  // Animation variants for page transitions
  const pageVariants = {
    initial: { opacity: 0, x: 100 },
    in: { opacity: 1, x: 0 },
    out: { opacity: 0, x: -100 },
  };

  const pageTransition = {
    type: "tween",
    ease: "anticipate",
    duration: 0.3,
  };

  return (
    <div
      className="w-full max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden"
      style={{ scrollBehavior: "smooth" }}
    >
      {/* Header */}
      <div
        className="p-6 border-b"
        style={{ backgroundColor: primaryColor, color: "white" }}
      >
        <h1 className="text-2xl font-bold">{widgetTitle}</h1>
        <p className="mt-1 text-sm opacity-90">{widgetDescription}</p>
      </div>

      {/* Progress Indicator (hide on thank you page) */}
      {currentStep < steps.length && (
        <div className="p-4 border-b">
          <ProgressIndicator
            steps={steps}
            currentStep={currentStep}
            onStepClick={(step) => {
              // Only allow clicking on completed steps or the current step
              if (step < currentStep || stepsCompleted[step]) {
                goToStep(step);
              }
            }}
          />
        </div>
      )}

      {/* Form Errors */}
      {formErrors.length > 0 && (
        <div className="px-6 pt-4">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <ul className="list-disc pl-5 mt-2">
                {formErrors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        </div>
      )}

      {/* Submission Error */}
      {submissionError && (
        <div className="px-6 pt-4">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{submissionError}</AlertDescription>
          </Alert>
        </div>
      )}

      {/* Form Content */}
      <div className="p-6" id="form-content">
        {/* Auto-scroll to top of form when step changes */}
        {React.useEffect(() => {
          document
            .getElementById("form-content")
            ?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, [currentStep])}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
          >
            {renderCurrentStep()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Controls (hide on thank you page) */}
      {currentStep < steps.length && (
        <NavigationControls
          currentStep={currentStep + 1}
          totalSteps={steps.length}
          onPrevious={goToPreviousStep}
          onNext={goToNextStep}
          onSubmit={handleSubmitApplication}
          isNextDisabled={isSubmitting}
          isPreviousDisabled={isSubmitting}
          isSubmitDisabled={isSubmitting}
        />
      )}
    </div>
  );
};

export default LoanApplicationWidget;

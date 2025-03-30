import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Separator } from "../components/ui/separator";
import { Edit, Check, AlertCircle } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../components/ui/accordion";

interface PersonalInformation {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  creditScore: string;
  annualIncome: string;
}

interface PropertyDetails {
  propertyAddress: string;
  propertyCity: string;
  propertyState: string;
  propertyZipCode: string;
  propertyType: string;
  currentValue: string;
  purchasePrice: string;
  yearBuilt: string;
  squareFootage: string;
}

interface LoanRequirements {
  loanAmount: string;
  loanPurpose: string;
  loanTerm: string;
  exitStrategy: string;
  timeframe: string;
  additionalInfo: string;
}

interface ApplicationReviewProps {
  personalInfo?: PersonalInformation;
  propertyDetails?: PropertyDetails;
  loanRequirements?: LoanRequirements;
  onEdit: (step: number) => void;
  onSubmit: () => void;
}

const ApplicationReview: React.FC<ApplicationReviewProps> = ({
  personalInfo = {
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phone: "(555) 123-4567",
    address: "123 Main Street",
    city: "Anytown",
    state: "CA",
    zipCode: "90210",
    creditScore: "720",
    annualIncome: "$120,000",
  },
  propertyDetails = {
    propertyAddress: "456 Investment Ave",
    propertyCity: "Metropolis",
    propertyState: "NY",
    propertyZipCode: "10001",
    propertyType: "Single Family Residence",
    currentValue: "$450,000",
    purchasePrice: "$400,000",
    yearBuilt: "1995",
    squareFootage: "2,200",
  },
  loanRequirements = {
    loanAmount: "$320,000",
    loanPurpose: "Purchase",
    loanTerm: "12 months",
    exitStrategy: "Refinance with conventional loan",
    timeframe: "30 days",
    additionalInfo: "Looking to close quickly to secure the property.",
  },
  onEdit = () => {},
  onSubmit = () => {},
}) => {
  return (
    <div className="w-full max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-sm">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold text-gray-800">Application Review</h2>
        <p className="text-gray-600">
          Please review your application details before submitting
        </p>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>
                Your contact and financial details
              </CardDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(0)}
              className="flex items-center gap-1"
            >
              <Edit className="h-4 w-4" />
              Edit
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Full Name</p>
                <p className="text-base">
                  {personalInfo.firstName} {personalInfo.lastName}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Email</p>
                <p className="text-base">{personalInfo.email}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Phone</p>
                <p className="text-base">{personalInfo.phone}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Address</p>
                <p className="text-base">{personalInfo.address}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">
                  City, State, ZIP
                </p>
                <p className="text-base">
                  {personalInfo.city}, {personalInfo.state}{" "}
                  {personalInfo.zipCode}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Credit Score
                </p>
                <p className="text-base">{personalInfo.creditScore}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Annual Income
                </p>
                <p className="text-base">{personalInfo.annualIncome}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle>Property Details</CardTitle>
              <CardDescription>Information about the property</CardDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(1)}
              className="flex items-center gap-1"
            >
              <Edit className="h-4 w-4" />
              Edit
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Property Address
                </p>
                <p className="text-base">{propertyDetails.propertyAddress}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">
                  City, State, ZIP
                </p>
                <p className="text-base">
                  {propertyDetails.propertyCity},{" "}
                  {propertyDetails.propertyState}{" "}
                  {propertyDetails.propertyZipCode}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Property Type
                </p>
                <p className="text-base">{propertyDetails.propertyType}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Current Value
                </p>
                <p className="text-base">{propertyDetails.currentValue}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Purchase Price
                </p>
                <p className="text-base">{propertyDetails.purchasePrice}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Year Built</p>
                <p className="text-base">{propertyDetails.yearBuilt}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Square Footage
                </p>
                <p className="text-base">{propertyDetails.squareFootage}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle>Loan Requirements</CardTitle>
              <CardDescription>
                Your financing needs and timeline
              </CardDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(2)}
              className="flex items-center gap-1"
            >
              <Edit className="h-4 w-4" />
              Edit
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Loan Amount</p>
                <p className="text-base">{loanRequirements.loanAmount}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Loan Purpose
                </p>
                <p className="text-base">{loanRequirements.loanPurpose}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Loan Term</p>
                <p className="text-base">{loanRequirements.loanTerm}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Exit Strategy
                </p>
                <p className="text-base">{loanRequirements.exitStrategy}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Timeframe</p>
                <p className="text-base">{loanRequirements.timeframe}</p>
              </div>
            </div>

            <div className="mt-4">
              <p className="text-sm font-medium text-gray-500">
                Additional Information
              </p>
              <p className="text-base">{loanRequirements.additionalInfo}</p>
            </div>
          </CardContent>
        </Card>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="text-sm font-medium text-blue-800">
              Before submitting your application
            </h4>
            <p className="text-sm text-blue-700 mt-1">
              Please verify all information is correct. Once submitted, your
              application will be reviewed by our loan officers who will contact
              you within 1-2 business days.
            </p>
          </div>
        </div>

        <Accordion type="single" collapsible className="border rounded-md">
          <AccordionItem value="terms">
            <AccordionTrigger className="px-4">
              Terms and Conditions
            </AccordionTrigger>
            <AccordionContent className="px-4 text-sm text-gray-600">
              <p>By submitting this application, you acknowledge that:</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>
                  All information provided is accurate and complete to the best
                  of your knowledge.
                </li>
                <li>
                  You authorize us to verify any information provided and to
                  obtain credit reports.
                </li>
                <li>
                  This is an application for a hard money loan and not a
                  commitment to lend.
                </li>
                <li>
                  Loan approval is subject to property valuation and other
                  underwriting criteria.
                </li>
              </ul>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <div className="flex justify-end gap-4 pt-4">
          <Button variant="outline" onClick={() => onEdit(0)}>
            Back to Edit
          </Button>
          <Button onClick={onSubmit} className="gap-2">
            <Check className="h-4 w-4" />
            Submit Application
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ApplicationReview;

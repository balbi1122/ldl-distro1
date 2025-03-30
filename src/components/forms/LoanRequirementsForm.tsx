import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { DollarSign, Calendar, FileText, HelpCircle } from "lucide-react";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const formSchema = z.object({
  loanAmount: z.string().min(1, { message: "Loan amount is required" }),
  loanPurpose: z.string().min(1, { message: "Loan purpose is required" }),
  loanTerm: z.string().min(1, { message: "Loan term is required" }),
  exitStrategy: z.string().min(1, { message: "Exit strategy is required" }),
  timeframe: z.string().min(1, { message: "Timeframe is required" }),
  additionalInfo: z.string().optional(),
});

type LoanRequirementsFormValues = z.infer<typeof formSchema>;

interface LoanRequirementsFormProps {
  onSubmit?: (values: LoanRequirementsFormValues) => void;
  defaultValues?: Partial<LoanRequirementsFormValues>;
}

const LoanRequirementsForm = ({
  onSubmit = () => {},
  defaultValues = {
    loanAmount: "",
    loanPurpose: "",
    loanTerm: "",
    exitStrategy: "",
    timeframe: "",
    additionalInfo: "",
  },
}: LoanRequirementsFormProps) => {
  const form = useForm<LoanRequirementsFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const handleSubmit = (values: LoanRequirementsFormValues) => {
    onSubmit(values);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-sm">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Loan Requirements</h2>
        <p className="text-gray-600 mt-1">
          Please provide details about your loan requirements and timeline.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Loan Amount */}
            <FormField
              control={form.control}
              name="loanAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-1">
                    <DollarSign className="h-4 w-4" />
                    Loan Amount
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                        $
                      </span>
                      <Input
                        {...field}
                        placeholder="500,000"
                        className="pl-7"
                        type="text"
                      />
                    </div>
                  </FormControl>
                  <FormDescription>
                    Enter the amount you wish to borrow
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Loan Purpose */}
            <FormField
              control={form.control}
              name="loanPurpose"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-1">
                    <FileText className="h-4 w-4" />
                    Loan Purpose
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select purpose" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="purchase">Purchase</SelectItem>
                      <SelectItem value="refinance">Refinance</SelectItem>
                      <SelectItem value="cashout">
                        Cash-Out Refinance
                      </SelectItem>
                      <SelectItem value="construction">Construction</SelectItem>
                      <SelectItem value="renovation">Renovation</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Select the primary purpose for this loan
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Loan Term */}
            <FormField
              control={form.control}
              name="loanTerm"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    Loan Term
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select term" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="6months">6 Months</SelectItem>
                      <SelectItem value="12months">12 Months</SelectItem>
                      <SelectItem value="18months">18 Months</SelectItem>
                      <SelectItem value="24months">24 Months</SelectItem>
                      <SelectItem value="36months">36 Months</SelectItem>
                      <SelectItem value="custom">Custom Term</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Select your preferred loan term
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Exit Strategy */}
            <FormField
              control={form.control}
              name="exitStrategy"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-1">
                    <HelpCircle className="h-4 w-4" />
                    Exit Strategy
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select strategy" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="sell">Sell Property</SelectItem>
                      <SelectItem value="refinance">
                        Refinance to Traditional Loan
                      </SelectItem>
                      <SelectItem value="rental">Convert to Rental</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    How do you plan to repay this loan?
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Timeframe */}
            <FormField
              control={form.control}
              name="timeframe"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    Funding Timeframe
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select timeframe" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="immediate">
                        Immediate (ASAP)
                      </SelectItem>
                      <SelectItem value="30days">Within 30 Days</SelectItem>
                      <SelectItem value="60days">Within 60 Days</SelectItem>
                      <SelectItem value="90days">Within 90 Days</SelectItem>
                      <SelectItem value="flexible">Flexible</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>When do you need the funds?</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Additional Information */}
            <FormField
              control={form.control}
              name="additionalInfo"
              render={({ field }) => (
                <FormItem className="col-span-1 md:col-span-2">
                  <FormLabel>Additional Information</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Please provide any additional details that may be relevant to your loan application..."
                      className="min-h-[120px]"
                    />
                  </FormControl>
                  <FormDescription>
                    Share any other relevant information about your loan needs
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </form>
      </Form>
    </div>
  );
};

export default LoanRequirementsForm;

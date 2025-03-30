import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Building, Home, MapPin } from "lucide-react";

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
  propertyAddress: z
    .string()
    .min(5, { message: "Property address is required" }),
  propertyCity: z.string().min(2, { message: "City is required" }),
  propertyState: z.string().min(2, { message: "State is required" }),
  propertyZip: z.string().min(5, { message: "Valid ZIP code is required" }),
  propertyType: z.string().min(1, { message: "Property type is required" }),
  propertyValue: z
    .string()
    .min(1, { message: "Current property value is required" }),
  purchasePrice: z.string().min(1, { message: "Purchase price is required" }),
  yearBuilt: z.string().min(4, { message: "Year built is required" }),
  squareFootage: z.string().min(1, { message: "Square footage is required" }),
  propertyDescription: z.string().optional(),
});

export interface PropertyDetailsFormProps {
  onSubmit?: (data: z.infer<typeof formSchema>) => void;
  defaultValues?: Partial<z.infer<typeof formSchema>>;
}

const PropertyDetailsForm = ({
  onSubmit = () => {},
  defaultValues = {
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
  },
}: PropertyDetailsFormProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const handleSubmit = (data: z.infer<typeof formSchema>) => {
    onSubmit(data);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-sm border border-gray-100">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">
          Property Details
        </h2>
        <p className="text-gray-600 mt-1">
          Please provide information about the property you're seeking financing
          for.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Property Address */}
            <div className="md:col-span-2">
              <FormField
                control={form.control}
                name="propertyAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Property Address</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                        <Input
                          className="pl-10"
                          placeholder="123 Main Street"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* City */}
            <FormField
              control={form.control}
              name="propertyCity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City</FormLabel>
                  <FormControl>
                    <Input placeholder="City" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* State */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="propertyState"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>State</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select state" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="AL">Alabama</SelectItem>
                        <SelectItem value="AK">Alaska</SelectItem>
                        <SelectItem value="AZ">Arizona</SelectItem>
                        <SelectItem value="CA">California</SelectItem>
                        <SelectItem value="CO">Colorado</SelectItem>
                        <SelectItem value="FL">Florida</SelectItem>
                        <SelectItem value="NY">New York</SelectItem>
                        <SelectItem value="TX">Texas</SelectItem>
                        {/* Add more states as needed */}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* ZIP Code */}
              <FormField
                control={form.control}
                name="propertyZip"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ZIP Code</FormLabel>
                    <FormControl>
                      <Input placeholder="12345" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Property Type */}
            <FormField
              control={form.control}
              name="propertyType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Property Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select property type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="single_family">
                        Single Family Home
                      </SelectItem>
                      <SelectItem value="multi_family">Multi-Family</SelectItem>
                      <SelectItem value="condo">Condominium</SelectItem>
                      <SelectItem value="townhouse">Townhouse</SelectItem>
                      <SelectItem value="commercial">Commercial</SelectItem>
                      <SelectItem value="land">Vacant Land</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Current Property Value */}
            <FormField
              control={form.control}
              name="propertyValue"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Property Value ($)</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-gray-500">
                        $
                      </span>
                      <Input
                        className="pl-7"
                        placeholder="500,000"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Purchase Price */}
            <FormField
              control={form.control}
              name="purchasePrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Purchase Price ($)</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-gray-500">
                        $
                      </span>
                      <Input
                        className="pl-7"
                        placeholder="450,000"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Year Built */}
            <FormField
              control={form.control}
              name="yearBuilt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Year Built</FormLabel>
                  <FormControl>
                    <Input placeholder="2005" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Square Footage */}
            <FormField
              control={form.control}
              name="squareFootage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Square Footage</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Building className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                      <Input className="pl-10" placeholder="2,500" {...field} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Property Description */}
            <div className="md:col-span-2">
              <FormField
                control={form.control}
                name="propertyDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Property Description (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Please provide any additional details about the property..."
                        className="min-h-[120px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Include any relevant details about the property condition,
                      features, or special circumstances.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default PropertyDetailsForm;

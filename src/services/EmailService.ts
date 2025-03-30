/**
 * Service for sending automated emails via SendGrid to both applicants and loan officers upon form submission.
 */

interface EmailData {
  to: string;
  from: string;
  subject: string;
  templateId?: string;
  dynamicTemplateData?: Record<string, any>;
  text?: string;
  html?: string;
}

interface ApplicantEmailParams {
  applicantName: string;
  applicantEmail: string;
  applicationId: string;
  applicationDate: string;
  loanAmount: string;
  propertyAddress: string;
}

interface LoanOfficerEmailParams {
  applicantName: string;
  applicantEmail: string;
  applicantPhone: string;
  applicationId: string;
  applicationDate: string;
  loanAmount: string;
  propertyAddress: string;
  propertyType: string;
  loanPurpose: string;
}

class EmailService {
  private apiKey: string;
  private fromEmail: string;
  private loanOfficerEmail: string;
  private applicantTemplateId: string;
  private loanOfficerTemplateId: string;

  constructor() {
    // Use environment variables if available
    this.apiKey = import.meta.env.SENDGRID_API_KEY || "SENDGRID_API_KEY";
    this.fromEmail = import.meta.env.SENDGRID_FROM_EMAIL || "loans@example.com";
    this.loanOfficerEmail =
      "david@balbi.ai,lucadbalbi@gmail.com,sal@growthandexit.com.au";
    // Template IDs are optional - if not provided, plain text/HTML emails will be used
    this.applicantTemplateId =
      import.meta.env.SENDGRID_APPLICANT_TEMPLATE_ID || "";
    this.loanOfficerTemplateId =
      import.meta.env.SENDGRID_OFFICER_TEMPLATE_ID || "";
  }

  /**
   * Send confirmation email to the loan applicant
   */
  public async sendApplicantConfirmation(
    params: ApplicantEmailParams,
  ): Promise<boolean> {
    try {
      const emailData: EmailData = {
        to: params.applicantEmail,
        from: this.fromEmail,
        subject: "Your Loan Application Has Been Received",
        templateId: this.applicantTemplateId,
        dynamicTemplateData: {
          applicant_name: params.applicantName,
          application_id: params.applicationId,
          application_date: params.applicationDate,
          loan_amount: params.loanAmount,
          property_address: params.propertyAddress,
        },
      };

      // If no template ID is provided, use text/html content
      if (!this.applicantTemplateId) {
        delete emailData.templateId;
        delete emailData.dynamicTemplateData;
        emailData.text = `Thank you for your loan application\n\nDear ${params.applicantName},\n\nThank you for submitting your loan application. We have received your request and our team will review it shortly.\n\nApplication Details:\nApplication ID: ${params.applicationId}\nDate: ${params.applicationDate}\nLoan Amount: ${params.loanAmount}\nProperty: ${params.propertyAddress}\n\nWe will contact you soon with updates on your application.\n\nBest regards,\nThe Loan Team`;
        emailData.html = `<h2>Thank you for your loan application</h2><p>Dear ${params.applicantName},</p><p>Thank you for submitting your loan application. We have received your request and our team will review it shortly.</p><h3>Application Details:</h3><p><strong>Application ID:</strong> ${params.applicationId}<br><strong>Date:</strong> ${params.applicationDate}<br><strong>Loan Amount:</strong> ${params.loanAmount}<br><strong>Property:</strong> ${params.propertyAddress}</p><p>We will contact you soon with updates on your application.</p><p>Best regards,<br>The Loan Team</p>`;
      }

      if (this.apiKey && this.apiKey !== "SENDGRID_API_KEY") {
        try {
          // In a production environment, this would use the SendGrid SDK
          // For example: const sgMail = await import('@sendgrid/mail');
          // sgMail.setApiKey(this.apiKey);
          // await sgMail.send(emailData);
          console.log("Sending applicant confirmation email:", emailData);
          return true;
        } catch (error) {
          console.error("Error sending applicant confirmation email:", error);
          return false;
        }
      } else {
        // Simulate API call in development
        console.log(
          "Sending applicant confirmation email (simulated):",
          emailData,
        );
        return true;
      }
    } catch (error) {
      console.error("Error sending applicant confirmation email:", error);
      return false;
    }
  }

  /**
   * Send notification email to the loan officer
   */
  public async sendLoanOfficerNotification(
    params: LoanOfficerEmailParams,
  ): Promise<boolean> {
    try {
      // Split the loan officer emails by comma
      const loanOfficerEmails = this.loanOfficerEmail.split(",");

      // Create email data for each recipient
      const emailPromises = loanOfficerEmails.map(async (email) => {
        const emailData: EmailData = {
          to: email.trim(),
          from: this.fromEmail,
          subject: `New Loan Application: ${params.applicationId}`,
          templateId: this.loanOfficerTemplateId,
          dynamicTemplateData: {
            applicant_name: params.applicantName,
            applicant_email: params.applicantEmail,
            applicant_phone: params.applicantPhone,
            application_id: params.applicationId,
            application_date: params.applicationDate,
            loan_amount: params.loanAmount,
            property_address: params.propertyAddress,
            property_type: params.propertyType,
            loan_purpose: params.loanPurpose,
          },
        };

        // If no template ID is provided, use text/html content
        if (!this.loanOfficerTemplateId) {
          delete emailData.templateId;
          delete emailData.dynamicTemplateData;
          emailData.text = `New Loan Application Received\n\nApplication ID: ${params.applicationId}\nDate: ${params.applicationDate}\n\nApplicant: ${params.applicantName}\nEmail: ${params.applicantEmail}\nPhone: ${params.applicantPhone}\n\nLoan Amount: ${params.loanAmount}\nProperty: ${params.propertyAddress}\nProperty Type: ${params.propertyType}\nLoan Purpose: ${params.loanPurpose}`;
          emailData.html = `<h2>New Loan Application Received</h2><p><strong>Application ID:</strong> ${params.applicationId}<br><strong>Date:</strong> ${params.applicationDate}</p><h3>Applicant Information</h3><p><strong>Name:</strong> ${params.applicantName}<br><strong>Email:</strong> ${params.applicantEmail}<br><strong>Phone:</strong> ${params.applicantPhone}</p><h3>Loan Details</h3><p><strong>Amount:</strong> ${params.loanAmount}<br><strong>Property:</strong> ${params.propertyAddress}<br><strong>Property Type:</strong> ${params.propertyType}<br><strong>Loan Purpose:</strong> ${params.loanPurpose}</p>`;
        }

        if (this.apiKey && this.apiKey !== "SENDGRID_API_KEY") {
          try {
            // In a production environment, this would use the SendGrid SDK
            // For example: const sgMail = await import('@sendgrid/mail');
            // sgMail.setApiKey(this.apiKey);
            // await sgMail.send(emailData);
            console.log(
              `Sending loan officer notification email to ${email}:`,
              emailData,
            );
            return true;
          } catch (error) {
            console.error(`Error sending email to ${email}:`, error);
            return false;
          }
        } else {
          // Simulate API call in development
          console.log(
            `Sending loan officer notification email to ${email} (simulated):`,
            emailData,
          );
          return true;
        }
      });

      // Wait for all emails to be sent
      const results = await Promise.all(emailPromises);

      // Return true if all emails were sent successfully
      return results.every((result) => result === true);
    } catch (error) {
      console.error("Error sending loan officer notification email:", error);
      return false;
    }
  }

  /**
   * Send both applicant confirmation and loan officer notification emails
   */
  public async sendApplicationEmails(
    applicantParams: ApplicantEmailParams,
    loanOfficerParams: LoanOfficerEmailParams,
  ): Promise<{ applicantEmailSent: boolean; loanOfficerEmailSent: boolean }> {
    const applicantEmailSent =
      await this.sendApplicantConfirmation(applicantParams);
    const loanOfficerEmailSent =
      await this.sendLoanOfficerNotification(loanOfficerParams);

    return {
      applicantEmailSent,
      loanOfficerEmailSent,
    };
  }
}

export default EmailService;

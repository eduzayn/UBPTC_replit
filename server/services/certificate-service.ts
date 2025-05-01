import { storage } from "../storage";
import { InsertCertificate } from "@shared/schema";

class CertificateService {
  async getUserCertificates(userId: number) {
    try {
      const certificates = await storage.getUserCertificates(userId);
      
      // Format certificates for client
      return certificates.map(cert => {
        return {
          id: cert.id,
          type: cert.type,
          issueDate: cert.issue_date.toLocaleDateString("pt-BR"),
          expiryDate: cert.expiry_date ? cert.expiry_date.toLocaleDateString("pt-BR") : null,
          fileUrl: cert.file_url,
          eventId: cert.event_id
        };
      });
    } catch (error) {
      console.error("Error in getUserCertificates:", error);
      throw new Error("Failed to get user certificates");
    }
  }

  async getCertificateFile(certificateId: number, userId: number) {
    try {
      const certificate = await storage.getCertificateById(certificateId);
      
      // Verify that the certificate belongs to the user
      if (certificate.user_id !== userId) {
        throw new Error("Unauthorized access to certificate");
      }
      
      return certificate.file_url;
    } catch (error) {
      console.error("Error in getCertificateFile:", error);
      throw new Error("Failed to get certificate file");
    }
  }

  async createCertificate(certificateData: InsertCertificate) {
    try {
      const newCertificate = await storage.createCertificate(certificateData);
      return newCertificate;
    } catch (error) {
      console.error("Error in createCertificate:", error);
      throw new Error("Failed to create certificate");
    }
  }

  async generateAnnualCertificates() {
    try {
      // In a real implementation, this would be a scheduled job that checks for users
      // who have been active for 12 months and generates their annual certificates
      
      // For this example, we'll just return a success message
      return {
        success: true,
        message: "Annual certificates generation scheduled"
      };
    } catch (error) {
      console.error("Error in generateAnnualCertificates:", error);
      throw new Error("Failed to generate annual certificates");
    }
  }
}

export const certificateService = new CertificateService();

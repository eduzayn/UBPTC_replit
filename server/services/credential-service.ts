import { storage } from "../storage";
import { nanoid } from "nanoid";
// We would normally use a PDF generating library here, but for this example we'll just return a sample URL

interface CredentialValidationResult {
  isValid: boolean;
  member?: {
    name: string;
    occupation: string;
    status: string;
    validUntil: string;
  };
  message?: string;
}

class CredentialService {
  async getUserCredential(userId: number) {
    try {
      // Check if user has an existing credential
      let credential = await storage.getCredentialByUserId(userId);
      
      if (!credential) {
        // If no credential exists, create a new one
        const user = await storage.getUserById(userId);
        
        // Generate a credential number
        const credentialNumber = `UBPCT-${nanoid(8).toUpperCase()}`;
        
        // Set expiry date (1 year from now)
        const issueDate = new Date();
        const expiryDate = new Date();
        expiryDate.setFullYear(expiryDate.getFullYear() + 1);
        
        credential = await storage.createCredential({
          user_id: userId,
          credential_number: credentialNumber,
          qr_code: `https://ubpct.org/validate/${credentialNumber}`,
          issue_date: issueDate,
          expiry_date: expiryDate,
          status: "active"
        });
      } else {
        // Check if credential is expired and user is active
        const user = await storage.getUserById(userId);
        const now = new Date();
        
        if (credential.expiry_date < now && user.subscription_status === "active") {
          // Renew credential
          const expiryDate = new Date();
          expiryDate.setFullYear(expiryDate.getFullYear() + 1);
          
          credential = await storage.updateCredential(credential.id, {
            issue_date: new Date(),
            expiry_date: expiryDate,
            status: "active",
            updated_at: new Date()
          });
        }
      }
      
      return credential;
    } catch (error) {
      console.error("Error in getUserCredential:", error);
      throw new Error("Failed to get user credential");
    }
  }

  async validateCredential(credentialNumber: string): Promise<CredentialValidationResult> {
    try {
      const credential = await storage.getCredentialByNumber(credentialNumber);
      
      if (!credential) {
        return {
          isValid: false,
          message: "Credencial não encontrada."
        };
      }
      
      const user = await storage.getUserById(credential.user_id);
      const now = new Date();
      
      // Check if credential is expired
      if (credential.expiry_date < now || credential.status !== "active") {
        return {
          isValid: false,
          member: {
            name: user.name,
            occupation: user.occupation,
            status: "Expirada",
            validUntil: credential.expiry_date.toLocaleDateString("pt-BR")
          },
          message: "Esta credencial está expirada."
        };
      }
      
      // Check if user is active
      if (user.subscription_status !== "active") {
        return {
          isValid: false,
          member: {
            name: user.name,
            occupation: user.occupation,
            status: "Inativa",
            validUntil: credential.expiry_date.toLocaleDateString("pt-BR")
          },
          message: "O associado está com a assinatura inativa."
        };
      }
      
      // Valid credential
      return {
        isValid: true,
        member: {
          name: user.name,
          occupation: user.occupation,
          status: "Ativa",
          validUntil: credential.expiry_date.toLocaleDateString("pt-BR")
        }
      };
    } catch (error) {
      console.error("Error in validateCredential:", error);
      throw new Error("Failed to validate credential");
    }
  }

  async generateCredentialPDF(credentialId: number): Promise<Buffer> {
    try {
      // In a real implementation, we would generate a PDF here
      // For this example, we'll just return a dummy buffer
      return Buffer.from("PDF content would be generated here");
    } catch (error) {
      console.error("Error in generateCredentialPDF:", error);
      throw new Error("Failed to generate credential PDF");
    }
  }
}

export const credentialService = new CredentialService();

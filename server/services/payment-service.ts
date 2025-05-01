import { storage } from "../storage";
import { User } from "@shared/schema";

class PaymentService {
  async createPaymentLink(memberData: User, plan: "monthly" | "annual") {
    try {
      const userId = memberData.id;
      
      // Calculate amount based on plan
      const amount = plan === "monthly" ? "69.90" : "671.04"; // 20% discount for annual
      
      // In a real implementation, we would use the Asaas API to create a payment link
      // For this example, we'll create a payment record and return a sample URL
      
      // Create due date (today + 3 days)
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 3);
      
      // Create payment record
      await storage.createPayment({
        user_id: userId,
        amount,
        plan,
        status: "pending",
        payment_method: "unknown", // Will be updated when paid
        due_date: dueDate
      });
      
      // Return a sample payment link
      return `https://asaas.com/c/payment/${userId}-${plan}-${Date.now()}`;
    } catch (error) {
      console.error("Error in createPaymentLink:", error);
      throw new Error("Failed to create payment link");
    }
  }

  async getPaymentStatus(userId: number) {
    try {
      // Get the latest payment for the user
      const payments = await storage.getPaymentsByUserId(userId);
      
      if (payments.length === 0) {
        return {
          status: "inadimplente",
          expiryDate: null
        };
      }
      
      // Get the most recent payment
      const latestPayment = payments[0];
      
      // Check if it's paid and not expired
      if (latestPayment.status === "paid") {
        const expiryDate = new Date(latestPayment.payment_date);
        
        // Add 1 month for monthly plan, 12 months for annual plan
        if (latestPayment.plan === "monthly") {
          expiryDate.setMonth(expiryDate.getMonth() + 1);
        } else {
          expiryDate.setFullYear(expiryDate.getFullYear() + 1);
        }
        
        // Check if expired
        const now = new Date();
        
        if (expiryDate > now) {
          return {
            status: "adimplente",
            expiryDate: expiryDate.toISOString()
          };
        }
      }
      
      return {
        status: "inadimplente",
        expiryDate: null
      };
    } catch (error) {
      console.error("Error in getPaymentStatus:", error);
      throw new Error("Failed to get payment status");
    }
  }

  async updatePaymentMethod(userId: number, plan: "monthly" | "annual") {
    try {
      // Get user
      const user = await storage.getUserById(userId);
      
      // Create new payment link
      const paymentLink = await this.createPaymentLink(user, plan);
      
      return {
        success: true,
        paymentLink
      };
    } catch (error) {
      console.error("Error in updatePaymentMethod:", error);
      throw new Error("Failed to update payment method");
    }
  }

  async handleWebhook(webhookData: any) {
    try {
      // In a real implementation, we would validate the Asaas webhook 
      // and update the payment status
      
      if (!webhookData || !webhookData.event) {
        throw new Error("Invalid webhook data");
      }
      
      // Example webhook handling
      if (webhookData.event === "PAYMENT_CONFIRMED") {
        const paymentId = webhookData.payment.id;
        const userId = webhookData.payment.customer;
        
        // Update user subscription status
        await storage.updateUser(userId, {
          subscription_status: "active"
        });
        
        // Create or update credential
        await this._updateCredential(userId);
      } else if (webhookData.event === "PAYMENT_OVERDUE") {
        const userId = webhookData.payment.customer;
        
        // Update user subscription status
        await storage.updateUser(userId, {
          subscription_status: "inactive"
        });
      }
    } catch (error) {
      console.error("Error in handleWebhook:", error);
      throw error;
    }
  }

  private async _updateCredential(userId: number) {
    try {
      // Check if user has a credential
      const credential = await storage.getCredentialByUserId(userId);
      
      if (credential) {
        // Update credential expiry date
        const expiryDate = new Date();
        expiryDate.setFullYear(expiryDate.getFullYear() + 1);
        
        await storage.updateCredential(credential.id, {
          expiry_date: expiryDate,
          status: "active",
          updated_at: new Date()
        });
      } else {
        // Create a new credential (this will be handled by credentialService when user accesses dashboard)
      }
    } catch (error) {
      console.error("Error in _updateCredential:", error);
      throw error;
    }
  }
}

export const paymentService = new PaymentService();

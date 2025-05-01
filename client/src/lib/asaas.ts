/**
 * Client-side utilities for Asaas payment integration
 */

// Function to generate payment link based on member data and plan
export const createPaymentLink = async (
  memberData: any,
  plan: "monthly" | "annual"
): Promise<string> => {
  try {
    const response = await fetch("/api/payments/create-link", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        memberData,
        plan,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to create payment link");
    }

    const data = await response.json();
    return data.paymentLink;
  } catch (error) {
    console.error("Error creating payment link:", error);
    throw error;
  }
};

// Function to check payment status
export const checkPaymentStatus = async (userId: number): Promise<{
  status: "adimplente" | "inadimplente" | "cancelado";
  expiryDate: string | null;
}> => {
  try {
    const response = await fetch(`/api/payments/status/${userId}`);
    if (!response.ok) {
      throw new Error("Failed to check payment status");
    }
    return await response.json();
  } catch (error) {
    console.error("Error checking payment status:", error);
    throw error;
  }
};

// Function to update payment method
export const updatePaymentMethod = async (
  userId: number,
  plan: "monthly" | "annual"
): Promise<{ success: boolean; paymentLink?: string }> => {
  try {
    const response = await fetch(`/api/payments/update-method`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
        plan,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to update payment method");
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating payment method:", error);
    throw error;
  }
};

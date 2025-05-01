/**
 * Client-side utilities for QR code generation
 */

// Function to generate a QR code URL for credential validation
export const generateQRCodeUrl = (credentialId: string): string => {
  const baseUrl = window.location.origin;
  // Encode the credential ID to make it URL-safe
  const encodedId = encodeURIComponent(credentialId);
  
  // Create a URL for QR code generation using a free service
  // This is client-side only, the validation will hit our backend
  return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${baseUrl}/validate/${encodedId}&format=svg`;
};

// Function to download credential as PDF
export const downloadCredentialAsPDF = async (
  credentialId: number,
  userName: string
): Promise<void> => {
  try {
    const response = await fetch(`/api/credentials/${credentialId}/download`);
    
    if (!response.ok) {
      throw new Error("Failed to download credential");
    }
    
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    
    // Create a link element and trigger download
    const a = document.createElement("a");
    a.href = url;
    a.download = `credencial-ubpct-${userName.replace(/\s+/g, "-").toLowerCase()}.pdf`;
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  } catch (error) {
    console.error("Error downloading credential:", error);
    throw error;
  }
};

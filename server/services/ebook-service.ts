import { storage } from "../storage";
import { InsertEbook } from "@shared/schema";

interface EbookFileInfo {
  filename: string;
  url: string;
}

class EbookService {
  async getAllEbooks() {
    try {
      const ebooks = await storage.getAllEbooks();
      
      // Format ebooks for client
      return ebooks.map(ebook => ({
        id: ebook.id,
        title: ebook.title,
        author: ebook.author,
        description: ebook.description,
        coverUrl: ebook.cover_url,
        categories: [ebook.category], // Category is a single string in DB, but client expects array
        created_at: ebook.created_at
      }));
    } catch (error) {
      console.error("Error in getAllEbooks:", error);
      throw new Error("Failed to get ebooks");
    }
  }

  async getFeaturedEbooks() {
    try {
      const allEbooks = await storage.getAllEbooks();
      
      // Get 5 random ebooks as featured
      const shuffled = [...allEbooks].sort(() => 0.5 - Math.random());
      const featured = shuffled.slice(0, 5);
      
      // Format for client
      return featured.map(ebook => ({
        id: ebook.id,
        title: ebook.title,
        author: ebook.author,
        coverUrl: ebook.cover_url
      }));
    } catch (error) {
      console.error("Error in getFeaturedEbooks:", error);
      throw new Error("Failed to get featured ebooks");
    }
  }

  async getEbookById(id: number) {
    try {
      const ebook = await storage.getEbookById(id);
      
      // Format ebook for client
      return {
        id: ebook.id,
        title: ebook.title,
        author: ebook.author,
        description: ebook.description,
        coverUrl: ebook.cover_url,
        fileUrl: ebook.file_url,
        categories: [ebook.category],
        created_at: ebook.created_at
      };
    } catch (error) {
      console.error("Error in getEbookById:", error);
      throw new Error("Failed to get ebook");
    }
  }

  async getEbookFileInfo(id: number): Promise<EbookFileInfo> {
    try {
      const ebook = await storage.getEbookById(id);
      
      // Format filename based on title
      const filename = `${ebook.title.replace(/\s+/g, "-").toLowerCase()}.pdf`;
      
      return {
        filename,
        url: ebook.file_url
      };
    } catch (error) {
      console.error("Error in getEbookFileInfo:", error);
      throw new Error("Failed to get ebook file info");
    }
  }

  async createEbook(ebookData: InsertEbook) {
    try {
      const newEbook = await storage.createEbook(ebookData);
      return newEbook;
    } catch (error) {
      console.error("Error in createEbook:", error);
      throw new Error("Failed to create ebook");
    }
  }

  async updateEbook(id: number, ebookData: Partial<InsertEbook>) {
    try {
      const updatedEbook = await storage.updateEbook(id, ebookData);
      return updatedEbook;
    } catch (error) {
      console.error("Error in updateEbook:", error);
      throw new Error("Failed to update ebook");
    }
  }

  async deleteEbook(id: number) {
    try {
      await storage.deleteEbook(id);
    } catch (error) {
      console.error("Error in deleteEbook:", error);
      throw new Error("Failed to delete ebook");
    }
  }
}

export const ebookService = new EbookService();

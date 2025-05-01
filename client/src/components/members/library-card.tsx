import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface LibraryCardProps {
  ebook: {
    id: number;
    title: string;
    author: string;
    coverUrl: string;
    fileUrl: string;
    categories: string[];
  };
}

export default function LibraryCard({ ebook }: LibraryCardProps) {
  const { toast } = useToast();
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      const response = await fetch(`/api/ebooks/${ebook.id}/download`);
      
      if (!response.ok) {
        throw new Error("Failed to download ebook");
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      
      // Create a link element and trigger download
      const a = document.createElement("a");
      a.href = url;
      a.download = `${ebook.title.replace(/\s+/g, "-").toLowerCase()}.pdf`;
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast({
        title: "Download iniciado",
        description: `O ebook "${ebook.title}" está sendo baixado.`,
      });
    } catch (error) {
      toast({
        title: "Erro no download",
        description: "Não foi possível baixar o ebook. Tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <Card className="overflow-hidden h-full flex flex-col">
      <div className="h-48 overflow-hidden">
        <img
          src={ebook.coverUrl}
          alt={`Capa do E-book ${ebook.title}`}
          className="w-full h-full object-cover"
        />
      </div>
      <CardContent className="p-4 flex flex-col flex-grow">
        <h3 className="font-montserrat font-semibold text-lg mb-1 line-clamp-2">
          {ebook.title}
        </h3>
        <p className="text-gray-500 text-sm mb-2">{ebook.author}</p>
        
        <div className="flex flex-wrap gap-1 mb-3">
          {ebook.categories.map((category, index) => (
            <span 
              key={index}
              className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded"
            >
              {category}
            </span>
          ))}
        </div>
        
        <div className="mt-auto">
          <Button 
            onClick={handleDownload} 
            className="w-full bg-primary hover:bg-primary/90"
            disabled={isDownloading}
          >
            <Download className="mr-2 h-4 w-4" />
            {isDownloading ? "Baixando..." : "Baixar PDF"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

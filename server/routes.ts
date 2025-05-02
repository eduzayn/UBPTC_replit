import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { credentialService } from "./services/credential-service";
import { ebookService } from "./services/ebook-service";
import { eventService } from "./services/event-service";
import { paymentService } from "./services/payment-service";
import { certificateService } from "./services/certificate-service";

// Middleware to check if user is authenticated
const isAuthenticated = (req: any, res: any, next: any) => {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.status(401).json({ message: "Não autenticado" });
};

// Middleware to check if user has an active subscription
const hasActiveSubscription = async (req: any, res: any, next: any) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Não autenticado" });
  }
  
  // Public routes that don't require active subscription
  const publicRoutes = [
    '/api/payments/status',
    '/api/payments/create-link',
    '/api/payments/update-method'
  ];
  
  // Skip subscription check for payment-related routes
  if (publicRoutes.some(route => req.path.startsWith(route))) {
    return next();
  }
  
  // Skip subscription check for admins
  if (req.user.role === 'admin') {
    return next();
  }
  
  try {
    // Check if user has active subscription
    const status = req.user.subscription_status;
    
    if (status !== 'active') {
      return res.status(403).json({ 
        message: "Pagamento pendente: É necessário regularizar sua assinatura para acessar este recurso.", 
        code: "INACTIVE_SUBSCRIPTION" 
      });
    }
    
    next();
  } catch (error) {
    console.error("Error checking subscription:", error);
    // Por segurança, se ocorrer erro ao verificar a assinatura, bloqueamos o acesso
    return res.status(403).json({ 
      message: "Erro ao verificar status do pagamento. Entre em contato com o suporte.", 
      code: "SUBSCRIPTION_CHECK_ERROR" 
    });
  }
};

// Middleware to check if user is admin
const isAdmin = (req: any, res: any, next: any) => {
  if (req.isAuthenticated() && req.user.role === "admin") {
    return next();
  }
  return res.status(403).json({ message: "Acesso não autorizado" });
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication routes
  setupAuth(app);

  // Credentials routes
  app.get("/api/credentials/my", isAuthenticated, hasActiveSubscription, async (req, res) => {
    try {
      const credential = await credentialService.getUserCredential(req.user.id);
      res.json(credential);
    } catch (error) {
      res.status(500).json({ message: "Erro ao buscar credencial" });
    }
  });

  app.get("/api/credentials/:id/download", isAuthenticated, hasActiveSubscription, async (req, res) => {
    try {
      const pdfBuffer = await credentialService.generateCredentialPDF(parseInt(req.params.id));
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", `attachment; filename=credencial-ubpct.pdf`);
      res.send(pdfBuffer);
    } catch (error) {
      res.status(500).json({ message: "Erro ao gerar PDF da credencial" });
    }
  });

  app.get("/api/validate/:credentialNumber", async (req, res) => {
    try {
      const validationData = await credentialService.validateCredential(req.params.credentialNumber);
      res.json(validationData);
    } catch (error) {
      res.status(404).json({ message: "Credencial não encontrada ou inválida" });
    }
  });

  // Ebooks routes
  app.get("/api/ebooks", isAuthenticated, hasActiveSubscription, async (req, res) => {
    try {
      const ebooks = await ebookService.getAllEbooks();
      res.json(ebooks);
    } catch (error) {
      res.status(500).json({ message: "Erro ao buscar ebooks" });
    }
  });

  app.get("/api/ebooks/featured", async (req, res) => {
    try {
      const featuredEbooks = await ebookService.getFeaturedEbooks();
      res.json(featuredEbooks);
    } catch (error) {
      res.status(500).json({ message: "Erro ao buscar ebooks em destaque" });
    }
  });

  app.get("/api/ebooks/:id", isAuthenticated, hasActiveSubscription, async (req, res) => {
    try {
      const ebook = await ebookService.getEbookById(parseInt(req.params.id));
      res.json(ebook);
    } catch (error) {
      res.status(404).json({ message: "Ebook não encontrado" });
    }
  });

  app.get("/api/ebooks/:id/download", isAuthenticated, hasActiveSubscription, async (req, res) => {
    try {
      const fileInfo = await ebookService.getEbookFileInfo(parseInt(req.params.id));
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", `attachment; filename=${fileInfo.filename}`);
      
      // Redirect to file URL or stream the file
      res.redirect(fileInfo.url);
    } catch (error) {
      res.status(500).json({ message: "Erro ao baixar ebook" });
    }
  });

  // Admin ebook management
  app.post("/api/ebooks", isAdmin, async (req, res) => {
    try {
      const newEbook = await ebookService.createEbook(req.body);
      res.status(201).json(newEbook);
    } catch (error) {
      res.status(500).json({ message: "Erro ao criar ebook" });
    }
  });

  app.put("/api/ebooks/:id", isAdmin, async (req, res) => {
    try {
      const updatedEbook = await ebookService.updateEbook(parseInt(req.params.id), req.body);
      res.json(updatedEbook);
    } catch (error) {
      res.status(500).json({ message: "Erro ao atualizar ebook" });
    }
  });

  app.delete("/api/ebooks/:id", isAdmin, async (req, res) => {
    try {
      await ebookService.deleteEbook(parseInt(req.params.id));
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Erro ao excluir ebook" });
    }
  });

  // Events routes
  app.get("/api/events", isAuthenticated, hasActiveSubscription, async (req, res) => {
    try {
      const events = await eventService.getEventsForUser(req.user.id);
      res.json(events);
    } catch (error) {
      res.status(500).json({ message: "Erro ao buscar eventos" });
    }
  });

  app.get("/api/events/upcoming", async (req, res) => {
    try {
      const upcomingEvents = await eventService.getUpcomingEvents();
      res.json(upcomingEvents);
    } catch (error) {
      res.status(500).json({ message: "Erro ao buscar próximos eventos" });
    }
  });

  app.get("/api/events/:id", isAuthenticated, hasActiveSubscription, async (req, res) => {
    try {
      const event = await eventService.getEventById(parseInt(req.params.id));
      res.json(event);
    } catch (error) {
      res.status(404).json({ message: "Evento não encontrado" });
    }
  });

  app.post("/api/events/:id/register", isAuthenticated, hasActiveSubscription, async (req, res) => {
    try {
      const registration = await eventService.registerUserForEvent(req.user.id, parseInt(req.params.id));
      res.status(201).json(registration);
    } catch (error) {
      res.status(500).json({ message: "Erro ao registrar para o evento" });
    }
  });

  app.get("/api/events/:id/certificate", isAuthenticated, hasActiveSubscription, async (req, res) => {
    try {
      const certificateFile = await eventService.getEventCertificate(req.user.id, parseInt(req.params.id));
      
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", `attachment; filename=certificado-evento.pdf`);
      
      // Redirect to file URL or stream the file
      res.redirect(certificateFile);
    } catch (error) {
      res.status(500).json({ message: "Erro ao gerar certificado do evento" });
    }
  });

  // Admin event management
  app.post("/api/events", isAdmin, async (req, res) => {
    try {
      const newEvent = await eventService.createEvent(req.body);
      res.status(201).json(newEvent);
    } catch (error) {
      res.status(500).json({ message: "Erro ao criar evento" });
    }
  });

  app.put("/api/events/:id", isAdmin, async (req, res) => {
    try {
      const updatedEvent = await eventService.updateEvent(parseInt(req.params.id), req.body);
      res.json(updatedEvent);
    } catch (error) {
      res.status(500).json({ message: "Erro ao atualizar evento" });
    }
  });

  app.delete("/api/events/:id", isAdmin, async (req, res) => {
    try {
      await eventService.deleteEvent(parseInt(req.params.id));
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Erro ao excluir evento" });
    }
  });

  app.put("/api/events/:id/attendance", isAdmin, async (req, res) => {
    try {
      const { userId, attended } = req.body;
      const updatedRegistration = await eventService.updateAttendance(parseInt(req.params.id), userId, attended);
      res.json(updatedRegistration);
    } catch (error) {
      res.status(500).json({ message: "Erro ao atualizar presença" });
    }
  });

  // Payments routes
  app.post("/api/payments/create-link", async (req, res) => {
    try {
      const { memberData, plan } = req.body;
      const paymentLink = await paymentService.createPaymentLink(memberData, plan);
      res.json({ paymentLink });
    } catch (error) {
      res.status(500).json({ message: "Erro ao criar link de pagamento" });
    }
  });

  app.get("/api/payments/status/:userId", isAuthenticated, async (req, res) => {
    try {
      const status = await paymentService.getPaymentStatus(parseInt(req.params.userId));
      res.json(status);
    } catch (error) {
      res.status(500).json({ message: "Erro ao verificar status de pagamento" });
    }
  });

  app.post("/api/payments/update-method", isAuthenticated, async (req, res) => {
    try {
      const { userId, plan } = req.body;
      if (parseInt(userId.toString()) !== req.user.id && req.user.role !== "admin") {
        return res.status(403).json({ message: "Acesso não autorizado" });
      }
      
      const result = await paymentService.updatePaymentMethod(parseInt(userId.toString()), plan);
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: "Erro ao atualizar método de pagamento" });
    }
  });

  app.post("/api/webhook/asaas", async (req, res) => {
    try {
      await paymentService.handleWebhook(req.body);
      res.status(200).send();
    } catch (error) {
      console.error("Webhook error:", error);
      res.status(500).json({ message: "Erro ao processar webhook" });
    }
  });

  // Certificates routes
  app.get("/api/certificates", isAuthenticated, hasActiveSubscription, async (req, res) => {
    try {
      const certificates = await certificateService.getUserCertificates(req.user.id);
      res.json(certificates);
    } catch (error) {
      res.status(500).json({ message: "Erro ao buscar certificados" });
    }
  });

  app.get("/api/certificates/:id/download", isAuthenticated, hasActiveSubscription, async (req, res) => {
    try {
      const certificateFile = await certificateService.getCertificateFile(parseInt(req.params.id), req.user.id);
      
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", `attachment; filename=certificado-ubpct.pdf`);
      
      // Redirect to file URL or stream the file
      res.redirect(certificateFile);
    } catch (error) {
      res.status(500).json({ message: "Erro ao baixar certificado" });
    }
  });

  // Admin certificate management
  app.post("/api/certificates", isAdmin, async (req, res) => {
    try {
      const newCertificate = await certificateService.createCertificate(req.body);
      res.status(201).json(newCertificate);
    } catch (error) {
      res.status(500).json({ message: "Erro ao criar certificado" });
    }
  });

  // Benefits routes
  app.get("/api/benefits", isAuthenticated, hasActiveSubscription, async (req, res) => {
    try {
      const benefits = await storage.getAllBenefits();
      res.json(benefits);
    } catch (error) {
      res.status(500).json({ message: "Erro ao buscar benefícios" });
    }
  });

  // Admin user management
  app.get("/api/users", isAdmin, async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: "Erro ao buscar usuários" });
    }
  });

  app.get("/api/users/:id", isAdmin, async (req, res) => {
    try {
      const user = await storage.getUserById(parseInt(req.params.id));
      res.json(user);
    } catch (error) {
      res.status(404).json({ message: "Usuário não encontrado" });
    }
  });

  app.put("/api/users/:id", isAdmin, async (req, res) => {
    try {
      const updatedUser = await storage.updateUser(parseInt(req.params.id), req.body);
      res.json(updatedUser);
    } catch (error) {
      res.status(500).json({ message: "Erro ao atualizar usuário" });
    }
  });

  app.delete("/api/users/:id", isAdmin, async (req, res) => {
    try {
      await storage.deleteUser(parseInt(req.params.id));
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Erro ao excluir usuário" });
    }
  });

  // Admin benefit management
  app.post("/api/benefits", isAdmin, async (req, res) => {
    try {
      const newBenefit = await storage.createBenefit(req.body);
      res.status(201).json(newBenefit);
    } catch (error) {
      res.status(500).json({ message: "Erro ao criar benefício" });
    }
  });

  app.put("/api/benefits/:id", isAdmin, async (req, res) => {
    try {
      const updatedBenefit = await storage.updateBenefit(parseInt(req.params.id), req.body);
      res.json(updatedBenefit);
    } catch (error) {
      res.status(500).json({ message: "Erro ao atualizar benefício" });
    }
  });

  app.delete("/api/benefits/:id", isAdmin, async (req, res) => {
    try {
      await storage.deleteBenefit(parseInt(req.params.id));
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Erro ao excluir benefício" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

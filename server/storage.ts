import { db } from "@db";
import * as schema from "@shared/schema";
import { eq, and, desc, asc } from "drizzle-orm";
import connectPg from "connect-pg-simple";
import session from "express-session";
import { pool } from "@db";

const PostgresSessionStore = connectPg(session);

export interface IStorage {
  // User operations
  getUserById(id: number): Promise<schema.User>;
  getUserByEmail(email: string): Promise<schema.User | undefined>;
  createUser(userData: schema.InsertUser): Promise<schema.User>;
  updateUser(id: number, userData: Partial<schema.InsertUser>): Promise<schema.User>;
  deleteUser(id: number): Promise<void>;
  getAllUsers(): Promise<schema.User[]>;

  // Credential operations
  getCredentialByUserId(userId: number): Promise<schema.Credential | undefined>;
  getCredentialByNumber(credentialNumber: string): Promise<schema.Credential | undefined>;
  createCredential(credentialData: schema.InsertCredential): Promise<schema.Credential>;
  updateCredential(id: number, credentialData: Partial<schema.InsertCredential>): Promise<schema.Credential>;

  // Payment operations
  getPaymentsByUserId(userId: number): Promise<schema.Payment[]>;
  createPayment(paymentData: schema.InsertPayment): Promise<schema.Payment>;
  updatePaymentStatus(id: number, status: string): Promise<schema.Payment>;

  // Ebook operations
  getAllEbooks(): Promise<schema.Ebook[]>;
  getEbookById(id: number): Promise<schema.Ebook>;
  createEbook(ebookData: schema.InsertEbook): Promise<schema.Ebook>;
  updateEbook(id: number, ebookData: Partial<schema.InsertEbook>): Promise<schema.Ebook>;
  deleteEbook(id: number): Promise<void>;
  
  // Event operations
  getAllEvents(): Promise<schema.Event[]>;
  getEventById(id: number): Promise<schema.Event>;
  getUpcomingEvents(): Promise<schema.Event[]>;
  createEvent(eventData: schema.InsertEvent): Promise<schema.Event>;
  updateEvent(id: number, eventData: Partial<schema.InsertEvent>): Promise<schema.Event>;
  deleteEvent(id: number): Promise<void>;
  
  // Event registration operations
  getEventRegistrations(eventId: number): Promise<schema.EventRegistration[]>;
  getUserEventRegistrations(userId: number): Promise<schema.EventRegistration[]>;
  getEventRegistration(eventId: number, userId: number): Promise<schema.EventRegistration | undefined>;
  createEventRegistration(registrationData: schema.InsertEventRegistration): Promise<schema.EventRegistration>;
  updateEventRegistration(id: number, data: Partial<schema.InsertEventRegistration>): Promise<schema.EventRegistration>;
  
  // Certificate operations
  getUserCertificates(userId: number): Promise<schema.Certificate[]>;
  getCertificateById(id: number): Promise<schema.Certificate>;
  createCertificate(certificateData: schema.InsertCertificate): Promise<schema.Certificate>;
  
  // Benefit operations
  getAllBenefits(): Promise<schema.Benefit[]>;
  getBenefitById(id: number): Promise<schema.Benefit>;
  createBenefit(benefitData: schema.InsertBenefit): Promise<schema.Benefit>;
  updateBenefit(id: number, benefitData: Partial<schema.InsertBenefit>): Promise<schema.Benefit>;
  deleteBenefit(id: number): Promise<void>;
  
  sessionStore: session.SessionStore;
}

class DatabaseStorage implements IStorage {
  sessionStore: session.SessionStore;

  constructor() {
    this.sessionStore = new PostgresSessionStore({
      pool,
      createTableIfMissing: true,
    });
  }

  // User operations
  async getUserById(id: number): Promise<schema.User> {
    const user = await db.query.users.findFirst({
      where: eq(schema.users.id, id)
    });
    
    if (!user) {
      throw new Error("Usuário não encontrado");
    }
    
    return user;
  }

  async getUserByEmail(email: string): Promise<schema.User | undefined> {
    return await db.query.users.findFirst({
      where: eq(schema.users.email, email)
    });
  }

  async createUser(userData: schema.InsertUser): Promise<schema.User> {
    const [user] = await db.insert(schema.users).values(userData).returning();
    return user;
  }

  async updateUser(id: number, userData: Partial<schema.InsertUser>): Promise<schema.User> {
    const [updatedUser] = await db
      .update(schema.users)
      .set(userData)
      .where(eq(schema.users.id, id))
      .returning();
    
    return updatedUser;
  }

  async deleteUser(id: number): Promise<void> {
    await db.delete(schema.users).where(eq(schema.users.id, id));
  }

  async getAllUsers(): Promise<schema.User[]> {
    return await db.query.users.findMany({
      orderBy: [asc(schema.users.name)]
    });
  }

  // Credential operations
  async getCredentialByUserId(userId: number): Promise<schema.Credential | undefined> {
    return await db.query.credentials.findFirst({
      where: eq(schema.credentials.user_id, userId)
    });
  }

  async getCredentialByNumber(credentialNumber: string): Promise<schema.Credential | undefined> {
    return await db.query.credentials.findFirst({
      where: eq(schema.credentials.credential_number, credentialNumber)
    });
  }

  async createCredential(credentialData: schema.InsertCredential): Promise<schema.Credential> {
    const [credential] = await db.insert(schema.credentials).values(credentialData).returning();
    return credential;
  }

  async updateCredential(id: number, credentialData: Partial<schema.InsertCredential>): Promise<schema.Credential> {
    const [updatedCredential] = await db
      .update(schema.credentials)
      .set(credentialData)
      .where(eq(schema.credentials.id, id))
      .returning();
    
    return updatedCredential;
  }

  // Payment operations
  async getPaymentsByUserId(userId: number): Promise<schema.Payment[]> {
    return await db.query.payments.findMany({
      where: eq(schema.payments.user_id, userId),
      orderBy: [desc(schema.payments.created_at)]
    });
  }

  async createPayment(paymentData: schema.InsertPayment): Promise<schema.Payment> {
    const [payment] = await db.insert(schema.payments).values(paymentData).returning();
    return payment;
  }

  async updatePaymentStatus(id: number, status: string): Promise<schema.Payment> {
    const [updatedPayment] = await db
      .update(schema.payments)
      .set({ status, updated_at: new Date() })
      .where(eq(schema.payments.id, id))
      .returning();
    
    return updatedPayment;
  }

  // Ebook operations
  async getAllEbooks(): Promise<schema.Ebook[]> {
    return await db.query.ebooks.findMany({
      orderBy: [asc(schema.ebooks.title)]
    });
  }

  async getEbookById(id: number): Promise<schema.Ebook> {
    const ebook = await db.query.ebooks.findFirst({
      where: eq(schema.ebooks.id, id)
    });
    
    if (!ebook) {
      throw new Error("Ebook não encontrado");
    }
    
    return ebook;
  }

  async createEbook(ebookData: schema.InsertEbook): Promise<schema.Ebook> {
    const [ebook] = await db.insert(schema.ebooks).values(ebookData).returning();
    return ebook;
  }

  async updateEbook(id: number, ebookData: Partial<schema.InsertEbook>): Promise<schema.Ebook> {
    const [updatedEbook] = await db
      .update(schema.ebooks)
      .set(ebookData)
      .where(eq(schema.ebooks.id, id))
      .returning();
    
    return updatedEbook;
  }

  async deleteEbook(id: number): Promise<void> {
    await db.delete(schema.ebooks).where(eq(schema.ebooks.id, id));
  }

  // Event operations
  async getAllEvents(): Promise<schema.Event[]> {
    return await db.query.events.findMany({
      orderBy: [desc(schema.events.event_date)]
    });
  }

  async getEventById(id: number): Promise<schema.Event> {
    const event = await db.query.events.findFirst({
      where: eq(schema.events.id, id)
    });
    
    if (!event) {
      throw new Error("Evento não encontrado");
    }
    
    return event;
  }

  async getUpcomingEvents(): Promise<schema.Event[]> {
    const today = new Date();
    return await db.query.events.findMany({
      where: (events, { gte }) => gte(events.event_date, today),
      orderBy: [asc(schema.events.event_date)],
      limit: 3
    });
  }

  async createEvent(eventData: schema.InsertEvent): Promise<schema.Event> {
    const [event] = await db.insert(schema.events).values(eventData).returning();
    return event;
  }

  async updateEvent(id: number, eventData: Partial<schema.InsertEvent>): Promise<schema.Event> {
    const [updatedEvent] = await db
      .update(schema.events)
      .set(eventData)
      .where(eq(schema.events.id, id))
      .returning();
    
    return updatedEvent;
  }

  async deleteEvent(id: number): Promise<void> {
    await db.delete(schema.events).where(eq(schema.events.id, id));
  }

  // Event registration operations
  async getEventRegistrations(eventId: number): Promise<schema.EventRegistration[]> {
    return await db.query.eventRegistrations.findMany({
      where: eq(schema.eventRegistrations.event_id, eventId)
    });
  }

  async getUserEventRegistrations(userId: number): Promise<schema.EventRegistration[]> {
    return await db.query.eventRegistrations.findMany({
      where: eq(schema.eventRegistrations.user_id, userId)
    });
  }

  async getEventRegistration(eventId: number, userId: number): Promise<schema.EventRegistration | undefined> {
    return await db.query.eventRegistrations.findFirst({
      where: and(
        eq(schema.eventRegistrations.event_id, eventId),
        eq(schema.eventRegistrations.user_id, userId)
      )
    });
  }

  async createEventRegistration(registrationData: schema.InsertEventRegistration): Promise<schema.EventRegistration> {
    const [registration] = await db.insert(schema.eventRegistrations).values(registrationData).returning();
    return registration;
  }

  async updateEventRegistration(id: number, data: Partial<schema.InsertEventRegistration>): Promise<schema.EventRegistration> {
    const [updatedRegistration] = await db
      .update(schema.eventRegistrations)
      .set(data)
      .where(eq(schema.eventRegistrations.id, id))
      .returning();
    
    return updatedRegistration;
  }

  // Certificate operations
  async getUserCertificates(userId: number): Promise<schema.Certificate[]> {
    return await db.query.certificates.findMany({
      where: eq(schema.certificates.user_id, userId),
      orderBy: [desc(schema.certificates.issue_date)]
    });
  }

  async getCertificateById(id: number): Promise<schema.Certificate> {
    const certificate = await db.query.certificates.findFirst({
      where: eq(schema.certificates.id, id)
    });
    
    if (!certificate) {
      throw new Error("Certificado não encontrado");
    }
    
    return certificate;
  }

  async createCertificate(certificateData: schema.InsertCertificate): Promise<schema.Certificate> {
    const [certificate] = await db.insert(schema.certificates).values(certificateData).returning();
    return certificate;
  }

  // Benefit operations
  async getAllBenefits(): Promise<schema.Benefit[]> {
    return await db.query.benefits.findMany({
      where: eq(schema.benefits.active, true),
      orderBy: [asc(schema.benefits.company)]
    });
  }

  async getBenefitById(id: number): Promise<schema.Benefit> {
    const benefit = await db.query.benefits.findFirst({
      where: eq(schema.benefits.id, id)
    });
    
    if (!benefit) {
      throw new Error("Benefício não encontrado");
    }
    
    return benefit;
  }

  async createBenefit(benefitData: schema.InsertBenefit): Promise<schema.Benefit> {
    const [benefit] = await db.insert(schema.benefits).values(benefitData).returning();
    return benefit;
  }

  async updateBenefit(id: number, benefitData: Partial<schema.InsertBenefit>): Promise<schema.Benefit> {
    const [updatedBenefit] = await db
      .update(schema.benefits)
      .set(benefitData)
      .where(eq(schema.benefits.id, id))
      .returning();
    
    return updatedBenefit;
  }

  async deleteBenefit(id: number): Promise<void> {
    await db.delete(schema.benefits).where(eq(schema.benefits.id, id));
  }
}

export const storage: IStorage = new DatabaseStorage();

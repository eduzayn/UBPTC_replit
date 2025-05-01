import { pgTable, text, serial, integer, boolean, timestamp, date } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  phone: text("phone").notNull(),
  cpf: text("cpf").notNull().unique(),
  occupation: text("occupation").notNull(),
  graduated: boolean("graduated").notNull().default(false),
  role: text("role").notNull().default("member"), // member, admin
  subscription_status: text("subscription_status").notNull().default("pending"), // pending, active, inactive
  photo_url: text("photo_url"),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

export const usersRelations = relations(users, ({ one, many }) => ({
  credential: one(credentials),
  payments: many(payments),
  events: many(eventRegistrations),
  certificates: many(certificates),
}));

// Credentials table
export const credentials = pgTable("credentials", {
  id: serial("id").primaryKey(),
  user_id: integer("user_id").references(() => users.id).notNull(),
  credential_number: text("credential_number").notNull().unique(),
  qr_code: text("qr_code").notNull(),
  issue_date: date("issue_date").notNull(),
  expiry_date: date("expiry_date").notNull(),
  status: text("status").notNull().default("active"), // active, inactive, expired
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

export const credentialsRelations = relations(credentials, ({ one }) => ({
  user: one(users, {
    fields: [credentials.user_id],
    references: [users.id],
  }),
}));

// Payments table
export const payments = pgTable("payments", {
  id: serial("id").primaryKey(),
  user_id: integer("user_id").references(() => users.id).notNull(),
  amount: text("amount").notNull(),
  plan: text("plan").notNull(), // monthly, annual
  status: text("status").notNull(), // paid, pending, failed, refunded
  payment_method: text("payment_method"), // credit_card, boleto, pix
  external_id: text("external_id"), // Asaas payment ID
  payment_date: timestamp("payment_date"),
  due_date: date("due_date").notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

export const paymentsRelations = relations(payments, ({ one }) => ({
  user: one(users, {
    fields: [payments.user_id],
    references: [users.id],
  }),
}));

// Ebooks table
export const ebooks = pgTable("ebooks", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  author: text("author").notNull(),
  description: text("description").notNull(),
  cover_url: text("cover_url").notNull(),
  file_url: text("file_url").notNull(),
  category: text("category").notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

// Events table
export const events = pgTable("events", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  type: text("type").notNull(), // palestra, supervisao, grupo_estudo
  event_date: date("event_date").notNull(),
  start_time: text("start_time").notNull(),
  end_time: text("end_time").notNull(),
  meeting_url: text("meeting_url"),
  certificate_template: text("certificate_template"),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

// Event registrations table
export const eventRegistrations = pgTable("event_registrations", {
  id: serial("id").primaryKey(),
  event_id: integer("event_id").references(() => events.id).notNull(),
  user_id: integer("user_id").references(() => users.id).notNull(),
  attended: boolean("attended").default(false),
  certificate_issued: boolean("certificate_issued").default(false),
  created_at: timestamp("created_at").defaultNow().notNull(),
});

export const eventRegistrationsRelations = relations(eventRegistrations, ({ one }) => ({
  event: one(events, {
    fields: [eventRegistrations.event_id],
    references: [events.id],
  }),
  user: one(users, {
    fields: [eventRegistrations.user_id],
    references: [users.id],
  }),
}));

// Certificates table
export const certificates = pgTable("certificates", {
  id: serial("id").primaryKey(),
  user_id: integer("user_id").references(() => users.id).notNull(),
  type: text("type").notNull(), // formacao_livre, pos_graduacao, evento
  event_id: integer("event_id").references(() => events.id),
  issue_date: date("issue_date").notNull(),
  expiry_date: date("expiry_date"),
  file_url: text("file_url").notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
});

export const certificatesRelations = relations(certificates, ({ one }) => ({
  user: one(users, {
    fields: [certificates.user_id],
    references: [users.id],
  }),
  event: one(events, {
    fields: [certificates.event_id],
    references: [events.id],
  }),
}));

// Benefits/Partnerships table
export const benefits = pgTable("benefits", {
  id: serial("id").primaryKey(),
  company: text("company").notNull(),
  description: text("description").notNull(),
  discount: text("discount").notNull(),
  category: text("category").notNull(),
  logo_url: text("logo_url"),
  contact_info: text("contact_info"),
  website: text("website"),
  active: boolean("active").default(true),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

// Validation schemas
export const insertUserSchema = createInsertSchema(users, {
  name: (schema) => schema.min(3, "Nome deve ter pelo menos 3 caracteres"),
  email: (schema) => schema.email("Email deve ser válido"),
  password: (schema) => schema.min(6, "Senha deve ter pelo menos 6 caracteres"),
  phone: (schema) => schema.min(10, "Telefone deve ser válido"),
  cpf: (schema) => schema.min(11, "CPF deve ser válido"),
  occupation: (schema) => schema.min(2, "Ocupação deve ser válida"),
});

export const insertCredentialSchema = createInsertSchema(credentials);
export const insertPaymentSchema = createInsertSchema(payments);
export const insertEbookSchema = createInsertSchema(ebooks);
export const insertEventSchema = createInsertSchema(events);
export const insertEventRegistrationSchema = createInsertSchema(eventRegistrations);
export const insertCertificateSchema = createInsertSchema(certificates);
export const insertBenefitSchema = createInsertSchema(benefits);

// Type exports
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Credential = typeof credentials.$inferSelect;
export type InsertCredential = z.infer<typeof insertCredentialSchema>;

export type Payment = typeof payments.$inferSelect;
export type InsertPayment = z.infer<typeof insertPaymentSchema>;

export type Ebook = typeof ebooks.$inferSelect;
export type InsertEbook = z.infer<typeof insertEbookSchema>;

export type Event = typeof events.$inferSelect;
export type InsertEvent = z.infer<typeof insertEventSchema>;

export type EventRegistration = typeof eventRegistrations.$inferSelect;
export type InsertEventRegistration = z.infer<typeof insertEventRegistrationSchema>;

export type Certificate = typeof certificates.$inferSelect;
export type InsertCertificate = z.infer<typeof insertCertificateSchema>;

export type Benefit = typeof benefits.$inferSelect;
export type InsertBenefit = z.infer<typeof insertBenefitSchema>;

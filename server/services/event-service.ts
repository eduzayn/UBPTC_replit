import { storage } from "../storage";
import { InsertEvent } from "@shared/schema";

class EventService {
  async getEventsForUser(userId: number) {
    try {
      // Get all events
      const events = await storage.getAllEvents();
      
      // Get user registrations
      const userRegistrations = await storage.getUserEventRegistrations(userId);
      
      // Map of event IDs to registration status
      const registrationMap = new Map();
      userRegistrations.forEach(reg => {
        registrationMap.set(reg.event_id, {
          registered: true,
          attended: reg.attended
        });
      });
      
      // Format events for client
      return events.map(event => {
        const registrationInfo = registrationMap.get(event.id) || { registered: false, attended: false };
        const eventDate = new Date(event.event_date);
        
        return {
          id: event.id,
          title: event.title,
          description: event.description,
          type: event.type,
          date: eventDate.toLocaleDateString("pt-BR", { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          }),
          time: `${event.start_time} - ${event.end_time}`,
          meetingUrl: event.meeting_url,
          certificateAvailable: !!event.certificate_template,
          registered: registrationInfo.registered,
          attended: registrationInfo.attended
        };
      });
    } catch (error) {
      console.error("Error in getEventsForUser:", error);
      throw new Error("Failed to get events");
    }
  }

  async getUpcomingEvents() {
    try {
      const events = await storage.getUpcomingEvents();
      
      // Format events for client
      return events.map(event => {
        const eventDate = new Date(event.event_date);
        
        return {
          id: event.id,
          title: event.title,
          description: event.description,
          type: event.type,
          date: eventDate.toLocaleDateString("pt-BR", { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          }),
          time: `${event.start_time} - ${event.end_time}`
        };
      });
    } catch (error) {
      console.error("Error in getUpcomingEvents:", error);
      throw new Error("Failed to get upcoming events");
    }
  }

  async getEventById(id: number) {
    try {
      const event = await storage.getEventById(id);
      const eventDate = new Date(event.event_date);
      
      return {
        id: event.id,
        title: event.title,
        description: event.description,
        type: event.type,
        date: eventDate.toLocaleDateString("pt-BR", { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        }),
        time: `${event.start_time} - ${event.end_time}`,
        meetingUrl: event.meeting_url,
        certificateAvailable: !!event.certificate_template
      };
    } catch (error) {
      console.error("Error in getEventById:", error);
      throw new Error("Failed to get event");
    }
  }

  async registerUserForEvent(userId: number, eventId: number) {
    try {
      // Check if already registered
      const existingRegistration = await storage.getEventRegistration(eventId, userId);
      
      if (existingRegistration) {
        return existingRegistration;
      }
      
      // Create new registration
      const registration = await storage.createEventRegistration({
        event_id: eventId,
        user_id: userId,
        attended: false,
        certificate_issued: false
      });
      
      return registration;
    } catch (error) {
      console.error("Error in registerUserForEvent:", error);
      throw new Error("Failed to register for event");
    }
  }

  async updateAttendance(eventId: number, userId: number, attended: boolean) {
    try {
      const registration = await storage.getEventRegistration(eventId, userId);
      
      if (!registration) {
        throw new Error("Registration not found");
      }
      
      const updatedRegistration = await storage.updateEventRegistration(registration.id, {
        attended
      });
      
      return updatedRegistration;
    } catch (error) {
      console.error("Error in updateAttendance:", error);
      throw new Error("Failed to update attendance");
    }
  }

  async getEventCertificate(userId: number, eventId: number) {
    try {
      // Check if user attended the event
      const registration = await storage.getEventRegistration(eventId, userId);
      
      if (!registration || !registration.attended) {
        throw new Error("Not eligible for certificate");
      }
      
      const event = await storage.getEventById(eventId);
      
      if (!event.certificate_template) {
        throw new Error("Certificate template not available");
      }
      
      // Check if certificate already exists
      const certificates = await storage.getUserCertificates(userId);
      const eventCertificate = certificates.find(cert => cert.event_id === eventId);
      
      if (eventCertificate) {
        return eventCertificate.file_url;
      }
      
      // In a real implementation, we would generate the certificate here
      // For this example, we'll create a certificate record and return a sample URL
      const certificateUrl = `/certificates/event-${eventId}-user-${userId}.pdf`;
      
      // Create certificate record
      await storage.createCertificate({
        user_id: userId,
        type: "evento",
        event_id: eventId,
        issue_date: new Date(),
        file_url: certificateUrl
      });
      
      // Update registration status
      await storage.updateEventRegistration(registration.id, {
        certificate_issued: true
      });
      
      return certificateUrl;
    } catch (error) {
      console.error("Error in getEventCertificate:", error);
      throw new Error("Failed to get event certificate");
    }
  }

  async createEvent(eventData: InsertEvent) {
    try {
      const newEvent = await storage.createEvent(eventData);
      return newEvent;
    } catch (error) {
      console.error("Error in createEvent:", error);
      throw new Error("Failed to create event");
    }
  }

  async updateEvent(id: number, eventData: Partial<InsertEvent>) {
    try {
      const updatedEvent = await storage.updateEvent(id, eventData);
      return updatedEvent;
    } catch (error) {
      console.error("Error in updateEvent:", error);
      throw new Error("Failed to update event");
    }
  }

  async deleteEvent(id: number) {
    try {
      await storage.deleteEvent(id);
    } catch (error) {
      console.error("Error in deleteEvent:", error);
      throw new Error("Failed to delete event");
    }
  }
}

export const eventService = new EventService();

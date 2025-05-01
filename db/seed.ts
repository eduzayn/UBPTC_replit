import { db } from "./index";
import * as schema from "@shared/schema";
import { hashPassword } from "../server/auth";

async function seed() {
  try {
    console.log("Seeding database...");

    // Create admin user
    const adminExists = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.email, "admin@ubpct.com.br")
    });

    if (!adminExists) {
      const adminPassword = await hashPassword("admin123");
      await db.insert(schema.users).values({
        name: "Admin UBPCT",
        email: "admin@ubpct.com.br",
        password: adminPassword,
        phone: "11999999999",
        cpf: "12345678901",
        occupation: "administrador",
        graduated: true,
        role: "admin",
        subscription_status: "active"
      });
      console.log("Admin user created");
    }

    // Seed ebooks
    const ebooksCount = await db.query.ebooks.findMany().then(res => res.length);
    
    if (ebooksCount === 0) {
      await db.insert(schema.ebooks).values([
        {
          title: "Fundamentos da Teoria Psicanalítica",
          author: "Dr. Carlos Mendes",
          description: "Uma introdução aos conceitos fundamentais da psicanálise e suas aplicações clínicas.",
          cover_url: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
          file_url: "/ebooks/fundamentos-teoria-psicanalitica.pdf",
          category: "psicanálise"
        },
        {
          title: "Técnicas Terapêuticas Contemporâneas",
          author: "Dra. Lúcia Santos",
          description: "Um guia prático sobre as novas abordagens em psicoterapia e sua integração com métodos tradicionais.",
          cover_url: "https://images.unsplash.com/photo-1532012197267-da84d127e765?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
          file_url: "/ebooks/tecnicas-terapeuticas-contemporaneas.pdf",
          category: "terapia"
        },
        {
          title: "O Inconsciente na Prática Clínica",
          author: "Dr. Paulo Ribeiro",
          description: "Uma exploração do papel do inconsciente no processo terapêutico e técnicas para acessá-lo.",
          cover_url: "https://images.unsplash.com/photo-1589998059171-988d887df646?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
          file_url: "/ebooks/inconsciente-pratica-clinica.pdf",
          category: "psicanálise"
        },
        {
          title: "Introdução à Terapia Cognitivo-Comportamental",
          author: "Dra. Marta Alves",
          description: "Princípios básicos e aplicações da TCC em diferentes transtornos psicológicos.",
          cover_url: "https://images.unsplash.com/photo-1603033156166-2ae22eb2b7e2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
          file_url: "/ebooks/introducao-tcc.pdf",
          category: "terapia"
        },
        {
          title: "Psicopatologia e Diagnóstico Clínico",
          author: "Dr. Ricardo Sousa",
          description: "Um guia completo para o diagnóstico e compreensão dos transtornos mentais na prática clínica.",
          cover_url: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
          file_url: "/ebooks/psicopatologia-diagnostico.pdf",
          category: "diagnóstico"
        }
      ]);
      console.log("Sample ebooks created");
    }

    // Seed upcoming events
    const eventsCount = await db.query.events.findMany().then(res => res.length);
    
    if (eventsCount === 0) {
      const oneWeekLater = new Date();
      oneWeekLater.setDate(oneWeekLater.getDate() + 7);
      
      const twoWeeksLater = new Date();
      twoWeeksLater.setDate(twoWeeksLater.getDate() + 14);
      
      await db.insert(schema.events).values([
        {
          title: "Abordagem Psicanalítica em Casos de Ansiedade",
          description: "Supervisão clínica com discussão de casos e abordagens terapêuticas para transtornos de ansiedade.",
          type: "Supervisão Clínica",
          event_date: oneWeekLater,
          start_time: "19:00",
          end_time: "21:00",
          meeting_url: "https://meet.google.com/abc-defg-hij",
          certificate_template: "/templates/certificate-template-supervision.html"
        },
        {
          title: "Psicanálise Contemporânea: Desafios e Perspectivas",
          description: "Palestra sobre os novos caminhos da psicanálise e sua aplicação nos contextos atuais.",
          type: "Palestra",
          event_date: twoWeeksLater,
          start_time: "20:00",
          end_time: "22:00",
          meeting_url: "https://zoom.us/j/1234567890",
          certificate_template: "/templates/certificate-template-lecture.html"
        },
        {
          title: "Introdução às Obras de Freud",
          description: "Grupo de estudo semanal sobre os principais conceitos e obras de Sigmund Freud.",
          type: "Grupo de Estudo",
          event_date: new Date(), // Today, then repeat weekly
          start_time: "19:30",
          end_time: "21:30",
          meeting_url: "https://meet.google.com/xyz-abcd-efg",
          certificate_template: "/templates/certificate-template-study.html"
        }
      ]);
      console.log("Sample events created");
    }

    // Seed benefits/partnerships
    const benefitsCount = await db.query.benefits.findMany().then(res => res.length);
    
    if (benefitsCount === 0) {
      await db.insert(schema.benefits).values([
        {
          company: "Clínica Bem-Estar",
          description: "Desconto em consultas médicas e psicológicas para associados UBPCT",
          discount: "20%",
          category: "saúde",
          website: "https://clinicabemestar.com.br",
          contact_info: "contato@clinicabemestar.com.br | (11) 3333-4444"
        },
        {
          company: "Editora PsiBooks",
          description: "Desconto em livros e materiais de estudo sobre psicologia e psicanálise",
          discount: "15%",
          category: "educação",
          website: "https://psibooks.com.br",
          contact_info: "vendas@psibooks.com.br | (11) 2222-3333"
        },
        {
          company: "PsicoFarma",
          description: "Desconto em medicamentos para pacientes encaminhados por associados UBPCT",
          discount: "10%",
          category: "farmácia",
          website: "https://psicofarma.com.br",
          contact_info: "atendimento@psicofarma.com.br | (11) 4444-5555"
        }
      ]);
      console.log("Sample benefits created");
    }

    console.log("Database seeding completed");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}

seed();

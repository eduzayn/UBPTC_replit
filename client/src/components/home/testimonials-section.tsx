import { Star, StarHalf } from "lucide-react";

interface Testimonial {
  id: number;
  content: string;
  author: {
    name: string;
    role: string;
    location: string;
    photo: string;
  };
  rating: number; // 1-5
}

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  // Generate stars based on rating
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`star-${i}`} className="fill-primary text-primary" />);
    }
    
    if (hasHalfStar) {
      stars.push(<StarHalf key="half-star" className="fill-primary text-primary" />);
    }
    
    return stars;
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-md">
      <div className="flex items-center mb-4">
        <div className="text-primary text-xl flex">
          {renderStars(testimonial.rating)}
        </div>
      </div>
      <p className="text-gray-600 italic mb-4">{testimonial.content}</p>
      <div className="flex items-center">
        <img 
          src={testimonial.author.photo} 
          alt={`Foto de ${testimonial.author.name}`} 
          className="w-12 h-12 rounded-full mr-3 object-cover"
        />
        <div>
          <h4 className="font-montserrat font-semibold">{testimonial.author.name}</h4>
          <p className="text-gray-500 text-sm">
            {testimonial.author.role}, {testimonial.author.location}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function TestimonialsSection() {
  const testimonials: Testimonial[] = [
    {
      id: 1,
      content: "A UBPCT transformou minha prática profissional. As supervisões semanais e os ebooks disponíveis são fundamentais para meu desenvolvimento como psicanalista.",
      author: {
        name: "Roberto Silva",
        role: "Psicanalista",
        location: "São Paulo",
        photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80"
      },
      rating: 5
    },
    {
      id: 2,
      content: "A credencial digital e o certificado anual deram mais credibilidade ao meu trabalho. Os pacientes se sentem mais seguros sabendo que faço parte de uma associação séria.",
      author: {
        name: "Carla Mendes",
        role: "Terapeuta",
        location: "Rio de Janeiro",
        photo: "https://images.unsplash.com/photo-1534751516642-a1af1ef26a56?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80"
      },
      rating: 5
    },
    {
      id: 3,
      content: "Como estudante, a UBPCT me proporcionou acesso a conhecimentos práticos que não encontro na faculdade. A biblioteca de ebooks e as supervisões são excelentes para minha formação.",
      author: {
        name: "Juliana Santos",
        role: "Estudante",
        location: "Belo Horizonte",
        photo: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80"
      },
      rating: 4.5
    }
  ];

  return (
    <section className="py-16 bg-gray-100">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-montserrat font-bold text-3xl text-secondary mb-4">
            O Que Dizem Nossos Associados
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Veja o que os profissionais que já fazem parte da UBPCT têm a dizer sobre sua experiência.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map(testimonial => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} />
          ))}
        </div>
      </div>
    </section>
  );
}

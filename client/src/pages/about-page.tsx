import { Helmet } from "react-helmet";

export default function AboutPage() {
  return (
    <>
      <Helmet>
        <title>Sobre Nós | UBPCT</title>
        <meta name="description" content="Conheça a história e missão da União Brasileira de Psicanálise Clínica e Terapêutica (UBPCT)." />
      </Helmet>
      
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-center mb-12">Sobre a UBPCT</h1>
        
        <div className="grid md:grid-cols-2 gap-12 mb-16 items-center">
          <div>
            <h2 className="text-3xl font-semibold mb-4">Nossa História</h2>
            <p className="text-lg mb-4">
              A União Brasileira de Psicanálise Clínica e Terapêutica (UBPCT) foi fundada em 2010 por um grupo de 
              profissionais dedicados ao avanço das ciências da mente no Brasil. 
            </p>
            <p className="text-lg mb-4">
              Desde então, temos trabalhado incansavelmente para criar uma comunidade forte e colaborativa de 
              profissionais da saúde mental, fornecendo ferramentas, conhecimento e suporte para o desenvolvimento 
              contínuo da prática clínica no país.
            </p>
            <p className="text-lg">
              Atualmente, contamos com mais de 5.000 associados em todo o território nacional, representando 
              diversas abordagens e perspectivas dentro do campo da psicanálise e psicoterapia.
            </p>
          </div>
          <div className="flex justify-center">
            <div className="bg-gray-100 p-12 rounded-lg max-w-md">
              <div className="flex flex-col items-center">
                <img src="/placeholder-history.jpg" alt="História da UBPCT" className="rounded-lg shadow-md" />
                <p className="text-sm text-gray-500 mt-2 italic">Fundadores da UBPCT em 2010</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-primary/10 rounded-lg p-8 mb-16">
          <h2 className="text-3xl font-semibold mb-6 text-center">Nossa Missão</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold mb-3">Integrar</h3>
              <p>
                Reunir profissionais de diversas abordagens e perspectivas dentro do campo da psicanálise e 
                psicoterapia, promovendo o diálogo e a troca de experiências.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold mb-3">Desenvolver</h3>
              <p>
                Oferecer recursos educacionais, eventos formativos e materiais científicos para o desenvolvimento 
                contínuo dos nossos associados e da profissão como um todo.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold mb-3">Credenciar</h3>
              <p>
                Fornecer credenciais reconhecidas que atestem a formação e competência profissional, elevando o 
                padrão de qualidade dos serviços oferecidos à sociedade.
              </p>
            </div>
          </div>
        </div>
        
        <div className="mb-16">
          <h2 className="text-3xl font-semibold mb-8 text-center">Nossa Estrutura</h2>
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-semibold mb-4">Conselho Diretor</h3>
              <p className="mb-4">
                Nosso conselho diretor é composto por profissionais renomados no campo da psicanálise e psicoterapia, 
                com ampla experiência clínica e acadêmica.
              </p>
              <ul className="list-disc list-inside mb-4 space-y-1">
                <li>Dr. Paulo Mendes - Presidente</li>
                <li>Dra. Carla Santos - Vice-Presidente</li>
                <li>Dr. Roberto Ferreira - Diretor Científico</li>
                <li>Dra. Luciana Costa - Diretora de Relações Institucionais</li>
                <li>Dr. Marcelo Alves - Diretor Administrativo</li>
              </ul>
            </div>
            <div>
              <h3 className="text-2xl font-semibold mb-4">Comitê Científico</h3>
              <p className="mb-4">
                Nosso comitê científico é responsável pela avaliação e validação dos materiais educacionais, eventos 
                formativos e certificações oferecidas pela UBPCT.
              </p>
              <ul className="list-disc list-inside mb-4 space-y-1">
                <li>Dra. Marta Silva - Coordenadora</li>
                <li>Dr. José Carlos - Membro</li>
                <li>Dra. Ana Paula - Membro</li>
                <li>Dr. Fernando Ribeiro - Membro</li>
                <li>Dra. Juliana Costa - Membro</li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="text-center mb-12">
          <h2 className="text-3xl font-semibold mb-6">Junte-se a Nós</h2>
          <p className="text-lg max-w-3xl mx-auto mb-8">
            Faça parte da maior comunidade de profissionais de psicanálise e psicoterapia do Brasil. 
            Acesse benefícios exclusivos, participe de eventos formativos e obtenha sua credencial profissional.
          </p>
          <a href="/#associe-se" className="inline-block bg-primary hover:bg-primary/90 text-white font-bold py-3 px-6 rounded-lg">
            Associe-se Agora
          </a>
        </div>
      </div>
    </>
  );
}
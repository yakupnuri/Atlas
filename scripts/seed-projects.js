const { MongoClient } = require('mongodb');
const { v4: uuidv4 } = require('uuid');

const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017';
const DB_NAME = 'stichting_atlas';

const demoProjects = [
  {
    id: uuidv4(),
    title: 'Kinderklas Nederlands',
    description: `Een intensieve Nederlandse taalcursus voor kinderen van 6-12 jaar. 
    
We bieden een veilige en stimulerende leeromgeving waar kinderen spelenderwijs de Nederlandse taal leren. Door middel van creatieve activiteiten, groepsopdrachten en interactieve lessen bouwen kinderen hun taalvaardigheid op.

Dit project helpt nieuwkomers zich beter te integreren in de Nederlandse samenleving en zorgt ervoor dat kinderen met vertrouwen kunnen deelnemen aan het reguliere onderwijs.`,
    category: 'egitim',
    status: 'devam',
    team: ['Ayşe Yılmaz', 'Mehmet Kaya', 'Sarah van den Berg', 'Ali Demir'],
    budget: 15000,
    startDate: '2024-01-15T00:00:00.000Z',
    endDate: '2024-12-31T00:00:00.000Z',
    image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800',
    documents: [],
    public: true,
    progress: 65,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: 'CRM User'
  },
  {
    id: uuidv4(),
    title: 'Culturele Avond: Turkse Tradities',
    description: `Een maandelijkse culturele avond waar we de rijke Turkse cultuur delen met de Nederlandse gemeenschap.

Tijdens deze avonden organiseren we:
- Traditionele muziek en dans optredens
- Workshops over Turkse kalligrafie en kunst
- Culinaire ervaringen met authentieke gerechten
- Verhalen en geschiedenis presentaties

Het doel is om bruggen te bouwen tussen culturen en wederzijds begrip te vergroten. Iedereen is welkom, ongeacht achtergrond!`,
    category: 'kultur',
    status: 'devam',
    team: ['Fatma Özkan', 'Emre Yıldız', 'Lisa de Vries', 'Can Şahin'],
    budget: 8000,
    startDate: '2024-03-01T00:00:00.000Z',
    endDate: '2024-11-30T00:00:00.000Z',
    image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800',
    documents: [],
    public: true,
    progress: 45,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: 'CRM User'
  },
  {
    id: uuidv4(),
    title: 'Buurtontmoeting Zuidoost',
    description: `Een wekelijks ontmoetingspunt voor bewoners van Amsterdam Zuidoost.

In onze buurtontmoeting bieden we:
- Een luisterend oor voor iedereen die dat nodig heeft
- Hulp bij praktische zaken zoals formulieren invullen
- Nederlandse conversatiepraktijk
- Sociale activiteiten en uitjes
- Koffie, thee en gezelligheid

Elk zijn welkom! We geloven in de kracht van een sterke gemeenschap waar mensen elkaar ondersteunen en samen groeien.`,
    category: 'sosyal',
    status: 'devam',
    team: ['Zeynep Arslan', 'Hassan Ali', 'Emma Jansen', 'Mustafa Çelik'],
    budget: 5000,
    startDate: '2024-02-01T00:00:00.000Z',
    endDate: '2025-01-31T00:00:00.000Z',
    image: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800',
    documents: [],
    public: true,
    progress: 80,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: 'CRM User'
  },
  {
    id: uuidv4(),
    title: 'Huiswerkbegeleiding Middelbare School',
    description: `Gratis huiswerkbegeleiding voor middelbare scholieren die extra ondersteuning nodig hebben.

Ons programma omvat:
- Wiskunde, Nederlands, Engels, en andere vakken
- Studievaardigheden en planning
- Examentraining en voorbereiding
- Motivatie en begeleiding
- Klein groepen (max 5 leerlingen)

Onze vrijwilligers zijn ervaren docenten en studenten die graag willen helpen. We zorgen ervoor dat elke leerling de aandacht krijgt die hij of zij nodig heeft.`,
    category: 'egitim',
    status: 'planlama',
    team: ['Deniz Tekin', 'Sophie Bakker', 'Cem Yavuz'],
    budget: 12000,
    startDate: '2024-09-01T00:00:00.000Z',
    endDate: '2025-06-30T00:00:00.000Z',
    image: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=800',
    documents: [],
    public: true,
    progress: 20,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: 'CRM User'
  },
  {
    id: uuidv4(),
    title: 'Vrouwen Empowerment Workshop',
    description: `Een reeks workshops gericht op het versterken van vrouwen in onze gemeenschap.

Workshop thema's:
- Financiële zelfredzaamheid en budgetteren
- Ondernemerschap en bedrijf starten
- Zelfvertrouwen en assertiviteit
- Carrièreontwikkeling en netwerken
- Werk-privé balans

We creëren een veilige ruimte waar vrouwen kunnen leren, groeien en elkaar ondersteunen. Kinderopvang beschikbaar tijdens workshops!`,
    category: 'sosyal',
    status: 'devam',
    team: ['Elif Aydın', 'Noor Hassan', 'Maria Vliet', 'Leyla Koç'],
    budget: 10000,
    startDate: '2024-04-01T00:00:00.000Z',
    endDate: '2024-10-31T00:00:00.000Z',
    image: 'https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=800',
    documents: [],
    public: true,
    progress: 55,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: 'CRM User'
  },
  {
    id: uuidv4(),
    title: 'Jeugdtheater Project',
    description: `Een theaterproject voor jongeren tussen 12-18 jaar waar ze zelfvertrouwen, creativiteit en sociale vaardigheden ontwikkelen.

Het project biedt:
- Wekelijkse theaterworkshops
- Professionele begeleiding door ervaren acteurs
- Opvoering voor publiek aan het einde
- Samenwerking met lokale theaters
- Kostuums en decorontwerp workshops

Theater is een geweldig middel om jezelf uit te drukken, nieuwe vrienden te maken en buiten je comfortzone te stappen!`,
    category: 'kultur',
    status: 'tamamlandi',
    team: ['Hakan Güler', 'Julia Smit', 'Ozan Ertürk', 'Nina Bosch'],
    budget: 18000,
    startDate: '2023-09-01T00:00:00.000Z',
    endDate: '2024-05-31T00:00:00.000Z',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800',
    documents: [],
    public: true,
    progress: 100,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: 'CRM User'
  }
];

async function seedProjects() {
  const client = new MongoClient(MONGO_URL);
  
  try {
    console.log('Connecting to MongoDB...');
    await client.connect();
    console.log('✅ Connected to MongoDB');
    
    const db = client.db(DB_NAME);
    const collection = db.collection('crm_projects');
    
    // Clear existing projects (optional)
    console.log('\nClearing existing demo projects...');
    await collection.deleteMany({ createdBy: 'CRM User' });
    console.log('✅ Existing demo projects cleared');
    
    // Insert demo projects
    console.log('\nInserting demo projects...');
    const result = await collection.insertMany(demoProjects);
    console.log(`✅ ${result.insertedCount} demo projects inserted`);
    
    console.log('\n📊 Demo Projects Summary:');
    demoProjects.forEach((project, index) => {
      console.log(`${index + 1}. ${project.title}`);
      console.log(`   - Category: ${project.category}`);
      console.log(`   - Status: ${project.status}`);
      console.log(`   - Progress: ${project.progress}%`);
      console.log(`   - Budget: €${project.budget.toLocaleString()}`);
      console.log(`   - Team: ${project.team.length} members`);
      console.log('');
    });
    
    console.log('✅ Seeding completed successfully!');
    
  } catch (error) {
    console.error('❌ Error seeding projects:', error);
    process.exit(1);
  } finally {
    await client.close();
    console.log('Connection closed');
  }
}

// Run the seeding
seedProjects();

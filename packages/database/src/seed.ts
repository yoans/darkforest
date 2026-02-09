import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create default agents
  const agents = [
    { name: 'Strategy Agent', type: 'STRATEGY' as const, version: '1.0.0' },
    { name: 'Content Agent', type: 'CONTENT' as const, version: '1.0.0' },
    { name: 'Publishing Agent', type: 'PUBLISHING' as const, version: '1.0.0' },
    { name: 'SEO Agent', type: 'SEO' as const, version: '1.0.0' },
    { name: 'Analytics Agent', type: 'ANALYTICS' as const, version: '1.0.0' },
    { name: 'Monetization Agent', type: 'MONETIZATION' as const, version: '1.0.0' },
    { name: 'Research Agent', type: 'RESEARCH' as const, version: '1.0.0' },
    { name: 'Maintenance Agent', type: 'MAINTENANCE' as const, version: '1.0.0' },
  ];

  for (const agent of agents) {
    await prisma.agent.upsert({
      where: { name: agent.name },
      update: { version: agent.version },
      create: {
        name: agent.name,
        type: agent.type,
        version: agent.version,
        status: 'ACTIVE',
        config: {},
      },
    });
    console.log(`  ✅ Agent: ${agent.name}`);
  }

  // Create default sites matching blog-network-config.json
  const sites = [
    {
      name: 'AI Business Insights',
      domain: 'darkforest.sagaciasoft.com/ai-business-insights',
      niche: 'AI and Business Technology',
      config: { postsPerWeek: 5, tone: 'professional', template: 'professional-corporate' },
    },
    {
      name: 'Remote Work Revolution',
      domain: 'darkforest.sagaciasoft.com/remote-work-revolution',
      niche: 'Remote Work and Digital Nomad Lifestyle',
      config: { postsPerWeek: 4, tone: 'friendly', template: 'lifestyle-modern' },
    },
    {
      name: 'Cybersecurity Today',
      domain: 'darkforest.sagaciasoft.com/cybersecurity-today',
      niche: 'Cybersecurity and Data Privacy',
      config: { postsPerWeek: 3, tone: 'technical', template: 'tech-dark' },
    },
    {
      name: 'Marketing Automation Hub',
      domain: 'darkforest.sagaciasoft.com/marketing-automation-hub',
      niche: 'Marketing Automation and Growth',
      config: { postsPerWeek: 4, tone: 'actionable', template: 'marketing-vibrant' },
    },
  ];

  for (const site of sites) {
    await prisma.site.upsert({
      where: { domain: site.domain },
      update: { name: site.name, config: site.config },
      create: {
        name: site.name,
        domain: site.domain,
        niche: site.niche,
        status: 'ACTIVE',
        config: site.config,
      },
    });
    console.log(`  ✅ Site: ${site.name}`);
  }

  console.log('🌱 Seeding complete!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

import prisma from '../lib/prisma';

async function main() {
  // Create default standards
  const cobit = await prisma.auditStandard.create({
    data: {
      name: 'COBIT 2019',
      version: '2019',
      description: 'Control Objectives for Information and Related Technologies',
      domains: {
        create: [
          {
            name: 'Evaluate, Direct and Monitor',
            code: 'EDM',
            controls: {
              create: [
                { code: 'EDM01', name: 'Managed Governance Framework Setting and Maintenance' },
                { code: 'EDM02', name: 'Managed Benefit Delivery' },
              ]
            }
          },
          {
            name: 'Align, Plan and Organize',
            code: 'APO',
            controls: {
              create: [
                { code: 'APO01', name: 'Managed I&T Management Framework' },
                { code: 'APO12', name: 'Managed Risk' },
                { code: 'APO13', name: 'Managed Security' },
              ]
            }
          }
        ]
      }
    }
  });

  const iso = await prisma.auditStandard.create({
    data: {
      name: 'ISO 27001',
      version: '2022',
      description: 'Information Security Management Systems',
      domains: {
        create: [
          {
            name: 'Organizational Controls',
            code: 'Annex A.5',
            controls: {
              create: [
                { code: 'A.5.1', name: 'Policies for information security' },
                { code: 'A.5.15', name: 'Access control' },
              ]
            }
          }
        ]
      }
    }
  });

  // Create Users
  const admin = await prisma.user.create({
    data: {
      name: 'Super Admin',
      email: 'admin@auditpro.com',
      password: 'password123', // In real app, hash this
      role: 'SUPER_ADMIN',
    }
  });

  const auditor = await prisma.user.create({
    data: {
      name: 'John Auditor',
      email: 'john@auditpro.com',
      password: 'password123',
      role: 'AUDITOR',
    }
  });

  const auditee = await prisma.user.create({
    data: {
      name: 'Sarah Auditee',
      email: 'sarah@auditpro.com',
      password: 'password123',
      role: 'AUDITEE',
    }
  });

  console.log('Seed data created successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

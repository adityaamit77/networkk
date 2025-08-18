import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Create default admin user
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@networkk.com' },
    update: {},
    create: {
      email: 'admin@networkk.com',
      name: 'Admin User',
      passwordHash: 'admin123', // In production, this should be properly hashed
      role: 'ADMIN'
    }
  })

  console.log('Created admin user:', adminUser)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })

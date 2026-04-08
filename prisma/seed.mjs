import { PrismaClient } from '@prisma/client'
import { PrismaNeon } from '@prisma/adapter-neon'
import bcrypt from 'bcryptjs'
import { config } from 'dotenv'

config({ path: '.env.local' })

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL })
const prisma = new PrismaClient({ adapter })

async function main() {
  const hash = await bcrypt.hash('Origin2024!', 12)
  const user = await prisma.user.upsert({
    where: { email: 'luciaolmoss.09@gmail.com' },
    update: { passwordHash: hash, role: 'admin' },
    create: {
      email: 'luciaolmoss.09@gmail.com',
      name: 'Lucía',
      role: 'admin',
      passwordHash: hash,
    },
  })
  console.log('✅ Admin creada:', user.email, '| role:', user.role)
  await prisma.$disconnect()
}

main().catch(e => {
  console.error(e)
  process.exit(1)
})

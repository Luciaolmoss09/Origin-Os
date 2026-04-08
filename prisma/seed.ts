import { PrismaClient } from "@prisma/client"
import { PrismaNeon } from "@prisma/adapter-neon"
import bcrypt from "bcryptjs"

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

async function main() {
  const email = process.env.ADMIN_EMAIL || "luciaolmoss.09@gmail.com"
  const name = "Lucia"
  const password = "Origin2024!" // Change after first login

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    console.log(`Admin user already exists: ${email}`)
    return
  }

  const passwordHash = await bcrypt.hash(password, 12)

  const user = await prisma.user.create({
    data: {
      email,
      name,
      passwordHash,
      role: "admin",
      status: "active",
    },
  })

  console.log(`✅ Admin user created: ${user.email}`)
  console.log(`   Password: ${password}`)
  console.log(`   Change this password after first login!`)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())

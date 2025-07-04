import { PrismaClient } from "@prisma/client"
import bcrypt from "bcrypt"

const prisma = new PrismaClient()

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end()

  const { email, password } = req.body

  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) return res.status(401).json({ error: "User not found" })

  const valid = await bcrypt.compare(password, user.password)
  if (!valid) return res.status(401).json({ error: "Invalid password" })

  // In real apps, generate JWT or session here
  res.status(200).json({ message: "Login successful", user })
}

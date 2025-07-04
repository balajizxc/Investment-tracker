import { PrismaClient } from "@prisma/client"
import bcrypt from "bcrypt"

const prisma = new PrismaClient()

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end()

  const { name, email, password } = req.body

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) return res.status(409).json({ error: "User already exists" })

  const hashed = await bcrypt.hash(password, 10)

  const user = await prisma.user.create({
    data: { name, email, password: hashed },
  })

  res.status(201).json({ message: "User created", user })
}

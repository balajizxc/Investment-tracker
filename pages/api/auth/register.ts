import type { NextApiRequest, NextApiResponse } from 'next';

// Define a type for the expected request body
type RegisterBody = {
  username: string;
  email: string;
  password: string;
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { username, email, password } = req.body as RegisterBody;

    // Basic validation
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Here you can implement your registration logic:
    // - Save to database
    // - Hash password
    // - Check for existing user
    // This is just a dummy response for now
    return res.status(200).json({
      message: 'User registered successfully',
      user: { username, email },
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
}

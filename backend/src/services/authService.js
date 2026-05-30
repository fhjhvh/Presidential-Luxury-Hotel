import bcrypt from 'bcryptjs';
import prisma from '../config/database.js';
import { generateToken } from '../utils/jwt.js';

export const registerUser = async (userData) => {
  const { email, password, role, firstName, lastName, phone, idNumber } = userData;

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) throw new Error('Email already registered');

  if (idNumber) {
    const existingById = await prisma.user.findUnique({ where: { idNumber } });
    if (existingById) throw new Error('An account with this ID number already exists');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      role: role || 'GUEST_NEW',
      firstName,
      lastName,
      phone: phone || null,
      idNumber: idNumber || null,
    },
  });

  if (role === 'GUEST_NEW' || role === 'GUEST_RETURNING' || !role) {
    const isFirstVisit = !role || role === 'GUEST_NEW';
    const discountRate = isFirstVisit ? 0.20 : 0.10;

    await prisma.guestProfile.create({
      data: { userId: user.id, isFirstVisit, discountRate },
    });
  }

  if (role?.startsWith('STAFF_')) {
    const department = role.replace('STAFF_', '');
    await prisma.staffProfile.create({
      data: { userId: user.id, department, position: department },
    });
  }

  const token = generateToken(user.id);
  const { password: _, ...userWithoutPassword } = user;
  return { user: userWithoutPassword, token };
};

export const loginUser = async ({ email, password, idNumber }) => {
  let user = null;

  // Allow login by ID number alone (if no email provided) or by email
  if (idNumber && !email) {
    user = await prisma.user.findUnique({
      where: { idNumber },
      include: { guestProfile: true, staffProfile: true },
    });
  } else if (email) {
    user = await prisma.user.findUnique({
      where: { email },
      include: { guestProfile: true, staffProfile: true },
    });
    // If found by email but idNumber provided and doesn't match, still allow login
    // (idNumber is just an additional identifier, not a secondary password)
  }

  if (!user) throw new Error('Invalid credentials');

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) throw new Error('Invalid credentials');

  const token = generateToken(user.id);
  const { password: _, ...userWithoutPassword } = user;
  return { user: userWithoutPassword, token };
};

export const getUserProfile = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { guestProfile: true, staffProfile: true },
  });

  if (!user) throw new Error('User not found');

  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const { name, email, phone, password, preferredLanguage } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email i contrasenya són obligatoris' },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'La contrasenya ha de tenir almenys 8 caràcters' },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Ja existeix un compte amb aquest correu electrònic' },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: name || null,
        phone: phone || null,
        preferredLanguage: preferredLanguage || 'ca',
      },
    });

    return NextResponse.json(
      { message: 'Compte creat correctament', userId: user.id },
      { status: 201 }
    );
  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json(
      { error: 'Error intern del servidor' },
      { status: 500 }
    );
  }
}

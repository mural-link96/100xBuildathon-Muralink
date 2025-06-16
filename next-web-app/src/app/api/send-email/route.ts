// app/api/send-email/route.ts

import { generateAdminEmailTemplate, generateUserEmailTemplate } from '@/app/services/emailService';
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {

  try {
    // 1. Parse the request
    const userData = await request.json();
    // 2. Create transporter (test connection first)
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'muralinkdesigns@gmail.com',
        pass: 'emfqwvwuerjhgcqy',
      }
    });

    // 3. Verify transporter
    await transporter.verify();
  
    await transporter.sendMail({
      from: '"MuraLink Design" <noreply@muralinkai.com>',
      to: userData.email,
      subject: 'Welcome to MuraLink! 🎉',
      html: generateUserEmailTemplate(userData.name),
    });

    await transporter.sendMail({
      from: '"MuraLink Website" <noreply@muralinkai.com>',
      to: "info@muralinkai.com",
      subject: 'New MuraLink Pre-Launch Registration',
      html: generateAdminEmailTemplate(userData),
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Email sent successfully',
    });

  } catch (error) {
    console.error('Detailed error:', {
      message: error
    });

    return NextResponse.json(
      { 
        success: false, 
        message: 'Server error', 
        error: error
      }, 
      { status: 500 }
    );
  }
}
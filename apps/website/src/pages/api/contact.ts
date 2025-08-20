import type { APIRoute } from 'astro';
import nodemailer from 'nodemailer';

// Configure Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'your-gmail@gmail.com',
    pass: 'your-app-password' // Generate from Gmail settings
  }
});

export const POST: APIRoute = async ({ request }) => {
  try {
    const formData = await request.formData();
    
    // Extract form data
    const data = {
      name: formData.get('name')?.toString() || '',
      email: formData.get('email')?.toString() || '',
      phone: formData.get('phone')?.toString() || '',
      company: formData.get('company')?.toString() || '',
      jobTitle: formData.get('jobTitle')?.toString() || '',
      service: formData.get('service')?.toString() || '',
      message: formData.get('message')?.toString() || '',
    };

    // Validate required fields
    if (!data.name || !data.email || !data.message) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Name, email, and message are required fields.'
      }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Please provide a valid email address.'
      }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }

    // Create email content
    const emailSubject = `New Contact Form Submission from ${data.name} - ${data.company || 'Networkk Website'}`;
    const emailBody = `
Contact Form Submission Details:

Name: ${data.name}
Email: ${data.email}
Phone: ${data.phone || 'Not provided'}
Company: ${data.company || 'Not provided'}
Job Title: ${data.jobTitle || 'Not provided'}
Service Interest: ${data.service || 'Not specified'}

Message:
${data.message}

---
Submitted on: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
From: Networkk Website Contact Form
IP Address: ${request.headers.get('x-forwarded-for') || 'Unknown'}
User Agent: ${request.headers.get('user-agent') || 'Unknown'}
    `.trim();

    // In a real implementation, you would send this via:
    // 1. Nodemailer with Gmail SMTP
    // 2. SendGrid API
    // 3. AWS SES
    // 4. Resend API
    // 5. EmailJS

    // For now, we'll use Formspree or similar service
    // You can also integrate with Gmail using App Passwords

    console.log('Contact form submission:', {
      subject: emailSubject,
      data: data,
      timestamp: new Date().toISOString()
    });

    // Send email using Nodemailer
    const mailOptions = {
      from: 'your-gmail@gmail.com',
      to: ['support@networkk.in', 'anupama.singh@networkk.in'],
      subject: emailSubject,
      text: emailBody,
      replyTo: data.email
    };

    const info = await transporter.sendMail(mailOptions);

    console.log('Email sent:', info.response);

    return new Response(JSON.stringify({
      success: true,
      message: 'Thank you for your message. We will get back to you within 24 hours.'
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });

  } catch (error) {
    console.error('Contact form error:', error);
    
    return new Response(JSON.stringify({
      success: false,
      error: 'Something went wrong. Please try again or contact us directly at support@networkk.in'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};

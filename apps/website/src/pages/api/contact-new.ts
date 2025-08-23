import type { APIRoute } from 'astro';

// Ensure this API route runs on the server
export const prerender = false;

// Types
interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  company: string;
  jobTitle: string;
  service: string;
  message: string;
  consent: string;
}

interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
}

// Email service configuration
const EMAIL_CONFIG = {
  apiKey: process.env.RESEND_API_KEY,
  fromEmail: process.env.FROM_EMAIL || 'anupama.singh@networkk.in',
  toEmail: process.env.TO_EMAIL || 'anupama.singh@networkk.in',
};

// Validation schemas
const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePhone = (phone: string): boolean => {
  if (!phone || phone.trim() === '') return true; // Optional field
  // Remove all non-digit characters except + at the start
  const cleaned = phone.replace(/[^\d+]/g, '');
  // Allow various phone number formats: +91XXXXXXXXXX, 91XXXXXXXXXX, XXXXXXXXXX
  const phoneRegex = /^(\+91|91)?[6-9]\d{9}$|^\+?[1-9]\d{7,14}$/;
  return phoneRegex.test(cleaned);
};

// Email templates
const createEmailTemplate = (data: ContactFormData): EmailTemplate => {
  const subject = `New Contact Form Submission - ${data.service}`;
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #1e40af;">New Contact Form Submission</h2>
      
      <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="color: #374151; margin-top: 0;">Contact Details</h3>
        <p><strong>Name:</strong> ${data.name}</p>
        <p><strong>Email:</strong> <a href="mailto:${data.email}">${data.email}</a></p>
        ${data.phone ? `<p><strong>Phone:</strong> <a href="tel:${data.phone}">${data.phone}</a></p>` : ''}
        <p><strong>Company:</strong> ${data.company}</p>
        <p><strong>Job Title:</strong> ${data.jobTitle}</p>
        <p><strong>Service Interest:</strong> ${data.service}</p>
      </div>
      
      <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="color: #374151; margin-top: 0;">Message</h3>
        <p style="white-space: pre-wrap;">${data.message}</p>
      </div>
      
      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
        <p style="color: #6b7280; font-size: 14px;">
          Submitted on: ${new Date().toLocaleString()}<br>
          Form: Contact Page
        </p>
      </div>
    </div>
  `;
  
  const text = `
New Contact Form Submission

Contact Details:
Name: ${data.name}
Email: ${data.email}
${data.phone ? `Phone: ${data.phone}` : ''}
Company: ${data.company}
Job Title: ${data.jobTitle}
Service Interest: ${data.service}

Message:
${data.message}

Submitted on: ${new Date().toLocaleString()}
  `;

  return { subject, html, text };
};

// Send email with Resend
const sendWithResend = async (template: EmailTemplate, data: ContactFormData) => {
  if (!EMAIL_CONFIG.apiKey) {
    throw new Error('Resend API key not configured');
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${EMAIL_CONFIG.apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: `Networkk <${EMAIL_CONFIG.fromEmail}>`,
      to: [EMAIL_CONFIG.toEmail],
      subject: template.subject,
      html: template.html,
      text: template.text,
      reply_to: data.email,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Resend API error: ${response.status} - ${errorText}`);
  }

  return await response.json();
};

// Send auto-reply to user
const sendAutoReply = async (data: ContactFormData) => {
  if (!EMAIL_CONFIG.apiKey) return;

  const autoReplyTemplate = {
    subject: 'Thank you for contacting Networkk',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1e40af;">Thank you for your inquiry</h2>
        <p>Dear ${data.name},</p>
        <p>Thank you for reaching out to Networkk. We have received your inquiry and one of our consultants will contact you within 24 hours.</p>
        <p>We look forward to discussing how we can help with your ${data.service.replace('-', ' ')} needs.</p>
        <br>
        <p>Best regards,<br>The Networkk Team</p>
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
        <p style="color: #6b7280; font-size: 14px;">
          This is an automated message. Please do not reply to this email.
        </p>
      </div>
    `,
    text: `Dear ${data.name},\n\nThank you for reaching out to Networkk. We have received your inquiry and one of our consultants will contact you within 24 hours.\n\nWe look forward to discussing how we can help with your ${data.service.replace('-', ' ')} needs.\n\nBest regards,\nThe Networkk Team`
  };

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${EMAIL_CONFIG.apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: `Networkk <${EMAIL_CONFIG.fromEmail}>`,
      to: [data.email],
      subject: autoReplyTemplate.subject,
      html: autoReplyTemplate.html,
      text: autoReplyTemplate.text,
    }),
  });

  if (!response.ok) {
    throw new Error(`Auto-reply failed: ${response.status}`);
  }
};

// Rate limiting (simple in-memory store - use Redis in production)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

const checkRateLimit = (ip: string): boolean => {
  const now = Date.now();
  const windowMs = 15 * 60 * 1000; // 15 minutes
  const maxRequests = 5;

  const record = rateLimitStore.get(ip);
  
  if (!record || now > record.resetTime) {
    rateLimitStore.set(ip, { count: 1, resetTime: now + windowMs });
    return true;
  }
  
  if (record.count >= maxRequests) {
    return false;
  }
  
  record.count++;
  return true;
};

// Main API route
export const POST: APIRoute = async ({ request }) => {
  try {
    // Rate limiting
    const clientIP = request.headers.get('x-forwarded-for') || 
                    request.headers.get('x-real-ip') || 
                    'unknown';
    
    if (!checkRateLimit(clientIP)) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Too many requests. Please try again in 15 minutes.',
        code: 'RATE_LIMIT_EXCEEDED'
      }), {
        status: 429,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Parse form data
    const formData = await request.formData();
    
    const data: ContactFormData = {
      name: formData.get('name')?.toString()?.trim() || '',
      email: formData.get('email')?.toString()?.trim() || '',
      phone: formData.get('phone')?.toString()?.trim() || '',
      company: formData.get('company')?.toString()?.trim() || '',
      jobTitle: formData.get('jobTitle')?.toString()?.trim() || '',
      service: formData.get('service')?.toString()?.trim() || '',
      message: formData.get('message')?.toString()?.trim() || '',
      consent: formData.get('consent')?.toString() || '',
    };

    // Validation
    const errors: string[] = [];

    if (!data.name || data.name.trim().length < 2) {
      errors.push('Name must be at least 2 characters long');
    }

    if (!data.email || !validateEmail(data.email)) {
      errors.push('Please provide a valid email address');
    }

    if (data.phone && data.phone.trim() !== '' && !validatePhone(data.phone)) {
      errors.push('Please provide a valid phone number (e.g., +91 98765 43210 or 9876543210)');
    }

    if (!data.company || data.company.trim().length < 2) {
      errors.push('Company name is required (at least 2 characters)');
    }

    if (!data.jobTitle || data.jobTitle.trim().length < 2) {
      errors.push('Job title is required (at least 2 characters)');
    }

    if (!data.service || data.service.trim() === '') {
      errors.push('Please select a service of interest');
    }

    if (!data.message || data.message.trim().length < 5) {
      errors.push('Message must be at least 5 characters long');
    }

    if (!data.consent || (data.consent !== 'true' && data.consent !== 'on')) {
      errors.push('Please agree to the privacy policy to continue');
    }

    if (errors.length > 0) {
      return new Response(JSON.stringify({
        success: false,
        error: errors.join('. '),
        code: 'VALIDATION_ERROR'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Send email notification
    try {
      const template = createEmailTemplate(data);
      await sendWithResend(template, data);
      
      // Send auto-reply to user
      await sendAutoReply(data);
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      // Continue processing even if email fails
    }

    // Log submission
    console.log('Contact form submission:', {
      name: data.name,
      email: data.email,
      company: data.company,
      service: data.service,
      timestamp: new Date().toISOString(),
      ip: clientIP,
      userAgent: request.headers.get('user-agent'),
    });

    return new Response(JSON.stringify({
      success: true,
      message: 'Thank you for your message. We will get back to you within 24 hours.',
      data: {
        submissionId: `cnt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date().toISOString()
      }
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Contact API error:', error);
    
    return new Response(JSON.stringify({
      success: false,
      error: 'Internal server error. Please try again later or contact us directly.',
      code: 'INTERNAL_ERROR'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
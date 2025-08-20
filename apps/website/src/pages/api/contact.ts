import type { APIRoute } from 'astro';

const SMTP_HOST = 'smtp.gmail.com';
const SMTP_PORT = 587;
const FROM_EMAIL = 'noreply@networkk.in';
const TO_EMAILS = ['support@networkk.in', 'anupama.singh@networkk.in'];

export const POST: APIRoute = async ({ request }) => {
  console.log('API route called - Content-Type:', request.headers.get('content-type'));
  
  try {
    let data: any = {};
    
    // Get content type
    const contentType = request.headers.get('content-type') || '';
    
    // Parse request body based on content type
    if (contentType.includes('application/json')) {
      try {
        const rawBody = await request.text();
        console.log('Raw request body:', rawBody);
        data = JSON.parse(rawBody);
        console.log('Parsed JSON data:', data);
      } catch (jsonError) {
        console.error('JSON parse error:', jsonError);
        return new Response(JSON.stringify({ 
          success: false, 
          error: 'Invalid JSON format' 
        }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    } else {
      // Fallback to FormData
      try {
        const formData = await request.formData();
        data = Object.fromEntries(formData.entries());
        console.log('FormData parsed:', data);
      } catch (formError) {
        console.error('FormData parse error:', formError);
        return new Response(JSON.stringify({ 
          success: false, 
          error: 'Invalid form data' 
        }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }
    
    // Extract form fields
    const name = data.name?.toString() || '';
    const email = data.email?.toString() || '';
    const phone = data.phone?.toString() || '';
    const company = data.company?.toString() || '';
    const jobTitle = data.jobTitle?.toString() || '';
    const service = data.service?.toString() || '';
    const message = data.message?.toString() || '';
    const consent = data.consent === 'on' || data.consent === true;

    // Validate required fields
    if (!name || !email || !company || !jobTitle || !message || !consent) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Missing required fields' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Invalid email format' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Prepare email content
    const emailSubject = `New Contact Form Submission from ${name} - ${company}`;
    const emailBody = `
New contact form submission received:

Name: ${name}
Email: ${email}
Phone: ${phone || 'Not provided'}
Company: ${company}
Job Title: ${jobTitle}
Service of Interest: ${service || 'Not specified'}

Message:
${message}

---
This email was sent from the Networkk website contact form.
    `.trim();

    // For now, we'll just log the form submission and return success
    // In a production environment, you would integrate with an email service
    console.log('Contact form submission:', {
      name,
      email,
      phone,
      company,
      jobTitle,
      service,
      message,
      timestamp: new Date().toISOString()
    });

    // You can integrate with email services like:
    // - Nodemailer with SMTP
    // - SendGrid
    // - AWS SES
    // - Mailgun
    // - Resend
    
    // For demonstration, simulating email send
    const emailData = {
      to: TO_EMAILS,
      from: FROM_EMAIL,
      subject: emailSubject,
      text: emailBody,
      replyTo: email
    };

    console.log('Email would be sent to:', emailData.to);
    console.log('Email content:', emailData);

    // Simulate email sending delay
    await new Promise(resolve => setTimeout(resolve, 500));

    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Thank you for your inquiry. We will contact you within 24 hours.' 
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Contact form error:', error);
    
    return new Response(JSON.stringify({ 
      success: false, 
      error: 'Internal server error' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

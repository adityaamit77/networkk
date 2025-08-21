import type { APIRoute } from 'astro';

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
      consent: formData.get('consent')?.toString() || '',
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

    // Validate consent
    if (!data.consent) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Please agree to the privacy policy to continue.'
      }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }

    // Log the submission for now (in production, you'd send emails here)
    console.log('Contact form submission received:', {
      name: data.name,
      email: data.email,
      company: data.company,
      service: data.service,
      timestamp: new Date().toISOString(),
      ip: request.headers.get('x-forwarded-for') || 'Unknown'
    });

    // For now, we'll just return success
    // In production, you would integrate with:
    // - SendGrid, Mailgun, AWS SES, or Resend for email sending
    // - Or save to a database for manual processing
    
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
      error: 'Something went wrong. Please try again later or contact us directly at support@networkk.in'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};

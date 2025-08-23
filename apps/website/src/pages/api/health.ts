import type { APIRoute } from 'astro';

// Ensure this API route runs on the server
export const prerender = false;

interface HealthCheck {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  uptime: number;
  version: string;
  services: {
    database?: 'healthy' | 'unhealthy';
    email?: 'healthy' | 'degraded' | 'unhealthy';
    analytics?: 'healthy' | 'unhealthy';
    external?: 'healthy' | 'degraded' | 'unhealthy';
  };
  performance: {
    responseTime: number;
    memoryUsage?: NodeJS.MemoryUsage;
  };
}

// Store start time for uptime calculation
const startTime = Date.now();

// Test email service (Resend only)
const testEmailService = async (): Promise<'healthy' | 'degraded' | 'unhealthy'> => {
  try {
    const hasApiKey = !!process.env.RESEND_API_KEY;
    return hasApiKey ? 'healthy' : 'degraded';
  } catch {
    return 'unhealthy';
  }
};

const testAnalyticsService = async (): Promise<'healthy' | 'unhealthy'> => {
  try {
    const hasGAConfig = !!(process.env.GA_MEASUREMENT_ID && process.env.GA_API_SECRET);
    return hasGAConfig ? 'healthy' : 'unhealthy';
  } catch {
    return 'unhealthy';
  }
};

const testExternalServices = async (): Promise<'healthy' | 'degraded' | 'unhealthy'> => {
  try {
    // Test a simple external API with AbortController for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    const response = await fetch('https://httpbin.org/status/200', {
      method: 'GET',
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    return response.ok ? 'healthy' : 'degraded';
  } catch {
    return 'unhealthy';
  }
};

// Main health check
export const GET: APIRoute = async ({ request, url }) => {
  const startTime = Date.now();
  
  try {
    const detailed = url.searchParams.get('detailed') === 'true';
    
    // Basic health check
    const healthCheck: HealthCheck = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: Date.now() - startTime,
      version: process.env.npm_package_version || '1.0.0',
      services: {},
      performance: {
        responseTime: 0,
      }
    };

    // Add memory usage if detailed
    if (detailed && typeof process !== 'undefined') {
      healthCheck.performance.memoryUsage = process.memoryUsage();
    }

    // Test services if detailed check
    if (detailed) {
      const [emailStatus, analyticsStatus, externalStatus] = await Promise.allSettled([
        testEmailService(),
        testAnalyticsService(),
        testExternalServices()
      ]);

      healthCheck.services = {
        email: emailStatus.status === 'fulfilled' ? emailStatus.value : 'unhealthy',
        analytics: analyticsStatus.status === 'fulfilled' ? analyticsStatus.value : 'unhealthy',
        external: externalStatus.status === 'fulfilled' ? externalStatus.value : 'unhealthy',
      };

      // Determine overall status
      const serviceStatuses = Object.values(healthCheck.services);
      if (serviceStatuses.includes('unhealthy')) {
        healthCheck.status = 'degraded';
      }
      if (serviceStatuses.filter(s => s === 'unhealthy').length > 1) {
        healthCheck.status = 'unhealthy';
      }
    }

    // Calculate response time
    healthCheck.performance.responseTime = Date.now() - startTime;

    // Return appropriate status code
    const statusCode = healthCheck.status === 'healthy' ? 200 : 
                      healthCheck.status === 'degraded' ? 200 : 503;

    return new Response(JSON.stringify(healthCheck), {
      status: statusCode,
      headers: { 
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }
    });

  } catch (error) {
    console.error('Health check error:', error);
    
    return new Response(JSON.stringify({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: 'Health check failed',
      performance: {
        responseTime: Date.now() - startTime
      }
    }), {
      status: 503,
      headers: { 
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }
    });
  }
};

// System information endpoint
export const POST: APIRoute = async ({ request }) => {
  try {
    // Simple authentication for system info
    const authHeader = request.headers.get('authorization');
    const expectedAuth = process.env.SYSTEM_AUTH_TOKEN;
    
    if (!expectedAuth || authHeader !== `Bearer ${expectedAuth}`) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const systemInfo = {
      timestamp: new Date().toISOString(),
      uptime: Date.now() - startTime,
      environment: {
        nodeVersion: process.version,
        platform: process.platform,
        arch: process.arch,
        env: process.env.NODE_ENV || 'development',
      },
      memory: process.memoryUsage(),
      performance: {
        hrtime: process.hrtime(),
        cpuUsage: process.cpuUsage(),
      },
      configuration: {
        hasEmailService: !!process.env.RESEND_API_KEY,
        hasAnalytics: !!(process.env.GA_MEASUREMENT_ID && process.env.GA_API_SECRET),
        emailService: process.env.RESEND_API_KEY ? 'resend' : 'not-configured',
      },
      features: {
        contactForm: true,
        analytics: true,
      }
    };

    return new Response(JSON.stringify(systemInfo), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('System info error:', error);
    
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

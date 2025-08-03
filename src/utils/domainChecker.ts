// Domain connection checker utility
export interface DomainStatus {
  isConnected: boolean;
  hasSSL: boolean;
  dnsConfigured: boolean;
  cnameValid: boolean;
  error?: string;
  lastChecked: string;
}

export class DomainChecker {
  private static instance: DomainChecker;
  
  static getInstance(): DomainChecker {
    if (!DomainChecker.instance) {
      DomainChecker.instance = new DomainChecker();
    }
    return DomainChecker.instance;
  }

  async checkDomainConnection(domain: string): Promise<DomainStatus> {
    const status: DomainStatus = {
      isConnected: false,
      hasSSL: false,
      dnsConfigured: false,
      cnameValid: false,
      lastChecked: new Date().toISOString()
    };

    try {
      // Check if domain resolves and is accessible
      const response = await this.checkDomainAccessibility(domain);
      status.isConnected = response.accessible;
      status.hasSSL = response.hasSSL;

      // Check DNS configuration
      const dnsStatus = await this.checkDNSConfiguration(domain);
      status.dnsConfigured = dnsStatus.configured;
      status.cnameValid = dnsStatus.cnameValid;

    } catch (error) {
      status.error = error instanceof Error ? error.message : 'Unknown error';
    }

    return status;
  }

  private async checkDomainAccessibility(domain: string): Promise<{ accessible: boolean; hasSSL: boolean }> {
    try {
      // Try HTTPS first
      const httpsResponse = await fetch(`https://${domain}`, { 
        method: 'HEAD', 
        mode: 'no-cors',
        signal: AbortSignal.timeout(5000)
      });
      
      return { accessible: true, hasSSL: true };
    } catch (httpsError) {
      try {
        // Fallback to HTTP
        const httpResponse = await fetch(`http://${domain}`, { 
          method: 'HEAD', 
          mode: 'no-cors',
          signal: AbortSignal.timeout(5000)
        });
        
        return { accessible: true, hasSSL: false };
      } catch (httpError) {
        return { accessible: false, hasSSL: false };
      }
    }
  }

  private async checkDNSConfiguration(domain: string): Promise<{ configured: boolean; cnameValid: boolean }> {
    try {
      // In a real implementation, this would use DNS lookup APIs
      // For now, we'll simulate DNS checking
      
      // Check if domain points to trainr.app
      const response = await fetch(`https://dns.google/resolve?name=${domain}&type=CNAME`, {
        signal: AbortSignal.timeout(5000)
      });
      
      if (response.ok) {
        const data = await response.json();
        const cnameValid = data.Answer?.some((record: any) => 
          record.data?.includes('trainr.app') || record.data?.includes('trainr')
        );
        
        return { configured: true, cnameValid: cnameValid || false };
      }
      
      return { configured: false, cnameValid: false };
    } catch (error) {
      // If DNS check fails, assume it's not configured
      return { configured: false, cnameValid: false };
    }
  }

  async checkSubdomainStatus(subdomain: string): Promise<DomainStatus> {
    const fullDomain = `${subdomain}.trainr.app`;
    return this.checkDomainConnection(fullDomain);
  }

  // Mock function to simulate domain verification for demo purposes
  async simulateDomainCheck(domain: string, isCustom: boolean = false): Promise<DomainStatus> {
    // Simulate checking delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    if (isCustom) {
      // For custom domains, simulate various states
      const mockStates = [
        {
          isConnected: true,
          hasSSL: true,
          dnsConfigured: true,
          cnameValid: true,
          lastChecked: new Date().toISOString()
        },
        {
          isConnected: false,
          hasSSL: false,
          dnsConfigured: false,
          cnameValid: false,
          error: 'CNAME record not found. Please add a CNAME record pointing to trainr.app',
          lastChecked: new Date().toISOString()
        },
        {
          isConnected: true,
          hasSSL: false,
          dnsConfigured: true,
          cnameValid: true,
          error: 'SSL certificate is being provisioned. This may take up to 24 hours.',
          lastChecked: new Date().toISOString()
        }
      ];
      
      // Return a random state for demo
      return mockStates[Math.floor(Math.random() * mockStates.length)];
    } else {
      // Subdomains are always working
      return {
        isConnected: true,
        hasSSL: true,
        dnsConfigured: true,
        cnameValid: true,
        lastChecked: new Date().toISOString()
      };
    }
  }
}

// Export singleton instance
export const domainChecker = DomainChecker.getInstance();
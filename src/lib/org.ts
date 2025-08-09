import { supabase } from './supabase'

export interface Organization {
  id: string
  subdomain: string
  name: string
  logo_url: string | null
  color: string | null
  created_at: string
}

// Fetch organization by subdomain
export async function getOrganizationBySubdomain(subdomain: string): Promise<Organization | null> {
  try {
    const { data, error } = await supabase
      .from('organizations')
      .select('*')
      .eq('subdomain', subdomain)
      .single()
    
    if (error) {
      console.error('Error fetching organization:', error)
      return null
    }
    
    return data
  } catch (error) {
    console.error('Error in getOrganizationBySubdomain:', error)
    return null
  }
}

// Create organization
export async function createOrganization(data: {
  subdomain: string
  name: string
  logo_url?: string
  color?: string
}): Promise<Organization | null> {
  try {
    const { data: org, error } = await supabase
      .from('organizations')
      .insert([data])
      .select()
      .single()
    
    if (error) {
      console.error('Error creating organization:', error)
      return null
    }
    
    return org
  } catch (error) {
    console.error('Error in createOrganization:', error)
    return null
  }
}

// Update organization
export async function updateOrganization(id: string, updates: Partial<Organization>): Promise<Organization | null> {
  try {
    const { data, error } = await supabase
      .from('organizations')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) {
      console.error('Error updating organization:', error)
      return null
    }
    
    return data
  } catch (error) {
    console.error('Error in updateOrganization:', error)
    return null
  }
}

// Get subdomain from current hostname
export function getSubdomain(): string | null {
  if (typeof window === 'undefined') return null
  
  const hostname = window.location.hostname
  const parts = hostname.split('.')
  
  // Check if we're on a subdomain (more than 2 parts for domain.com)
  if (parts.length >= 3) {
    const subdomain = parts[0]
    // Exclude common subdomains that aren't educator portals
    if (!['www', 'api', 'admin', 'mail', 'ftp', 'app'].includes(subdomain)) {
      return subdomain
    }
  }
  
  return null
}

// Check if current hostname is a subdomain
export function isSubdomain(): boolean {
  return getSubdomain() !== null
}

// Get main domain
export function getMainDomain(): string {
  if (typeof window === 'undefined') return 'trytrainr.com'
  
  const hostname = window.location.hostname
  const parts = hostname.split('.')
  
  // Return the main domain (last two parts for .com)
  if (parts.length >= 2) {
    return parts.slice(-2).join('.')
  }
  
  return 'trytrainr.com'
}

// Build canonical login URL with org and redirect params
export function buildCanonicalLoginUrl(subdomain?: string, redirectTo?: string): string {
  const mainDomain = getMainDomain()
  const protocol = window.location.protocol
  
  let url = `${protocol}//${mainDomain}/login`
  const params = new URLSearchParams()
  
  if (subdomain) {
    params.set('org', subdomain)
  }
  
  if (redirectTo) {
    params.set('redirect_to', redirectTo)
  }
  
  if (params.toString()) {
    url += `?${params.toString()}`
  }
  
  return url
}
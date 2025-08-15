import { supabase } from './supabase';

export interface SignUpData {
  email: string;
  password: string;
  fullName: string;
  businessName: string;
  subdomain: string;
}

export interface SignInData {
  email: string;
  password: string;
}

export const signUp = async (data: SignUpData) => {
  const { email, password, fullName, businessName, subdomain } = data;
  
  try {
    // Sign up the user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) throw authError;

    if (authData.user) {
      // Create instructor record
      const { error: instructorError } = await supabase
        .from('instructors')
        .insert({
          id: authData.user.id,
          email,
          full_name: fullName,
          business_name: businessName,
        });

      if (instructorError) throw instructorError;

      // Create organization record
      const { error: orgError } = await supabase
        .from('organizations')
        .insert({
          subdomain: subdomain || '',
          name: businessName,
          color: '#7c3aed'
        });

      if (orgError) throw orgError;
    }

    return { data: authData, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

export const signInEmail = async (email: string, password: string) => {
  
  try {
    const { data: authData, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    return { data: authData, error };
  } catch (error) {
    return { data: null, error };
  }
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser();
  return { user, error };
};

import React, { createContext, useState, useEffect, useMemo } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    setLoading(true);
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        await checkAuthorization(session.user.email);
      }
      setLoading(false);
    }).catch(error => {
       console.error("Error getting session:", error);
       setLoading(false);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        console.log('Auth state changed:', _event, session);
        setSession(session);
        setUser(session?.user ?? null);
        setIsAuthorized(false); // Reset authorization on change
        setLoading(true);
        if (session?.user) {
          await checkAuthorization(session.user.email);
        }
        setLoading(false);
      }
    );

    return () => {
      if (authListener?.subscription) {
         authListener.subscription.unsubscribe();
      }
    };
  }, [toast]); // Add toast to dependency array

  const checkAuthorization = async (email) => {
    if (!email) {
      setIsAuthorized(false);
      return false;
    }
    try {
      const { data, error, count } = await supabase
        .from('authorized_users')
        .select('email', { count: 'exact', head: true })
        .eq('email', email);

      if (error) {
        console.error('Error checking authorization:', error);
        toast({
          title: "Error de autorización",
          description: "No se pudo verificar el permiso de acceso.",
          variant: "destructive",
        });
        setIsAuthorized(false);
        // Sign out if authorization check fails critically
        await supabase.auth.signOut();
        return false;
      }

      if (count && count > 0) {
        console.log(`User ${email} is authorized.`);
        setIsAuthorized(true);
        return true;
      } else {
        console.log(`User ${email} is NOT authorized.`);
        toast({
          title: "Acceso Denegado",
          description: "Tu correo electrónico no está autorizado para usar esta aplicación.",
          variant: "destructive",
        });
        setIsAuthorized(false);
        await supabase.auth.signOut(); // Sign out unauthorized user
        return false;
      }
    } catch (error) {
       console.error("Unexpected error during authorization check:", error);
        toast({
          title: "Error Inesperado",
          description: "Ocurrió un problema al verificar tu acceso.",
          variant: "destructive",
        });
       setIsAuthorized(false);
       await supabase.auth.signOut();
       return false;
    }
  };

  const signOut = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signOut();
     if (error) {
        console.error("Error signing out:", error);
        toast({
            title: "Error",
            description: "No se pudo cerrar la sesión.",
            variant: "destructive"
        });
     }
    // State updates will be handled by onAuthStateChange listener
    // setLoading(false); // Handled by listener
  }

  const value = useMemo(() => ({
    session,
    user,
    isAuthorized,
    loading,
    signOut,
  }), [session, user, isAuthorized, loading, signOut]);

  // Show loading indicator while checking initial session or during auth changes
  if (loading && session === null) { // Show loader only on initial load potentially
    return (
        <div className="flex justify-center items-center min-h-screen bg-background">
            <Loader2 className="h-16 w-16 animate-spin text-primary" />
        </div>
    );
   }


  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

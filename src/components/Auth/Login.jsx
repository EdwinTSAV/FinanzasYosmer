
import React, { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '@/components/ui/use-toast';

// Replace with your actual SVG content or path
const GoogleIcon = () => (
  <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
    <path fill="currentColor" d="M488 261.8C488 403.3 381.5 512 244 512 110.3 512 0 401.7 0 261.8 0 120.3 110.3 8.5 244 8.5c71.8 0 129.4 28.7 173.4 74.5l-64.5 64.5C314.3 118.1 283.1 104 244 104c-80.9 0-146.3 65.8-146.3 146.9s65.5 146.9 146.3 146.9c91.1 0 120.7-64.3 125.9-97.5H244V261.8h244z"></path>
  </svg>
);


function Login() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { toast } = useToast();

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      const { error: signInError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
           // If running locally on a different port, specify it here
           // redirectTo: 'http://localhost:5173/' // Example for local dev
           // For production/preview, Supabase usually handles this automatically if configured
        }
      });

      if (signInError) {
        console.error('Google Sign-In Error:', signInError);
        setError(`Error al iniciar sesión: ${signInError.message}`);
        toast({
            title: "Error de Inicio de Sesión",
            description: signInError.message,
            variant: "destructive"
        });
      }
      // No need to setLoading(false) here, as the page will redirect or auth state change will trigger re-render.
    } catch (catchError) {
        console.error('Unexpected Google Sign-In Error:', catchError);
        setError('Ocurrió un error inesperado.');
         toast({
            title: "Error Inesperado",
            description: "No se pudo iniciar el proceso de sesión con Google.",
            variant: "destructive"
        });
        setLoading(false); // Set loading false only if catch block is hit
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-background to-muted p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="w-full max-w-md shadow-2xl border-none bg-card/90 backdrop-blur-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-primary">Iniciar Sesión</CardTitle>
            <CardDescription>Accede a tu Control Financiero Familiar</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <div className="flex items-center p-3 bg-destructive/20 border border-destructive text-destructive rounded-md text-sm">
                <AlertCircle className="h-4 w-4 mr-2" />
                {error}
              </div>
            )}
            <Button
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full text-lg py-6 shadow-lg"
              variant="outline"
            >
              {loading ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                 <GoogleIcon />
              )}
              {loading ? 'Redirigiendo...' : 'Continuar con Google'}
            </Button>
             <p className="text-xs text-center text-muted-foreground mt-4">
               Solo los usuarios autorizados pueden acceder.
             </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

export default Login;


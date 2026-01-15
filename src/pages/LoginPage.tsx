import React, { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { AppRoute } from '../types';
import { Mail, Lock, LogIn, ArrowRight, Loader2, AlertTriangle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface LoginPageProps {
    onNavigate: (page: AppRoute) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onNavigate }) => {
    const { user } = useAuth();
    const [isSignUp, setIsSignUp] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    // Si déjà connecté, redirection vers Génération
    if (user) {
        onNavigate(AppRoute.GENERATE);
        return null;
    }

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrorMsg(null);

        if (!supabase) {
            setErrorMsg("Service d'authentification non configuré (vérifiez les variables d'environnement).");
            setLoading(false);
            return;
        }

        try {
            if (isSignUp) {
                const { error } = await supabase.auth.signUp({ email, password });
                if (error) throw error;
                alert("Compte créé ! Veuillez vérifier vos emails pour confirmer.");
                setIsSignUp(false);
            } else {
                const { error } = await supabase.auth.signInWithPassword({ email, password });
                if (error) throw error;
                onNavigate(AppRoute.GENERATE);
            }
        } catch (error: any) {
            setErrorMsg(error.message || "Une erreur est survenue.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-luxury-black p-4 animate-fade-in-up">
            <div className="w-full max-w-md bg-white/5 border border-white/10 rounded-sm p-8 shadow-2xl relative overflow-hidden">
                {/* Background Decor */}
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-luxury-gold/10 rounded-full blur-3xl pointer-events-none"></div>

                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-white mb-2 font-sans tracking-tight">
                        {isSignUp ? 'Créer un compte' : 'Espace Membre'}
                    </h1>
                    <p className="text-sm text-gray-400 font-light">
                        {isSignUp ? "Rejoignez l'élite des candidats." : 'Accédez à vos dossiers et crédits.'}
                    </p>
                </div>

                {errorMsg && (
                    <div className="bg-red-900/20 border border-red-500/50 p-3 mb-6 rounded-sm flex items-center gap-3">
                        <AlertTriangle className="text-red-500 flex-shrink-0" size={16} />
                        <p className="text-xs text-red-200">{errorMsg}</p>
                    </div>
                )}

                <form onSubmit={handleAuth} className="space-y-4">
                    <div className="group">
                        <label className="block text-xs font-bold text-luxury-gold uppercase tracking-wider mb-2">Email</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-3 text-gray-500" size={16} />
                            <input 
                                type="email" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-black/40 border border-white/10 rounded-sm text-white pl-10 pr-4 py-2.5 focus:border-luxury-gold focus:ring-1 focus:ring-luxury-gold outline-none transition-all placeholder-gray-600 text-sm"
                                placeholder="nom@exemple.com"
                                required 
                            />
                        </div>
                    </div>
                    
                    <div className="group">
                        <label className="block text-xs font-bold text-luxury-gold uppercase tracking-wider mb-2">Mot de passe</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-3 text-gray-500" size={16} />
                            <input 
                                type="password" 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-black/40 border border-white/10 rounded-sm text-white pl-10 pr-4 py-2.5 focus:border-luxury-gold focus:ring-1 focus:ring-luxury-gold outline-none transition-all placeholder-gray-600 text-sm"
                                placeholder="********"
                                required 
                            />
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full bg-white text-luxury-black py-3 px-4 rounded-sm font-bold uppercase tracking-widest hover:bg-luxury-gold transition-all duration-300 flex items-center justify-center mt-6 disabled:opacity-70"
                    >
                        {loading ? <Loader2 className="animate-spin mr-2" size={16}/> : <LogIn className="mr-2" size={16}/>}
                        {isSignUp ? "S'inscrire" : "Se connecter"}
                    </button>
                </form>

                <div className="mt-6 text-center border-t border-white/5 pt-4">
                    <button 
                        onClick={() => setIsSignUp(!isSignUp)}
                        className="text-xs text-gray-400 hover:text-white transition-colors flex items-center justify-center mx-auto"
                    >
                        {isSignUp ? "Déjà un compte ? Se connecter" : "Pas encore de compte ? S'inscrire"}
                        <ArrowRight size={12} className="ml-1" />
                    </button>
                </div>
                
                <div className="mt-8 text-center">
                    <button onClick={() => onNavigate(AppRoute.HOME)} className="text-[10px] text-gray-600 hover:text-gray-400 uppercase tracking-widest">
                        Retour à l'accueil
                    </button>
                </div>
            </div>
        </div>
    );
};

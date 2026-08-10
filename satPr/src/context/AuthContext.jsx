import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [role, setRole] = useState('student'); // 'student' | 'admin'
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getInitialSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setUser(session.user);
          await fetchProfile(session.user);
        } else {
          const savedRole = localStorage.getItem('demo_user_role');
          const savedEmail = localStorage.getItem('demo_user_email');
          if (savedRole) {
            setRole(savedRole);
            setUser({ email: savedEmail ||` ${savedRole}@satmastery.com`, id: 'demo-user-id' });
            setProfile({ full_name: savedRole === 'admin' ? 'Администратор' : 'Ученик', role: savedRole });
          }
        }
      } catch (err) {
        console.warn('Error checking session:', err.message);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        setUser(session.user);
        await fetchProfile(session.user);
      } else {
        const savedRole = localStorage.getItem('demo_user_role');
        if (!savedRole) {
          setUser(null);
          setProfile(null);
          setRole(null);
        }
      }
      setLoading(false);
    });

    return () => subscription?.unsubscribe();
  }, []);

  const fetchProfile = async (authUser) => {
    try {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .single();

      if (data) {
        setProfile(data);
        setRole(data.role || 'student');
      } else {
        const metaRole = authUser.user_metadata?.role || 'student';
        setRole(metaRole);
        setProfile({
          full_name: authUser.user_metadata?.full_name || authUser.email,
          role: metaRole
        });
      }
    } catch (err) {
      const metaRole = authUser.user_metadata?.role || 'student';
      setRole(metaRole);
      setProfile({ full_name: authUser.email, role: metaRole });
    }
  };

  const signUp = async (email, password, roleChoice = 'student', fullName = '') => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          role: roleChoice,
          full_name: fullName || email
        }
      }
    });

    if (error) throw error;

    if (data?.user) {
      setUser(data.user);
      setRole(roleChoice);
      setProfile({ full_name: fullName || email, role: roleChoice });

      try {
        await supabase.from('profiles').upsert({
          id: data.user.id,
          email: email,
          full_name: fullName || email,
          role: roleChoice
        });
      } catch (pErr) {
        console.warn('Profiles table notice:', pErr.message);
      }
    }
    return data;
  };

  const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) throw error;
    if (data?.user) {
      setUser(data.user);
      await fetchProfile(data.user);
    }
    return data;
  };

  const loginAsDemo = (demoRole) => {
    localStorage.setItem('demo_user_role', demoRole);
    localStorage.setItem('demo_user_email', demoRole === 'admin' ? 'admin@satmastery.com' : 'student@satmastery.com');
    setRole(demoRole);
    setUser({ email: demoRole === 'admin' ? 'admin@satmastery.com' : 'student@satmastery.com', id: 'demo-id' });
    setProfile({
      full_name: demoRole === 'admin' ? 'Главный Администратор' : 'Ученик Alex',
      role: demoRole
    });
  };

  const signOut = async () => {
localStorage.removeItem('demo_user_role');
    localStorage.removeItem('demo_user_email');
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    setRole(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        role,
        loading,
        signUp,
        signIn,
        loginAsDemo,
        signOut,
        isAdmin: role === 'admin',
        isStudent: role === 'student'
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
import { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import LoginPage from './components/LoginPage';
import FamilyTree from './components/FamilyTree';
import PersonForm from './components/PersonForm';

function App() {
  const [session, setSession] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  if (!session) return <LoginPage />;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-center mb-6">🌳 Family Lineage Tracker</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white shadow-md rounded-2xl p-6">
          <FamilyTree refreshKey={refreshKey} />
        </div>

        <div className="bg-white shadow-md rounded-2xl p-6">
          <PersonForm onPersonAdded={() => setRefreshKey(prev => prev + 1)} />
        </div>
      </div>
    </div>
  );
}

export default App;

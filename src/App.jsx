import { useState } from 'react';
import PersonForm from './components/PersonForm';
import FamilyTree from './components/FamilyTree';
import RelationshipEditor from './components/RelationshipEditor';

function App() {
  const [refreshCounter, setRefreshCounter] = useState(0);

  const triggerRefresh = () => {
    setRefreshCounter((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Header */}
      <header className="bg-green-700 text-white py-4 text-center text-2xl font-semibold shadow">
        🌳 Family Lineage Tracker
      </header>

      {/* Main layout */}
      <main className="flex flex-col md:flex-row flex-grow">
        {/* Form Section */}
        <section className="w-full md:w-1/3 p-4 overflow-y-auto bg-white border-b md:border-b-0 md:border-r">
          <PersonForm onPersonAdded={triggerRefresh} />
        </section>

        {/* Tree + Relationship Editor Section */}
        <section className="w-full md:w-2/3 p-4 bg-gray-50 overflow-auto space-y-6">
          <FamilyTree refresh={refreshCounter} />
          <RelationshipEditor onUpdated={triggerRefresh} />
        </section>
      </main>

      {/* Footer */}
      <footer className="text-center text-sm text-gray-500 py-4 border-t">
        Built with ❤️ using Supabase + React
      </footer>
    </div>
  );
}

export default App;

import { useState } from 'react';
import PersonForm from './components/PersonForm';
import FamilyTree from './components/FamilyTree';

function App() {
  const [refreshCounter, setRefreshCounter] = useState(0);

  const triggerRefresh = () => {
    setRefreshCounter((prev) => prev + 1);
  };

  return (
    <>
      <PersonForm onPersonAdded={triggerRefresh} />
      <FamilyTree refresh={refreshCounter} />
    </>
  );
}

export default App;

import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

export default function PersonForm({ onPersonAdded }) {
  const [fullName, setFullName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [deathDate, setDeathDate] = useState('');
  const [notes, setNotes] = useState('');
  const [parentId, setParentId] = useState('');
  const [people, setPeople] = useState([]);

  useEffect(() => {
    const fetchPeople = async () => {
      const { data } = await supabase.from('persons').select('*');
      setPeople(data || []);
    };
    fetchPeople();
  }, []);

  const handleAdd = async () => {
    if (!fullName) return;

    const { data: newPerson, error } = await supabase
      .from('persons')
      .insert([{ full_name: fullName, birth_date: birthDate, death_date: deathDate, notes }])
      .select()
      .single();

    if (parentId && newPerson) {
      await supabase
        .from('relationships')
        .insert([{ parent_id: parentId, child_id: newPerson.id }]);
    }

    // Clear form
    setFullName('');
    setBirthDate('');
    setDeathDate('');
    setNotes('');
    setParentId('');

    // Trigger refresh
    if (onPersonAdded) onPersonAdded();
  };

  return (
    <div className="bg-white p-6 rounded shadow max-w-md mx-auto my-8">
      <h2 className="text-2xl font-bold mb-4 text-center">Add Person</h2>

      <input
        type="text"
        className="w-full p-2 mb-2 border rounded"
        placeholder="Full name"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
      />

      <input
        type="date"
        className="w-full p-2 mb-2 border rounded"
        value={birthDate}
        onChange={(e) => setBirthDate(e.target.value)}
      />

      <input
        type="date"
        className="w-full p-2 mb-2 border rounded"
        value={deathDate}
        onChange={(e) => setDeathDate(e.target.value)}
      />

      <textarea
        className="w-full p-2 mb-2 border rounded"
        placeholder="Notes"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
      />

      <select
        className="w-full p-2 mb-4 border rounded"
        value={parentId}
        onChange={(e) => setParentId(e.target.value)}
      >
        <option value="">Select parent (optional)</option>
        {people.map((p) => (
          <option key={p.id} value={p.id}>
            {p.full_name}
          </option>
        ))}
      </select>

      <button
        onClick={handleAdd}
        className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700"
      >
        ➕ Add Person
      </button>
    </div>
  );
}

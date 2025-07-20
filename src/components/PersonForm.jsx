import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

export default function PersonForm({ onPersonAdded }) {
  const [fullName, setFullName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [deathDate, setDeathDate] = useState('');
  const [notes, setNotes] = useState('');
  const [parentId, setParentId] = useState('');
  const [relationType, setRelationType] = useState('');
  const [people, setPeople] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch people from Supabase to populate dropdown
  useEffect(() => {
    const fetchPeople = async () => {
      const { data, error } = await supabase.from('persons').select('*');
      if (error) console.error('Fetch error:', error.message);
      setPeople(data || []);
    };
    fetchPeople();
  }, []);

  const handleAdd = async () => {
    if (!fullName.trim()) {
      setError('Full name is required');
      return;
    }

    setLoading(true);
    setError('');

    const { data: authData, error: authError } = await supabase.auth.getUser();
    const user = authData?.user;
    console.log("🧑 Logged-in User ID:", user?.id);

    if (!user) {
      setError('You must be logged in to add a person.');
      setLoading(false);
      return;
    }

    console.log('🧑 Logged-in User ID:', user.id);

    const insertPayload = {
      full_name: fullName.trim(),
      birth_date: birthDate || null,
      death_date: deathDate || null,
      notes: notes || null,
      user_id: user.id,
    };

    const { data: newPerson, error: personErr } = await supabase
      .from('persons')
      .insert([insertPayload])
      .select()
      .single();

    if (personErr) {
      console.error('INSERT ERROR:', personErr.message);
      setError('❌ Failed to insert person: ' + personErr.message);
      setLoading(false);
      return;
    }

    // Insert relationship if selected
    if (parentId && newPerson) {
      const { error: relErr } = await supabase.from('relationships').insert([
        {
          parent_id: parentId,
          child_id: newPerson.id,
          relation: relationType || null,
        },
      ]);

      if (relErr) {
        console.error('RELATIONSHIP ERROR:', relErr.message);
        setError('❌ Failed to link relationship: ' + relErr.message);
        setLoading(false);
        return;
      }
    }

    // Reset form
    setFullName('');
    setBirthDate('');
    setDeathDate('');
    setNotes('');
    setParentId('');
    setRelationType('');
    setLoading(false);

    if (onPersonAdded) onPersonAdded();
  };

  return (
    <div className="bg-white p-6 rounded shadow max-w-xl mx-auto mt-6">
      <h2 className="text-2xl font-bold mb-4 text-center">➕ Add Person</h2>

      {error && <p className="text-red-600 mb-4 text-sm">{error}</p>}

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
        className="w-full p-2 mb-2 border rounded"
        value={parentId}
        onChange={(e) => setParentId(e.target.value)}
      >
        <option value="">Select parent/spouse (optional)</option>
        {people.map((p) => (
          <option key={p.id} value={p.id}>
            {p.full_name}
          </option>
        ))}
      </select>

      <select
        className="w-full p-2 mb-4 border rounded"
        value={relationType}
        onChange={(e) => setRelationType(e.target.value)}
      >
        <option value="">Select relationship</option>
        <option value="mother">Mother</option>
        <option value="father">Father</option>
        <option value="wife">Wife</option>
        <option value="husband">Husband</option>
        <option value="guardian">Guardian</option>
      </select>

      <button
        onClick={handleAdd}
        disabled={loading}
        className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700"
      >
        {loading ? 'Adding...' : 'Add Person'}
      </button>
    </div>
  );
}

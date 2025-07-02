import { useEffect, useState } from 'react';
import { addPerson, getAllPersons } from '../services/personService';
import { supabase } from '../supabaseClient';

function PersonForm({ onPersonAdded }) {
  const [formData, setFormData] = useState({
    full_name: '',
    birth_date: '',
    death_date: '',
    notes: '',
    parents: [],
  });
  const [people, setPeople] = useState([]);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    async function loadPeople() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const res = await getAllPersons(user.id);
        setPeople(res || []);
      }
    }

    loadPeople();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const person = {
      full_name: formData.full_name,
      birth_date: formData.birth_date || null,
      death_date: formData.death_date || null,
      notes: formData.notes,
      user_id: user.id,
    };

    const result = await addPerson(person, formData.parents);

    if (result) {
      setSuccess(true);
      setFormData({
        full_name: '',
        birth_date: '',
        death_date: '',
        notes: '',
        parents: [],
      });
      onPersonAdded?.();

      setTimeout(() => setSuccess(false), 2500);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4 text-center">Add Person</h2>
      {success && (
        <div className="bg-green-100 text-green-800 text-sm px-4 py-2 mb-3 rounded">
          ✅ Person added successfully!
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="full_name"
          value={formData.full_name}
          onChange={handleChange}
          required
          placeholder="Full name"
          className="w-full p-2 border rounded focus:outline-none focus:ring"
        />
        <input
          name="birth_date"
          type="date"
          value={formData.birth_date}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <input
          name="death_date"
          type="date"
          value={formData.death_date}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          placeholder="Notes"
          rows={3}
          className="w-full p-2 border rounded"
        />

        <select
          name="parents"
          multiple
          value={formData.parents}
          onChange={(e) =>
            setFormData({ ...formData, parents: [...e.target.selectedOptions].map(o => o.value) })
          }
          className="w-full p-2 border rounded"
        >
          <option disabled value="">-- Select parent(s) --</option>
          {people.map(p => (
            <option key={p.id} value={p.id}>
              {p.full_name}
            </option>
          ))}
        </select>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded"
        >
          ➕ Add Person
        </button>
      </form>
    </div>
  );
}

export default PersonForm;

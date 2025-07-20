import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

export default function RelationshipEditor({ onUpdated }) {
  const [relationships, setRelationships] = useState([]);
  const [persons, setPersons] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      const { data: rels } = await supabase.from('relationships').select('*');
      const { data: people } = await supabase.from('persons').select('*');
      setRelationships(rels || []);
      setPersons(people || []);
    };
    loadData();
  }, []);

  const handleRelationChange = async (id, newRelation) => {
    await supabase.from('relationships').update({ relation: newRelation }).eq('id', id);
    if (onUpdated) onUpdated();
  };

  const getName = (id) => persons.find((p) => p.id === id)?.full_name || 'Unknown';

  return (
    <div className="bg-white p-4 mt-6 rounded shadow max-w-2xl mx-auto">
      <h2 className="text-xl font-bold mb-4">🔗 Edit Relationships</h2>
      {relationships.length === 0 ? (
        <p className="text-gray-500">No relationships found.</p>
      ) : (
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left border-b">
              <th className="p-2">Parent</th>
              <th className="p-2">Child</th>
              <th className="p-2">Relation</th>
            </tr>
          </thead>
          <tbody>
            {relationships.map((rel) => (
              <tr key={rel.id} className="border-t">
                <td className="p-2">{getName(rel.parent_id)}</td>
                <td className="p-2">{getName(rel.child_id)}</td>
                <td className="p-2">
                  <select
                    className="border rounded p-1"
                    value={rel.relation || ''}
                    onChange={(e) => handleRelationChange(rel.id, e.target.value)}
                  >
                    <option value="">—</option>
                    <option value="mother">Mother</option>
                    <option value="father">Father</option>
                    <option value="wife">Wife</option>
                    <option value="husband">Husband</option>
                    <option value="guardian">Guardian</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

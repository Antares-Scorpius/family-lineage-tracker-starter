import { useEffect, useState } from 'react';
import Tree from 'react-d3-tree';
import { supabase } from '../supabaseClient';
import { getAllPersons } from '../services/personService';

function FamilyTree({ refreshKey }) {
  const [treeData, setTreeData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTree() {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      try {
        const people = await getAllPersons(user.id);
        console.log('Fetched people:', people);

        const formatted = buildTree(people);
        setTreeData(formatted);
      } catch (error) {
        console.error('Error loading tree:', error);
        setTreeData({ name: 'Error loading tree' });
      }

      setLoading(false);
    }

    loadTree();
  }, [refreshKey]);

  function buildTree(persons) {
    const map = {};
    const roots = [];

    persons.forEach(p => {
      map[p.id] = { name: p.full_name, children: [] };
    });

    persons.forEach(p => {
      const parentLinks = persons.filter(rel => rel.child_id === p.id);
      if (parentLinks.length === 0) {
        roots.push(map[p.id]);
      } else {
        parentLinks.forEach(link => {
          const parent = map[link.parent_id];
          if (parent) parent.children.push(map[p.id]);
        });
      }
    });

    return roots[0] || { name: 'No Data' };
  }

  return (
    <div className="w-full h-[500px]">
      <h2 className="text-xl font-semibold mb-4 text-center">Family Tree View</h2>

      {loading && <p className="text-center text-gray-500">Loading tree...</p>}
      {!loading && treeData?.name === 'No Data' && (
        <p className="text-center text-gray-500">No people added yet. Add someone!</p>
      )}

      {!loading && treeData?.name !== 'No Data' && (
        <div className="w-full h-full border border-gray-200 rounded-lg">
          <Tree data={treeData} orientation="vertical" />
        </div>
      )}
    </div>
  );
}

export default FamilyTree;

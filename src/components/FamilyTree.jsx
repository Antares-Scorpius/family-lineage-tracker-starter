import { useEffect, useState } from 'react';
import Tree from 'react-d3-tree';
import { supabase } from '../supabaseClient';

export default function FamilyTree({ refresh }) {
  const [treeData, setTreeData] = useState(null);

  useEffect(() => {
    const loadTreeData = async () => {
      const { data: persons } = await supabase.from('persons').select('*');
      const { data: relationships } = await supabase.from('relationships').select('*');
      if (!persons || !relationships) return;

      const peopleMap = {};
      persons.forEach((p) => {
        peopleMap[p.id] = {
          name: p.full_name,
          attributes: {
            birth: p.birth_date || '',
            notes: p.notes || '',
          },
          children: [],
        };
      });

      relationships.forEach((rel) => {
        if (peopleMap[rel.parent_id] && peopleMap[rel.child_id]) {
          peopleMap[rel.parent_id].children.push(peopleMap[rel.child_id]);
        }
      });

      const allChildIds = new Set(relationships.map((r) => r.child_id));
      const roots = persons
        .filter((p) => !allChildIds.has(p.id))
        .map((p) => peopleMap[p.id]);

      setTreeData(roots.length > 0 ? roots : null);
    };

    loadTreeData();
  }, [refresh]);

  return (
    <div style={{ width: '100%', height: '100vh' }}>
      {treeData ? (
        <Tree
          data={treeData}
          orientation="vertical"
          translate={{ x: 500, y: 100 }}
          pathFunc="step"
        />
      ) : (
        <p className="text-center text-gray-500 p-4">No tree data found</p>
      )}
    </div>
  );
}

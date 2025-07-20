import { useEffect, useState } from 'react';
import Tree from 'react-d3-tree';
import { supabase } from '../supabaseClient';

export default function FamilyTree({ refresh }) {
  const [treeData, setTreeData] = useState(null);

  useEffect(() => {
    const loadTreeData = async () => {
      const { data: persons, error: personErr } = await supabase
        .from('persons')
        .select('*');

      const { data: relationships, error: relErr } = await supabase
        .from('relationships')
        .select('*');

      if (personErr || relErr || !persons || !relationships) {
        console.error('Error loading data:', personErr || relErr);
        return;
      }

      // Create map of people
      const peopleMap = {};
      persons.forEach((p) => {
        peopleMap[p.id] = {
          id: p.id,
          name: p.full_name,
          attributes: {
            birth: p.birth_date || '',
            notes: p.notes || '',
          },
          children: [],
        };
      });

      // Add children with relation label
      relationships.forEach((rel) => {
        const parent = peopleMap[rel.parent_id];
        const child = peopleMap[rel.child_id];
        if (parent && child) {
          const labeledChild = {
            ...child,
            name: `${child.name}${rel.relation ? ` (${rel.relation})` : ''}`,
          };
          parent.children.push(labeledChild);
        }
      });

      // Find root nodes (not listed as child)
      const allChildIds = new Set(relationships.map((r) => r.child_id));
      const rootNodes = persons
        .filter((p) => !allChildIds.has(p.id))
        .map((p) => peopleMap[p.id]);

      setTreeData(rootNodes.length > 0 ? rootNodes : null);
    };

    loadTreeData();
  }, [refresh]);

  return (
    <div className="w-full h-[90vh] bg-gray-100 rounded shadow-inner p-2 overflow-auto">
      {treeData ? (
        <Tree
          data={treeData}
          orientation="vertical"
          translate={{ x: 600, y: 100 }}
          pathFunc="step"
          collapsible={true}
          zoomable={true}
          separation={{ siblings: 1.5, nonSiblings: 2 }}
        />
      ) : (
        <p className="text-center text-gray-500 mt-10">No tree data found.</p>
      )}
    </div>
  );
}

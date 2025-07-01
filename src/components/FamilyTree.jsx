import { useEffect, useState } from 'react'
import Tree from 'react-d3-tree'
import { getAllPersons } from '../services/personService'
import { supabase } from '../supabaseClient'

function FamilyTree({ refreshKey }) {
  const [treeData, setTreeData] = useState(null)

  useEffect(() => {
    async function loadTree() {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      console.log('Supabase user:', user)

      if (!user) return

      const people = await getAllPersons(user.id)
      console.log('Fetched people:', people)

      const formatted = buildTree(people)
      console.log('Formatted tree:', formatted)

      setTreeData(formatted)
    }

    loadTree()
  }, [refreshKey])

  return (
    <div className="w-full h-[500px] p-4">
      <h2 className="text-2xl font-bold mb-4">Family Tree</h2>
      <div className="w-full h-full bg-white border rounded">
        {treeData ? (
          <Tree data={treeData} orientation="vertical" />
        ) : (
          <p className="text-center p-4">Loading tree...</p>
        )}
      </div>
    </div>
  )
}

function buildTree(persons) {
  const map = {}
  const roots = []

  persons.forEach((p) => {
    map[p.id] = { name: p.full_name, children: [] }
  })

  persons.forEach((p) => {
    const parentLinks = persons.filter((rel) => rel.child_id === p.id)
    if (parentLinks.length === 0) {
      roots.push(map[p.id])
    } else {
      parentLinks.forEach((link) => {
        const parent = map[link.parent_id]
        if (parent) parent.children.push(map[p.id])
      })
    }
  })

  return roots[0] || { name: 'No Data' }
}

export default FamilyTree

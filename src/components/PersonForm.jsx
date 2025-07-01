import { useEffect, useState } from 'react'
import { addPerson, addRelationship, getAllPersons } from '../services/personService'
import { supabase } from '../supabaseClient'

function PersonForm({ onPersonAdded }) {
  const [formData, setFormData] = useState({
    full_name: '',
    birth_date: '',
    death_date: '',
    notes: '',
    parents: [],
  })
  const [allPersons, setAllPersons] = useState([])
  const [message, setMessage] = useState(null)

  useEffect(() => {
    async function load() {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) return
      const people = await getAllPersons(user.id)
      setAllPersons(people)
    }

    load()
  }, [])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleParentSelect = (e) => {
    const selected = Array.from(e.target.selectedOptions).map((o) => o.value)
    setFormData({ ...formData, parents: selected })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    const newPerson = {
      full_name: formData.full_name,
      birth_date: formData.birth_date || null,
      death_date: formData.death_date || null,
      notes: formData.notes,
      user_id: user.id,
    }

    try {
      const created = await addPerson(newPerson)

      for (const parentId of formData.parents) {
        await addRelationship(created.id, parentId)
      }

      setMessage('Person + relationship(s) added ✅')
      setFormData({
        full_name: '',
        birth_date: '',
        death_date: '',
        notes: '',
        parents: [],
      })
      onPersonAdded && onPersonAdded()
    } catch (error) {
      console.error('Form error:', error)
      setMessage('Failed to add person ❌')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow space-y-4 max-w-md mx-auto mt-6">
      <h2 className="text-lg font-bold">Add New Person</h2>

      <input
        name="full_name"
        value={formData.full_name}
        onChange={handleChange}
        placeholder="Full Name"
        className="w-full p-2 border rounded"
        required
      />

      <input
        name="birth_date"
        value={formData.birth_date}
        onChange={handleChange}
        placeholder="Birth Date (YYYY-MM-DD)"
        className="w-full p-2 border rounded"
      />

      <input
        name="death_date"
        value={formData.death_date}
        onChange={handleChange}
        placeholder="Death Date (YYYY-MM-DD)"
        className="w-full p-2 border rounded"
      />

      <textarea
        name="notes"
        value={formData.notes}
        onChange={handleChange}
        placeholder="Notes"
        className="w-full p-2 border rounded"
      />

      <select multiple value={formData.parents} onChange={handleParentSelect} className="w-full p-2 border rounded">
        <option disabled value="">Select Parents (optional)</option>
        {allPersons.map((p) => (
          <option key={p.id} value={p.id}>
            {p.full_name}
          </option>
        ))}
      </select>

      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
        Add Person
      </button>

      {message && <p className="text-sm">{message}</p>}
    </form>
  )
}

export default PersonForm

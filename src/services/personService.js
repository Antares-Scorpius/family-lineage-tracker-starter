import { supabase } from '../supabaseClient'

export async function getAllPersons(user_id) {
  const { data, error } = await supabase
    .from('persons')
    .select('*')
    .eq('user_id', user_id)

  if (error) {
    console.error('Error fetching persons:', error)
    return []
  }

  return data
}

export async function addPerson(person) {
  const { data, error } = await supabase
    .from('persons')
    .insert([person])
    .select()

  if (error) {
    console.error('Error adding person:', error)
    throw error
  }

  return data[0]
}

export async function addRelationship(childId, parentId) {
  const { error } = await supabase
    .from('relationships')
    .insert([{ child_id: childId, parent_id: parentId }])

  if (error) {
    console.error('Error adding relationship:', error)
    throw error
  }
}

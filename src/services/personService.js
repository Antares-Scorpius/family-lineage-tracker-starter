import { supabase } from '../supabaseClient';

export async function getAllPersons(user_id) {
  const { data, error } = await supabase
    .from('persons')
    .select('*')
    .eq('user_id', user_id);

  if (error) {
    console.error('Error fetching persons:', error);
    return [];
  }

  return data;
}

export async function addPerson(person, parentIds = []) {
  const { data: personData, error } = await supabase
    .from('persons')
    .insert([person])
    .select();

  if (error) {
    console.error('Error adding person:', error);
    return null;
  }

  const newPersonId = personData[0].id;

  // Now insert relationships if any parents were selected
  if (parentIds.length > 0) {
    const relationshipInserts = parentIds.map(pid => ({
      parent_id: pid,
      child_id: newPersonId,
    }));

    const { error: relError } = await supabase
      .from('relationships')
      .insert(relationshipInserts);

    if (relError) {
      console.error('Error creating relationships:', relError);
    }
  }

  return personData[0];
}

import { useEffect, useState } from 'react'
import { supabase } from './supabaseClient'
import LoginPage from './components/LoginPage'
import FamilyTree from './components/FamilyTree'
import PersonForm from './components/PersonForm'

function App() {
  const [user, setUser] = useState(null)
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
    })

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user || null)
      }
    )

    return () => {
      authListener?.subscription.unsubscribe()
    }
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {user ? (
        <>
          <FamilyTree refreshKey={refreshKey} />
          <PersonForm onPersonAdded={() => setRefreshKey((k) => k + 1)} />
        </>
      ) : (
        <LoginPage onLogin={setUser} />
      )}
    </div>
  )
}

export default App

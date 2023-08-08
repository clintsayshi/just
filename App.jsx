import { useEffect, useState } from "react";
import MainContent from "./components/MainContent";
import supabase from "./config/supabaseClient";
/**
 * The App function renders different components based on the value of the isAuthenticated state
 * variable.
 * @returns The App component is returning a div element. If the isAuthenticated state is false, it
 * renders an AuthModal component with an onLogin prop that sets the isAuthenticated state to true when
 * called. If the isAuthenticated state is true, it renders a MainContent component.
 */
function App() {
  const [user, setUser] = useState(null);

  async function fetchUserSession(){
    const session = await supabase.auth.getSession();
    setUser(await session?.user);
  }

  /* The `useEffect` hook in this code is used to fetch the user session and set the `user` state variable accordingly. */
  useEffect( () => {
    fetchUserSession()

    const unsubscribe = () =>
      supabase.auth.onAuthStateChange((event, session) => {
        switch (event) {
          case "SIGNED_IN":
            setUser(session?.user);
            break;
          default:
            setUser(null);
        }
      });

      return () => {
        unsubscribe()
      }
  }, []);

  async function signInWithGitHub() {
    await supabase.auth.signInWithOAuth({
      provider: 'github',
    })
  }

  const logout = async () => {
    await supabase.auth.signOut()
  }

  return (
    <>
     {user? ( <><h1>Hello World</h1> <MainContent /> </>) : <button onClick={signInWithGitHub}>Login</button>}
     <button onClick={logout}>LogOut</button>
    </>
  );
}

export default App;

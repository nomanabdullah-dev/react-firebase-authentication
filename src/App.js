import './App.css';
import React, { useState } from'react';
import { initializeApp } from 'firebase/app';
import firebaseConfig from './firebase.config';
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";

initializeApp(firebaseConfig);

function App() {
  const [user, setUser] = useState({
    name: '',
    email: '',
    photoURL: '',
    isSignedIn: false
  })

  const provider = new GoogleAuthProvider();

  const handleSignIn = () => {
    const auth = getAuth();
    signInWithPopup(auth, provider)
      .then((result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        const user = result.user;
        const {displayName, email, photoURL} = user;
        const signedInUser = {
          name: displayName,
          email: email,
          photoURL: photoURL,
          isSignedIn: true
        }
        setUser(signedInUser);
        // ...
      }).catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        const email = error.customData.email;
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
      });
  }

  const handleSignOut = () => {
    const auth = getAuth();
    signOut(auth)
     .then(() => {
        setUser({
          name: '',
          email: '',
          photoURL: '',
          isSignedIn: false
        })
        //...
      }).catch((error) => {
        console.log(error);
      });
  }

  return (
    <div className="App">
      {
        user.isSignedIn ? 
          <button onClick={handleSignOut}>Sign Out</button>
         : <button onClick={handleSignIn}>Sign In With Google</button>
        
      }
      {user.isSignedIn && <div>
        <h1>Welcome, {user.name}</h1>
        <p>Email: {user.email}</p>
        <img src={user.photoURL} alt={user.name} />
      </div>}
    </div>
  );
}

export default App;

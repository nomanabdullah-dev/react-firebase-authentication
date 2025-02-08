import './App.css';
import React, { useState } from'react';
import { initializeApp } from 'firebase/app';
import firebaseConfig from './firebase.config';
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut, createUserWithEmailAndPassword } from "firebase/auth";

initializeApp(firebaseConfig);

function App() {
  const [user, setUser] = useState({
    name: '',
    email: '',
    password: '',
    photoURL: '',
    error: '',
    success: false,
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

  const handleBlur = (e) => {
    let isFieldValid = true;

    if(e.target.name === 'email') {
      isFieldValid = /\S+@\S+\.\S+/.test(e.target.value);
    }
    if(e.target.name === 'password') {
      const isPasswordValid = e.target.value.length > 6;
      const passwordHasNumber = /\d{1}/.test(e.target.value);
      isFieldValid = isPasswordValid && passwordHasNumber;
    }
    if(isFieldValid){
      setUser({...user, [e.target.name]: e.target.value });
    }

  }

  const handleSubmit = (e) => {
    if(user.email && user.password) {
      const auth = getAuth();
      createUserWithEmailAndPassword(auth, user.email, user.password)
      .then(res =>{
        const newUserInfo = {...user};
        newUserInfo.error = '';
        newUserInfo.success = true;
        setUser(newUserInfo)
      })
      .catch(error => {
        const newUserInfo = {...user};
        newUserInfo.error = error.message;
        newUserInfo.success = false;
        setUser(newUserInfo);
      });
    }
    e.preventDefault();
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

      <h1>Our Own Authentication</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" name='name' onBlur={handleBlur} placeholder="Name" required /> <br />
        <input type="email" name='email' onBlur={handleBlur} placeholder="Email" required /> <br />
        <input type="password" name="password" onBlur={handleBlur} placeholder="Password" required /> <br />
        <button type="submit" value="submit">Submit</button>
      </form>
      {user.error && <p style={{ color: 'red' }}>{user.error}</p>}
      {user.success && <p style={{ color: 'green' }}>User registered successfully</p>}
    </div>
  );
}

export default App;

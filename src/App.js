import React, { useState } from 'react';
import './App.css';
import firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './firebase.Config'

firebase.initializeApp(firebaseConfig)

function App() {
  const [user,setUser]=useState({
    isSignedIn:false,
    name:'',
    email:'',
    photo:''
  })
  console.log(user);
  const {name,email,photo}=user;
  const provider = new firebase.auth.GoogleAuthProvider();
  const handleSignIn= ()=>{
    firebase.auth().signInWithPopup(provider)
    .then(res=>{
      console.log(res);
      const {displayName,email,photoURL}=res.user;
      const signedinUser={
        isSignedIn:true,
        name:displayName,
        email:email,
        photo:photoURL
      }
      setUser(signedinUser)
      //console.log(displayName,email,photoURL);
    })
    .catch(err=>{
      console.log(err);
      console.log(err.message);
    })
  }
  const handleSignOut = ()=>{
    firebase.auth().signOut()
    .then(res=>{
     const signOutUser={
      isSignedIn:false,
      name:'',
      email:'',
      photo:''
     }
     setUser(signOutUser)
    })
    .catch(err=>{

    })
  }
  
const handleSubmit =()=>{
  console.log("object");
}
  return (
    <div className="App">
      <h1>Hello from App.js </h1>
     {
        user.isSignedIn ? <button onClick={handleSignOut}>Sign out</button> : <button onClick={handleSignIn}>Sign in</button>
     }
      {
        user.isSignedIn && 
        <div>
            <p> {name} </p>
            <p>{email} </p>
            <img src={photo} alt=""/>
        </div>
      }

     
        <h1>Our own Authentication</h1>
        <form action="" onSubmit={handleSubmit}>
        <input type="text" name="" id="" placeholder="your email" required/>
        <br/>
        <input type="password" name="" id="" placeholder="password" required/>
        <br/>
        <input type="submit" value="Submit"/>
        </form>
    </div>
  );
}

export default App;

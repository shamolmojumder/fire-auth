import React, { useState } from 'react';
import './App.css';
import firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './firebase.Config';

firebase.initializeApp(firebaseConfig);

function App() {
  const [user,setUser]=useState({
    isSignedIn:false,
    newuser:false,
    name:'',
    email:'',
    password:'',
    photo:''
  });
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
      };
      setUser(signedinUser);
      //console.log(displayName,email,photoURL);
    })
    .catch(err=>{
      console.log(err);
      console.log(err.message);
    });
  };
  const handleSignOut = ()=>{
    firebase.auth().signOut()
    .then(res=>{
     const signOutUser={
      isSignedIn:false,
      name:'',
      email:'',
      photo:'',
      error:'',
      success:false
     };
     setUser(signOutUser);
    })
    .catch(err=>{

    });
  }

const handleBlur = (e)=>{
  //console.log(e.target.name,e.target.value);
  let isFieldValid= true;
  //debugger;
  if (e.target.name === 'email') {
    isFieldValid =  /\S+@\S+\.\S+/.test(e.target.value);
  }
  if (e.target.name === 'password') {
    const isPasswordValid = e.target.value.length>6;
    const passwordHasNumber=/\d{1}/.test(e.target.value);
    isFieldValid = isPasswordValid && passwordHasNumber;
  }
  if (isFieldValid) {
    const newuserInfo={...user};
    newuserInfo[e.target.name]=e.target.value;
    setUser(newuserInfo);
  }
}

const handleSubmit =(e)=>{
  console.log(user.email,user.password);
  if (user.email && user.password) {
    //console.log("submitting");
    firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
    .then(res=>{
      const newuserInfo={...user};
      newuserInfo.error='';
      newuserInfo.success=true;
      setUser(newuserInfo);
      console.log(res);
    })
    .then((userCredential) => {
    // Signed in 
    //var user = userCredential.user;
    // ...
  })
  .catch((error) => {
    const newuserInfo={...user};
    newuserInfo.error=error.message;
    newuserInfo.success=false;
    setUser(newuserInfo)
    // ..
    //console.log(errorCode,errorMessage);
  });
  }
  e.preventDefault();
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
            <img src={photo} alt="missing"/>
        </div>
      }

     
        <h1>Our own Authentication</h1>
        <input type="checkbox" name="newUser" id=""/>
        <label htmlFor="newUser">New User Sign Up</label>
        <form action="" onSubmit={handleSubmit}>
        {user.newuser&& <input type="text" name="name" id="" onBlur={handleBlur} placeholder="name"/>} 
         <br/>
          <input type="text" name="email" id="" onBlur={handleBlur} placeholder="your email" required/>
          <br/>
          <input type="password" name="password" id="" onBlur={handleBlur} placeholder="password" required/>
          <br/>
          <input type="submit" value="Submit"/>
        </form>
        <p style={{color:'red'}}> {user.error} </p>
        {
          user.success && <p style={{color:'green'}}> User create successfully </p>
        }
    </div>
  );
}

export default App;

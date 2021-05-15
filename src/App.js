import React, { useState } from 'react';
import './App.css';
import firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './firebase.Config';

firebase.initializeApp(firebaseConfig);

function App() {
  const [newUser,setNewUser]=useState(false)
  const [user,setUser]=useState({
    isSignedIn:false,
    name:'',
    email:'',
    password:'',
    photo:''
  });
  console.log(user);
  const {name,email,photo}=user;
  const googleProvider = new firebase.auth.GoogleAuthProvider();
  const fbProvider = new firebase.auth.FacebookAuthProvider();
  const handleSignIn= ()=>{
    firebase.auth().signInWithPopup(googleProvider)
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

  const handleFbSignIn=()=>{
    firebase
  .auth()
  .signInWithPopup(fbProvider)
  .then((result) => {
    /** @type {firebase.auth.OAuthCredential} */
    var credential = result.credential;

    // The signed-in user info.
    var user = result.user;

    // This gives you a Facebook Access Token. You can use it to access the Facebook API.
    var accessToken = credential.accessToken;
    console.log(user);
    // ...
  })
  .catch((error) => {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // The email of the user's account used.
    var email = error.email;
    // The firebase.auth.AuthCredential type that was used.
    var credential = error.credential;

    // ...
  });
  }
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
    const newUserInfo={...user};
    newUserInfo[e.target.name]=e.target.value;
    setUser(newUserInfo);
  }
}

const handleSubmit =(e)=>{
  console.log(user.email,user.password);
  if (newUser && user.email && user.password) {
    //console.log("submitting");
    firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
    .then(res=>{
      const newUserInfo={...user};
      newUserInfo.error='';
      newUserInfo.success=true;
      setUser(newUserInfo);
      updateUserName(user.name)
      //console.log(res);
    })
    .then((userCredential) => {
    // Signed in 
    //var user = userCredential.user;
    // ...
  })
  .catch((error) => {
    const newUserInfo={...user};
    newUserInfo.error=error.message;
    newUserInfo.success=false;
    setUser(newUserInfo)
    // ..
    //console.log(errorCode,errorMessage);
  });
  }
  if (!newUser && user.email && user.password) {
    firebase.auth().signInWithEmailAndPassword(user.email, user.password)
    .then(res=>{
      const newUserInfo={...user};
      newUserInfo.error='';
      newUserInfo.success=true;
      setUser(newUserInfo);
      console.log('sign in',res.user);
    })

  .then((userCredential) => {
    // Signed in
    //var user = userCredential.user;
    // ...
  })
  .catch((error) => {
    const newUserInfo={...user};
    newUserInfo.error=error.message;
    newUserInfo.success=false;
    setUser(newUserInfo)
  });
  }
  e.preventDefault();
}
  const updateUserName=name=>{
    const user = firebase.auth().currentUser;

    user.updateProfile({
      displayName:name
    }).then(function() {
     console.log("user name updated");
    }).catch(function(error) {
     console.log(error);
    });
    
    
  }
  return (
    <div className="App">
      <h1>Hello from App.js </h1>
     {
        user.isSignedIn ? <button onClick={handleSignOut}>Sign out</button> : <button onClick={handleSignIn}>Sign in</button>
     }
     <br />
     <button onClick={handleFbSignIn}>Login using Facebook</button>
      {
        user.isSignedIn && 
        <div>
            <p> {name} </p>
            <p>{email} </p>
            <img src={photo} alt="missing"/>
        </div>
      }
        <h1>Our own Authentication</h1>
        <input type="checkbox" onChange={()=>setNewUser(!newUser)} name="newUser" id=""/>
        <label htmlFor="newUser">New User Sign Up</label>
        <form action="" onSubmit={handleSubmit}>
        {newUser&& <input type="text" name="name" id="" onBlur={handleBlur} placeholder="name"/>} 
         <br/>
          <input type="text" name="email" id="" onBlur={handleBlur} placeholder="your email" required/>
          <br/>
          <input type="password" name="password" id="" onBlur={handleBlur} placeholder={newUser? "used number and alpabet":"use valid password"} required/>
          <br/>
          <input type="submit" value={newUser ? "sign up":"sign in"}/>
        </form>
        <p style={{color:'red'}}> {user.error} </p>
        {
          user.success && <p style={{color:'green'}}> User {newUser ?"create" : "logged In"} successfully </p>
        }
    </div>
  );
}

export default App;
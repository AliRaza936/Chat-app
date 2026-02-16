import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from '@clerk/clerk-react'

function App() {


  return (
    <>
     <h1>Hello World</h1>
      <SignedOut>
        <SignInButton />
        <br />
        <br />
        <SignUpButton />
      </SignedOut>
      {/* Show the user button when the user is signed in */}
      <SignedIn>
        <UserButton />
      </SignedIn>
    </>
  )
}

export default App

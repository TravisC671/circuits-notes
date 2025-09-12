import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import ToolMenu from '../components/tool_menu'
import Canvas from '../components/canvas'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Canvas />
      <ToolMenu />
    </>
  )
}

export default App

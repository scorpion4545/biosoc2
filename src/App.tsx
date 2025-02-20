import './App.css'
import { BentoGridDemo } from './components/Bento-grid'
import { LayoutGridDemo } from './components/LayoutGridDemo'
import { LampContainer } from './components/ui/lamp'


function App() {

  return <div>
   
    < LampContainer children={undefined} />
    < BentoGridDemo />
    < LayoutGridDemo />
  </div>
}

export default App

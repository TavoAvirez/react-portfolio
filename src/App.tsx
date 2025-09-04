import { Route, Routes } from 'react-router-dom'
import './styles/App.css'
import './styles/Theme.css'
import Navbar from './components/Navbar'
import CardDemo from './pages/CardDemo'
import CounterDemo from './pages/CounterDemo'
import TodoList from './pages/ToDoList'
import ClockDemo from './pages/ClockDemo'
import PokeAPI from './pages/PokeAPI'
import FormDemo from './pages/FormDemo'
import DynamicFormDemo from './pages/DynamicForm'
import RMList from './pages/RickMortyList'
import RMDetail from './components/RickMorty/RickMortyDetail'



function App() {
  return (
    <>
      <Navbar />
      <div style={{ padding: 16 }}>
        <Routes>
          <Route path="/" element={<CardDemo />} />
          <Route path="/counter" element={<CounterDemo />} />
          <Route path="/todo" element={<TodoList />} />
          <Route path="/clock" element={<ClockDemo />} />
          <Route path="/pokeapi" element={<PokeAPI />} />
          <Route path="/form" element={<FormDemo />} />
          <Route path="/dynamic-form" element={<DynamicFormDemo />} />
          <Route path="/rick-morty" element={<RMList />} />
          <Route path="/rick-morty/:id" element={<RMDetail />} />
        </Routes>
      </div>
    </>
  )
}

export default App

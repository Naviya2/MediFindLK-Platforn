import { useState } from 'react'
import Search from './pages/Search'
import Report from './pages/Report'
import './App.css'

function App() {
  const [tab, setTab] = useState('search')

  return (
    <div className="app">
      <header className="app__header">
        <span className="app__logo">MediFind LK</span>
        <nav className="app__nav">
          <button
            type="button"
            className={tab === 'search' ? 'is-active' : ''}
            onClick={() => setTab('search')}
          >
            Search
          </button>
          <button
            type="button"
            className={tab === 'report' ? 'is-active' : ''}
            onClick={() => setTab('report')}
          >
            Report stock
          </button>
        </nav>
      </header>

      <main className="app__main">
        {tab === 'search' ? <Search /> : <Report />}
      </main>
    </div>
  )
}

export default App

import { HashRouter, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import { TasksProvider } from './context/TasksContext'
import StatsPage from './pages/StatsPage'
import TasksPage from './pages/TasksPage'
import TodayPage from './pages/TodayPage'

// HashRouter keeps deep links working on GitHub Pages without server rewrites.
export default function App() {
  return (
    <TasksProvider><HashRouter><Routes>
      <Route element={<Layout />}><Route index element={<TodayPage />} /><Route path="tasks" element={<TasksPage />} /><Route path="stats" element={<StatsPage />} /></Route>
    </Routes></HashRouter></TasksProvider>
  )
}

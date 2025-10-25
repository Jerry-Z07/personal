import './App.css'
import BackgroundImage from './components/BackgroundImage'
import BackgroundBlur from './components/BackgroundBlur'
import Header from './components/Header'

function App() {
  return (
    <>
      <BackgroundImage />
      <BackgroundBlur />
      <Header />
      <div className="content-wrapper">
        {/* 留白区域 */}
      </div>
    </>
  )
}

export default App

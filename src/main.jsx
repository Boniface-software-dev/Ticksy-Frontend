import ReactDOM from "react-dom/client"
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './components/AuthProvider'
import { Provider } from "react-redux"
import store from "./app/store.js"

ReactDOM.createRoot(document.getElementById('root')).render(
    <Provider store={store}>
      <AuthProvider>
      <App />
      </AuthProvider>
    </Provider>
)
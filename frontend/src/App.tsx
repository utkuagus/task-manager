import { useState } from "react";
import "./App.css";
import Login from "./components/Login.tsx";
import Dashboard from "./components/Dashboard.tsx";

function App() {
  const [token, setToken] = useState<string | null>(null);

  if (token) {
    return <Dashboard token={token} />;
  }

  return <Login setToken={setToken} />;
}

export default App;

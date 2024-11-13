import { Link, Route, BrowserRouter as Router, Routes } from "react-router-dom";
import TruckScene from "./routes/TruckScene";
import Game from "./routes/Game/Game";
import HeadTrackedScene from "./routes/HeadTrackedScene";

// Adicionar 2 rotas para a aplicação: uma para a página inicial e outra para a página de caminhão
function App() {

  return (
    <Router>
      <nav>
        <Link to="/truck">Truck</Link> | 
        <Link to="/game">Game</Link> | 
        <Link to="/hand">Hand</Link> | 
      </nav>
      <Routes>
        <Route path="/game" element={<Game />} />
        <Route path="/truck" element={<TruckScene />} />
        <Route path="/hand" element={<HeadTrackedScene/>} />
      </Routes>
    </Router>
  );

}
export default App;

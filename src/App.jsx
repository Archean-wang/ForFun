import { Link } from "react-router-dom";

export default function App() {
  return (
    <div>
      <Link to={'/snake'}>Snake</Link>
      <Link to={'/color'}>Color</Link>
    </div>
  );
}
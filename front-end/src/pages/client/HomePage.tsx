import { Link } from "react-router-dom";

function HomePage() {
  return (
    <div className="home">
      <Link className="a-women" to="/women">
        Women
      </Link>
      <Link className="a-men" to="/men">
        Men
      </Link>
    </div>
  );
}

export default HomePage;

import { Grid } from "@material-ui/core";
import { Link, useLocation } from "react-router-dom";

const Header = () => {
  const location = useLocation();
 
  return (
    <Grid className="wrapper">
      <Link
        to="/"
        style={{ color: location.pathname === "/" ? "#008000" : "#646CFF" }}
      >
        Abuse Form
      </Link>
      <Link
        to="/reports"
        style={{
          color: location.pathname === "/reports" ? "#008000" : "#646CFF",
        }}
      >
        List of Reports
      </Link>
    </Grid>
  );
};

export default Header;

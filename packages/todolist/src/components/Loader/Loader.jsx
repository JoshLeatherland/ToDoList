import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import PropTypes from "prop-types";

function Loader({ open = false }) {
  return (
    <div>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.modal + 2 }}
        open={Boolean(open)}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  );
}

export default Loader;

Loader.propTypes = {
  open: PropTypes.bool,
};

import { Chip } from "@mui/material";
import { useState, useContext } from "react";
import styled from "styled-components";
import { PropTypes } from "prop-types";
import { DispatchContext } from "@/context";
const Tag = styled(Chip)`
  background-color: ${(props) => !props.checked && "#9e9e9e"};
  color: white;
`;
function Toggle({ id, text, toggleOn = false }) {
  const [checked, setChecked] = useState(toggleOn);
  const dispatch = useContext(DispatchContext);
  const onClick = () => {
    try {
      let type;
      if (!checked) type = "addTag";
      else type = "removeTag";
      dispatch({
        type,
        nextState: { id, text },
      });
      setChecked((prev) => !prev);
    } catch (e) {
      alert(e.message);
    }
  };
  return (
    <button
      onClick={onClick}
      style={{
        background: "none",
        border: "none",
      }}
    >
      <Tag label={text} color="primary" checked={checked} />
    </button>
  );
}
Toggle.propTypes = {
  id: PropTypes.string,
  text: PropTypes.string,
  toggleOn: PropTypes.bool,
};
Toggle;
export default Toggle;

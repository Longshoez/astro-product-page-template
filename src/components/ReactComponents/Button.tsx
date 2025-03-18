import React from "react";
import useResponsiveness from "../../utils/useResponsiveness";
import { useMediaQuery } from "react-responsive";

function Button({
  id,
  label,
  icon,
  padding = 10,
  styles,
  onClick = () => alert("click"),
  disabled = false,
}: any) {
  const { handleResponsiveness } = useResponsiveness();
  const mobile = useMediaQuery({ orientation: "portrait" });
  return (
    <button
      id={id}
      onClick={onClick}
      disabled={disabled}
      style={{
        display: "flex",
        width: "fit-content",
        height: "fit-content",
        opacity: disabled ? "0.65" : "1",
        padding: padding,
        border: "none",
        fontSize: handleResponsiveness("35px", "30px", "30px", "20px", "20px"),
        boxShadow: "2px 4px 7.7px rgba(0, 0, 0, 0.13)",
        borderRadius: handleResponsiveness(
          "20px",
          "20px",
          "20px",
          "20px",
          "10px"
        ),
        fontFamily: "Inter",
        fontWeight: "200",
        cursor: "pointer",
        alignItems: "center",
        ...styles,
      }}
    >
      {label}
      {icon}
    </button>
  );
}

export default Button;

import { useMediaQuery } from "react-responsive";

const useResponsiveness = () => {
  const mobile = useMediaQuery({ orientation: "portrait" });
  const large = useMediaQuery({
    query: "(min-width: 2400px)",
  });
  const desktop = useMediaQuery({
    query: "(min-width: 1920px) and (max-width: 2399px)",
  });
  const medium = useMediaQuery({
    query: "(min-width: 1250px) and (max-width: 1919px)",
  });
  const small = useMediaQuery({
    query: "(max-width: 1370px)",
  });

  //@ts-ignore
  const handleResponsiveness = (s, m, l, xl, mob) => {
    if (small) return s;
    if (medium) return m;
    if (desktop) return l;
    if (large) return xl;
    if (mobile) return mob;
  };

  return { handleResponsiveness, mobile, large, desktop, medium, small };
};

export default useResponsiveness;

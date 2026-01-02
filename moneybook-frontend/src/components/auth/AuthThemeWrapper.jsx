import { useEffect, useRef } from "react";
import { useTheme } from "../../context/ThemeContext";

export default function AuthThemeWrapper({ children }) {
  const { theme, setLight, setDark } = useTheme();
  const prevTheme = useRef(theme);

  useEffect(() => {
    prevTheme.current = theme;

    // force light on auth pages
    setLight();

    return () => {
      // restore previous theme
      if (prevTheme.current === "dark") {
        setDark();
      }
    };
  }, []);

  return children;
}

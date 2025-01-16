import { createContext, useContext, useState } from "react";

type ThemeContextType = {
    theme: "light" | "dark";
    toggleTheme: () => void;
};

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = () => {
    const [theme, setTheme] = useState<"light" | "dark">("light");

    const toggleTheme = () => {
        setTheme((prev) => (prev === "light" ? "dark" : "light"));
    };

    return { theme, toggleTheme }

    // <ThemeContext.Provider value={{ theme, toggleTheme }}>
    //     <div className={theme === "light" ? "theme-light" : "theme-dark"}>{children}</div>
    // </ThemeContext.Provider>

};

export const useTheme = (): ThemeContextType => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    return context;
};

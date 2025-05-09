import React, {
    createContext,
    useContext,
    useEffect,
    useState,
    ReactNode,
} from "react";

type DarkModeContextType = [boolean, (value: boolean) => void];

const DarkModeContext = createContext<DarkModeContextType | undefined>(
    undefined
);

export const useDarkMode = (): DarkModeContextType => {
    const context = useContext(DarkModeContext);
    if (!context) {
        throw new Error("useDarkMode must be used within DarkModeProvider");
    }
    return context;
};

export const DarkModeProvider = ({ children }: { children: ReactNode }) => {
    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
        const root = document.documentElement;
        const update = () => {
            const isDark = root.classList.contains("dark");
            setIsDarkMode(isDark);
        };

        const observer = new MutationObserver(update);
        observer.observe(root, {
            attributes: true,
            attributeFilter: ["class"],
        });
        update();

        return () => observer.disconnect();
    }, []);

    const handleSetIsDarkMode = (value: boolean) => {
        const root = document.documentElement;
        if (value) {
            root.classList.add("dark");
        } else {
            root.classList.remove("dark");
        }
        setIsDarkMode(value);
    };

    return (
        <DarkModeContext.Provider value={[isDarkMode, handleSetIsDarkMode]}>
            {children}
        </DarkModeContext.Provider>
    );
};

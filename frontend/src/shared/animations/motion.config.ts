export const spring = {
    type: "spring",
    stiffness: 300,
    damping: 24,
};

export const softSpring = {
    type: "spring",
    stiffness: 200,
    damping: 20,
};

export const fadeSlideUp = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 10 },
    transition: { duration: 0.4, ease: "easeOut" },
};

export const fadeIn = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.3, ease: "easeInOut" },
};

export const scaleFade = {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
    transition: { duration: 0.25, ease: "easeOut" },
};

export const pop = {
    whileHover: { scale: 1.05 },
    whileTap: { scale: 0.95 },
};

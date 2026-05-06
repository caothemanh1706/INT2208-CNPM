import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export type Colors = {
  bg: string;
  card: string;
  cardBorder: string;
  cardShadow: string;
  sidebar: string;
  sidebarActive: string;
  sidebarBorder: string;
  sidebarText: string;
  text: string;
  textSub: string;
  textMuted: string;
  topbar: string;
  topbarBorder: string;
  topbarShadow: string;
  input: string;
  inputBorder: string;
  rowHover: string;
  tag: string;
  tagText: string;
  divider: string;
  green: string;
  greenBg: string;
  greenText: string;
  red: string;
  redBg: string;
  blue: string;
  blueBg: string;
  orange: string;
  yellowBg: string;
  yellowBorder: string;
  yellowText: string;
  yellowSubText: string;
  pillBg: string;
  sectionBg: string;
};

const light: Colors = {
  bg: '#F8F9FB',
  card: '#FFFFFF',
  cardBorder: '#F0F2F5',
  cardShadow: '0 2px 12px rgba(0,0,0,0.06)',
  sidebar: '#1A2332',
  sidebarActive: '#00C896',
  sidebarBorder: 'rgba(255,255,255,0.08)',
  sidebarText: 'rgba(255,255,255,0.55)',
  text: '#1A2332',
  textSub: '#5A6A7A',
  textMuted: '#8A9AB0',
  topbar: '#FFFFFF',
  topbarBorder: '#E8EBF0',
  topbarShadow: '0 1px 4px rgba(0,0,0,0.04)',
  input: '#F8F9FB',
  inputBorder: '#E8EBF0',
  rowHover: '#F8F9FB',
  tag: '#F0F2F5',
  tagText: '#5A6A7A',
  divider: '#F0F2F5',
  green: '#00C896',
  greenBg: '#E8FBF5',
  greenText: '#00A87A',
  red: '#FF5C5C',
  redBg: '#FFE8E8',
  blue: '#4B9EFF',
  blueBg: '#E8F1FF',
  orange: '#FF9F43',
  yellowBg: '#FFFBEB',
  yellowBorder: '#FDE68A',
  yellowText: '#78350F',
  yellowSubText: '#92400E',
  pillBg: '#F0F2F5',
  sectionBg: '#F8F9FB',
};

const dark: Colors = {
  bg: '#0F1923',
  card: '#1A2332',
  cardBorder: '#243040',
  cardShadow: '0 2px 16px rgba(0,0,0,0.3)',
  sidebar: '#0C1520',
  sidebarActive: '#00C896',
  sidebarBorder: 'rgba(255,255,255,0.06)',
  sidebarText: 'rgba(255,255,255,0.45)',
  text: '#E2E8F0',
  textSub: '#94A3B8',
  textMuted: '#64748B',
  topbar: '#1A2332',
  topbarBorder: '#243040',
  topbarShadow: '0 1px 4px rgba(0,0,0,0.3)',
  input: '#1F2E3D',
  inputBorder: '#2D3F52',
  rowHover: '#1F2E3D',
  tag: '#243040',
  tagText: '#8A9AB0',
  divider: '#243040',
  green: '#00C896',
  greenBg: 'rgba(0,200,150,0.12)',
  greenText: '#00C896',
  red: '#FF5C5C',
  redBg: 'rgba(255,92,92,0.12)',
  blue: '#4B9EFF',
  blueBg: 'rgba(75,158,255,0.12)',
  orange: '#FF9F43',
  yellowBg: 'rgba(245,158,11,0.1)',
  yellowBorder: 'rgba(245,158,11,0.2)',
  yellowText: '#D4A856',
  yellowSubText: '#C49020',
  pillBg: '#243040',
  sectionBg: '#1A2332',
};

type ThemeContextType = {
  isDark: boolean;
  toggle: () => void;
  c: Colors;
};

const ThemeContext = createContext<ThemeContextType>({
  isDark: false,
  toggle: () => {},
  c: light,
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('finwise_theme');
    return saved ? saved === 'dark' : false;
  });

  const toggle = () => {
    setIsDark(d => {
      const next = !d;
      localStorage.setItem('finwise_theme', next ? 'dark' : 'light');
      return next;
    });
  };

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  return (
    <ThemeContext.Provider value={{ isDark, toggle, c: isDark ? dark : light }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}

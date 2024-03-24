import { Context, ReactNode, createContext, useState } from 'react';

interface Props {
	children: ReactNode;
}

export const DarkModeContext: Context<object> = createContext({});

export default function DarkModeProvider (props: Props) {
	const [darkMode, setDarkMode] = useState(false);
	
	function toggleDarkMode (): void {
		setDarkMode(!darkMode);
		document.documentElement.classList.toggle('dark');
	}

	return (
		<>
			<DarkModeContext.Provider value={{darkMode, toggleDarkMode}}>
				{props.children}
			</DarkModeContext.Provider>
		</>
	);
}

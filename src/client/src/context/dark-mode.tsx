import { Context, ReactNode, createContext, useEffect, useState } from 'react';

interface Props {
	children: ReactNode;
}

export const DarkModeContext: Context<object> = createContext({});

export default function DarkModeProvider (props: Props) {
	const darkModeValue = localStorage.getItem('dark-mode') === 'true';

	const [darkMode, setDarkMode] = useState(darkModeValue || false);
	
	function toggleDarkMode (): void {
		document.documentElement.classList.toggle('dark');
		localStorage.setItem('dark-mode', String(!darkMode));
		setDarkMode(!darkMode);
	}

	useEffect(() => {
		if (darkMode) {
			document.documentElement.classList.add('dark');
		}
	}, [])

	return (
		<>
			<DarkModeContext.Provider value={{darkMode, toggleDarkMode}}>
				{props.children}
			</DarkModeContext.Provider>
		</>
	);
}

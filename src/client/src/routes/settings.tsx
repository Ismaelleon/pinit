import { useContext } from 'react';
import Navbar from '../components/navbar';
import Switch from '../components/switch';
import { DarkModeContext } from '../context/dark-mode';


export default function Settings () {
	const { darkMode, toggleDarkMode } = useContext(DarkModeContext);

	return (
		<>
			<Navbar />	
            <main className="flex justify-center mt-[64px] p-4 dark:text-white">
                <section className="flex flex-col max-w-3xl w-full">
					<h1 className="text-2xl font-bold sm:text-xl">
						Settings
					</h1>
					<ul className="py-2">
						<li className="flex flex-row justify-between items-center font-bold text-base sm:text-sm py-3">
							Dark Mode
							<label>
								<Switch state={darkMode} toggleState={toggleDarkMode} />
							</label>
						</li>
					</ul>
				</section>
			</main>
		</>
	);
}

import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { BiChevronDown, BiHome, BiPlus, BiSolidUserCircle, BiSolidCog, BiExit } from 'react-icons/bi';

export default function Navbar() {
    const location = useLocation();
    const navigate = useNavigate();
	const [accountDropDown, setAccountDropDown] = useState(false);

    return (
        <nav className="flex w-full justify-center py-2 px-4 fixed left-0 top-0 bg-white items-center z-50 dark:bg-neutral-900 dark:text-white shadow">
            <div className="flex justify-between items-center max-w-4xl w-full">
                <Link to="/home" className="text-xl font-bold mr-6">
                    Pinit
                </Link>
                <ul className="flex items-center">
                    <li
                        className={`p-2 px-3 mr-3 ${
                            location.pathname === '/home'
                                ? 'font-semibold'
                                : 'font-normal'
                        }`}
                    >
                        <Link
                            to="/home"
                            className="text-sm flex flex-row items-center"
                        >
                            <BiHome className="sm:mr-2 text-xl sm:text-lg" />
                            <p className="hidden sm:flex">Home</p>
                        </Link>
                    </li>
                    <li
                        className={`p-2 px-3 mr-3 ${
                            location.pathname === '/create'
                                ? 'font-semibold'
                                : 'font-normal'
                        }`}
                    >
                        <Link
                            to="/create"
                            className="text-sm flex flex-row items-center"
                        >
                            <BiPlus className="sm:mr-2 text-xl sm:text-lg" />
                            <p className="hidden sm:flex">Create</p>
                        </Link>
                    </li>
					<li>
						<Link
							to="/profile"
                            className="text-sm flex flex-row items-center"
						>
							<BiSolidUserCircle size={32} />
						</Link>
					</li>
                    <li className="pl-2 relative">
						<span 
							className="flex flex-row items-center cursor-pointer"
							onClick={() => setAccountDropDown(!accountDropDown)}
						>
							<BiChevronDown size={16} />
						</span>
						<ul className={`fixed w-full top-[40px] mt-3 right-0 bg-white p-2 shadow sm:absolute sm:w-auto sm:overflow-hidden sm:rounded-sm dark:bg-neutral-900 ${!accountDropDown && 'hidden'}`}>
							<li>
								<Link to="/settings" className="flex flex-row items-center gap-2 py-2 p-2 rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-900">
									<BiSolidCog className="text-xl sm:text-lg" />
									Settings	
								</Link>
							</li>
							<li>
								<Link 
									to="#" 
									className="flex flex-row items-center gap-2 py-2 p-2 rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-900"
                                    onClick={() => {
                                        document.cookie =
                                            'token=;Expires=Thu, 01 Jan 1970 00:00:00 UTC;';
                                        navigate('/');
                                    }}
								>
									<BiExit className="text-red-600 text-xl sm:text-lg" />
									Log Out	
								</Link>
							</li>
						</ul>
                    </li>
                </ul>
            </div>
        </nav>
    );
}

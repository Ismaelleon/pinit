import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { BiChevronDown, BiHome, BiPlus, BiSolidUserCircle, BiSolidCog, BiExit } from 'react-icons/bi';

export default function Navbar() {
    const location = useLocation();
    const navigate = useNavigate();
	const [accountDropDown, setAccountDropDown] = useState(false);

    return (
        <nav className="flex w-full justify-center py-2 px-4 fixed left-0 top-0 bg-white items-center z-50">
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
                    <li className="flex flex-col">
						<span 
							className="flex flex-row items-center relative cursor-pointer"
							onClick={() => setAccountDropDown(!accountDropDown)}
						>
							<BiSolidUserCircle size={32} />
							<BiChevronDown size={16} />
						</span>
						<ul className={`fixed top-[40px] bg-white p-2 shadow-lg -translate-x-full ml-[48px] ${!accountDropDown && 'hidden'}`}>
							<li className="pr-2">
								<Link to="/profile" className="flex flex-row items-center gap-2 hover:underline">
									<BiSolidUserCircle size={16} />
									Profile
								</Link>
							</li>
							<li className="pr-2">
								<Link to="/settings" className="flex flex-row items-center gap-2 hover:underline">
									<BiSolidCog size={16} />
									Settings	
								</Link>
							</li>
							<li className="pr-2">
								<Link 
									to="#" 
									className="flex flex-row items-center gap-2 hover:underline"
                                    onClick={() => {
                                        document.cookie =
                                            'token=;Expires=Thu, 01 Jan 1970 00:00:00 UTC;';
                                        navigate('/');
                                    }}
								>
									<BiExit size={16} className="text-red-600" />
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

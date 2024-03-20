import { Link, useLocation } from 'react-router-dom';
import { BiHome, BiPlus, BiSolidUserCircle } from 'react-icons/bi';

export default function Navbar() {
    const location = useLocation();

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
                    <li>
                        <Link to="/profile">
                            <BiSolidUserCircle size={32} />
                        </Link>
                    </li>
                </ul>
            </div>
        </nav>
    );
}

import { Link, useLocation } from "react-router-dom";
import { BiHome, BiPlus, BiSolidUserCircle } from "react-icons/bi";
import { useEffect, useState } from "react";

export default function Navbar() {
	const location = useLocation();
	const [mobile, setMobile] = useState(true);

	useEffect(() => {
		window.innerWidth <= 639 ? setMobile(true) : setMobile(false);
	}, []);

	return (
		<nav className="flex w-full justify-center py-2 px-4 fixed left-0 top-0 bg-white items-center">
			<div className="flex justify-between items-center max-w-4xl w-full">
				<Link to="/home" className="text-xl font-bold mr-6">
					Pinit
				</Link>
				<ul className="flex items-center">
					<li
						className={`p-2 px-3 mr-3 ${
							location.pathname === "/home"
								? "font-semibold"
								: "font-normal"
						}`}
					>
						<Link to="/home" className="text-sm">
							{mobile ? <BiHome size={24} /> : "Home"}
						</Link>
					</li>
					<li
						className={`p-2 px-3 mr-3 ${
							location.pathname === "/create"
								? "font-semibold"
								: "font-normal"
						}`}
					>
						<Link to="/create" className="text-sm">
							{mobile ? <BiPlus size={24} /> : "Create"}
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

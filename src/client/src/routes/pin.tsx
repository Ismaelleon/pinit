import { useEffect, useState } from "react";
import Navbar from "../components/navbar";
import { Link, useLocation } from "react-router-dom";
import { BiSolidUserCircle } from "react-icons/bi";

export default function Pin() {
	const [pin, setPin] = useState({
		image: {
			url: "",
			public_id: "",
		},
		title: "",
		content: "",
		author: "",
	});
	const location = useLocation();

	function getPin() {
		fetch(`/api/pin/${location.pathname.split("/")[2]}`, {
			method: "POST",
		}).then(async (res) => {
			if (res.status === 200) {
				let pin = await res.json();

				setPin(pin);
			}
		});
	}

	useEffect(getPin, []);

	return (
		<>
			<Navbar />
			<main className="flex justify-center mt-[64px] p-4">
				<section className="flex flex-col max-w-3xl w-full sm:flex-row gap-3">
					<img src={pin.image.url} className="w-full rounded mb-3 sm:w-1/2" />
					<section className="sm:w-1/2">
						<h2 className="text-xl font-bold mb-2">{pin.title}</h2>
						<p className="text-base mb-3">{pin.content}</p>
                        <Link to={`/user/${pin.author}`}  className="text-base font-bold flex flex-row items-center gap-3 mb-2">
                            <BiSolidUserCircle size={24} /> {pin.author}
                        </Link>
					</section>
				</section>
			</main>
		</>
	);
}

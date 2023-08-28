import { useEffect, useState } from "react";
import Navbar from "../components/navbar";
import { useLocation } from "react-router-dom";

export default function Pin() {
	const [pin, setPin] = useState({
		image: {
			url: "",
			public_id: "",
		},
		title: "",
		content: "",
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
			<main className="p-4 mt-[64px]">
				<img src={pin.image.url} className="w-full rounded mb-3" />
				<h2 className="text-xl font-bold">{pin.title}</h2>
				<p className="text-base">{pin.content}</p>
			</main>
		</>
	);
}

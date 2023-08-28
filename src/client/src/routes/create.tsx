import { Ref, createRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/navbar";
import { BiPlus } from "react-icons/bi";

export default function Create() {
	const [title, setTitle] = useState(""),
		[content, setContent] = useState(""),
		[url, setUrl] = useState(""),
		[image, setImage] = useState(null),
		[board, setBoard] = useState("new-board"),
		[boards, setBoards] = useState([]),
		[newBoard, setNewBoard] = useState("");

	const select = createRef();

	const navigate = useNavigate();

	function getUser() {
		fetch("/api/user/", {
			method: "POST",
		}).then(async (res) => {
			if (res.status === 200) {
				let user = await res.json();

				setBoards(user.boards!);
			}
		});
	}

	useEffect(getUser, []);

	function createBoard(event: Event) {
		event.preventDefault();

		fetch("/api/boards/new", {
			method: "POST",
			body: JSON.stringify({
				name: newBoard,
			}),
			headers: {
				"Content-Type": "application/json",
			},
		}).then((res) => {
			if (res.status === 200) {
				getUser();
				setBoard(newBoard);
			}
		});
	}

	function submitForm(event: Event) {
		event.preventDefault();

		const body = new FormData();

		body.append("title", title);
		body.append("content", content);
		body.append("url", url);
		body.append("image", image);
		body.append("board", board);

		fetch("/api/pin/new", {
			method: "post",
			body,
		}).then(async (res) => {
			if (res.status === 200) {
				let { id } = await res.json();
				navigate(`/pin/${id}`);
			} else {
				navigate("/home");
			}
		});
	}

	return (
		<div>
			<Navbar />
			<main className="flex justify-center mt-[64px] p-4">
				<section className="flex flex-col max-w-3xl">
					<h1 className="text-2xl font-bold mb-3 sm:text-xl">
						New Pin
					</h1>
					<form className="flex flex-col sm:flex-row w-full gap-3">
						<section className="sm:w-1/2">
							<input
								type="file"
								className="hidden"
								id="image"
								accept="image/*"
								multiple={false}
								onInput={(e) =>
									setImage(e.currentTarget.files[0])
								}
							/>
							<label
								className="w-full p-3 flex justify-center items-center flex-col border border-dashed border-neutral-400 rounded mb-3 cursor-pointer h-full"
								htmlFor="image"
							>
								<BiPlus size={32} />
								<span className="text-base sm:text-sm">
									Insert Image
								</span>
							</label>
						</section>
						<section className="sm:w-1/2">
							<input
								type="text"
								placeholder="Add a Title"
								className="border-neutral-400 border text-base rounded w-full p-2 mb-3 sm:text-sm"
								onInput={(e) => setTitle(e.currentTarget.value)}
							/>
							<textarea
								placeholder="Tell everyone about your Pin."
								rows={4}
								className="border-neutral-400 border text-base rounded w-full p-2 mb-3 resize-none sm:text-sm"
								onInput={(e) =>
									setContent(e.currentTarget.value)
								}
							></textarea>
							<input
								type="text"
								placeholder="Add a URL"
								className="border-neutral-400 border text-base rounded w-full p-2 mb-3 sm:text-sm"
								onInput={(e) => setUrl(e.currentTarget.value)}
							/>
							<select
								className="border-neutral-400 border text-base rounded w-full p-2 mb-3 bg-white sm:text-sm"
								onChange={(e) =>
									setBoard(e.currentTarget.value)
								}
								ref={select}
							>
								<option value="new-board">
									Create new Board
								</option>
								{boards.map((board, index) => (
									<option value={board} key={index}>
										{board}
									</option>
								))}
							</select>
							<div
								className="flex flex-row items-stretch mb-3 gap-3 w-full"
								style={
									board === "new-board"
										? { display: "flex" }
										: { display: "none" }
								}
							>
								<input
									type="text"
									placeholder="Board name"
									className="border-neutral-400 border text-base rounded w-75 p-2 bg-white sm:text-sm"
									onInput={(e) =>
										setNewBoard(e.currentTarget.value)
									}
								/>
								<button
									className="bg-red-600 hover:bg-red-800 w-full text-base text-white font-semibold rounded sm:text-sm"
									onClick={createBoard}
								>
									Create
								</button>
							</div>
							<button
								className="w-full text-base p-2 bg-red-600 text-white rounded font-semibold hover:bg-red-800 sm:text-sm"
								onClick={submitForm}
							>
								Create new Pin
							</button>
						</section>
					</form>
				</section>
			</main>
		</div>
	);
}

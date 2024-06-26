import { LegacyRef, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/navbar';
import { BiPlus } from 'react-icons/bi';
import LoadingBar from 'react-top-loading-bar';

export default function Create() {
    const [title, setTitle] = useState({ value: '', error: false }),
        [content, setContent] = useState(''),
        [url, setUrl] = useState(''),
        [image, setImage] = useState<object>({ value: null, error: false }),
        [board, setBoard] = useState('new-board'),
        [boards, setBoards] = useState([]),
        [newBoard, setNewBoard] = useState({ value: '', error: false });

    const bar = useRef(null);

    const navigate = useNavigate();
    const newBoardInput: LegacyRef<HTMLInputElement> = useRef(null);

    function getUser() {
        fetch('/api/user/', {
            method: 'POST',
        }).then(async (res) => {
            if (res.status === 200) {
                const user = await res.json();

                setBoards(user.boards!);
            } else if (res.status === 401) {
                navigate('/');
            }
        });
    }

    useEffect(getUser, []);

    function createBoard(event: React.MouseEvent<HTMLButtonElement>) {
        event.preventDefault();

        fetch('/api/board/new', {
            method: 'POST',
            body: JSON.stringify({
                name: newBoard.value,
            }),
            headers: {
                'Content-Type': 'application/json',
            },
        }).then((res) => {
            if (res.status === 200) {
                getUser();
                setBoard(newBoard.value);
                setNewBoard({ value: '', error: false });

                // @ts-ignore
                newBoardInput.current.value = '';
            } else {
                setNewBoard({ value: newBoard.value, error: true });
            }
        });
    }

    function submitForm(event: React.MouseEvent<HTMLButtonElement>) {
        event.preventDefault();

        const body = new FormData();

        body.append('title', title.value);
        body.append('content', content);
        body.append('url', url);
		body.append('date', new Date().toLocaleDateString());
        body.append('image', image.value);
        body.append('boardName', board);

		bar.current.staticStart(70);

        fetch('/api/pin/new', {
            method: 'post',
            body,
        }).then(async (res) => {
			bar.current.complete();

            if (res.status === 200) {
                const { id } = await res.json();
				setTimeout(() => navigate(`/pin/${id}`), 1500)
				
            } else {
                if (title.value.length < 4) {
                    setTitle({ value: title.value, error: true });
                }

                if (image.value === null) {
                    setImage({ value: null, error: true });
                }
            }
        });
    }

    return (
        <div>
            <LoadingBar color="#dc2626" ref={bar} />
            <Navbar />
            <main className="flex justify-center mt-[64px] p-4 dark:text-white">
                <section className="flex flex-col max-w-3xl">
                    <h1 className="text-2xl font-bold mb-3 sm:text-xl">
                        New Pin
                    </h1>
                    <form className="flex flex-col sm:flex-row w-full gap-3">
                        <section className="sm:w-1/2 relative">
                            <input
                                type="file"
                                className="hidden"
                                id="image"
                                accept="image/*"
                                multiple={false}
                                onInput={(e) =>
                                    // @ts-ignore
                                    setImage({
                                        value: e.currentTarget.files[0],
                                        error: false,
                                    })
                                }
                            />
                            <img
                                className="w-full rounded"
                                src={
                                    image.value === null
                                        ? ''
                                        : URL.createObjectURL(image.value)
                                }
                            />
                            <header
                                className="flex flex-row justify-end p-2"
                                style={
                                    image.value === null
                                        ? { display: 'none' }
                                        : { display: 'flex' }
                                }
                            >
                                <button
                                    className="p-2 rounded-full bg-neutral-200"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setImage({ value: null, error: false });
                                    }}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="currentColor"
                                        className="w-6 h-6"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </button>
                            </header>
                            <label
                                className={`w-full p-3 flex justify-center items-center flex-col border border-dashed rounded mb-3 cursor-pointer h-full ${
                                    image.error
                                        ? 'border-red-400'
                                        : 'border-neutral-400'
                                }`}
                                htmlFor="image"
                                style={
                                    image.value === null
                                        ? { display: 'flex' }
                                        : { display: 'none' }
                                }
                            >
                                <BiPlus size={32} />
                                <span className="text-base sm:text-sm">
                                    Insert Image
                                </span>
                            </label>
                            <span
                                className={`text-sm mt-1 block mr-auto text-red-400 ${
                                    image.error ? 'block' : 'hidden'
                                }`}
                            >
                                We need an image to upload
                            </span>
                        </section>
                        <section className="sm:w-1/2">
                            <input
                                type="text"
                                placeholder="Add a Title"
                                className={`border text-base rounded w-full p-2 sm:text-sm bg-transparent dark:text-white ${
                                    title.error
                                        ? 'border-red-400'
                                        : 'border-neutral-400'
                                }`}
                                onInput={(e) =>
                                    setTitle({
                                        value: e.currentTarget.value,
                                        error: false,
                                    })
                                }
                            />
                            <span
                                className={`text-sm mt-1 block mr-auto text-red-400 ${
                                    title.error ? 'block' : 'hidden'
                                }`}
                            >
                                Pin title is too short (minimum 4 characters)
                            </span>
                            <textarea
                                placeholder="Tell everyone about your Pin."
                                rows={4}
                                className="border-neutral-400 border text-base rounded w-full p-2 mt-3 mb-3 resize-none sm:text-sm bg-transparent dark:text-white"
                                onInput={(e) =>
                                    setContent(e.currentTarget.value)
                                }
                            ></textarea>
                            <input
                                type="text"
                                placeholder="Add a URL"
                                className="border-neutral-400 border text-base rounded w-full p-2 mb-3 sm:text-sm bg-transparent dark:text-white"
                                onInput={(e) => setUrl(e.currentTarget.value)}
                            />
                            <select
                                className="border-neutral-400 border text-base rounded w-full p-2 mb-3 sm:text-sm bg-transparent dark:text-white"
                                onChange={(e) => {
                                    setBoard(e.currentTarget.value);
                                    setNewBoard({
                                        value: newBoard.value,
                                        error: false,
                                    });
                                }}
                                value={board}
                            >
                                <option value="new-board">
                                    Create new Board
                                </option>
                                {boards.map(
                                    (board: { name: string }, index) => (
                                        <option value={board.name} key={index}>
                                            {board.name}
                                        </option>
                                    ),
                                )}
                            </select>
                            <div
                                className="flex flex-row items-stretch gap-3 w-full"
                                style={
                                    board === 'new-board'
                                        ? { display: 'flex' }
                                        : { display: 'none' }
                                }
                            >
                                <div className="flex flex-col">
                                    <input
                                        type="text"
                                        placeholder="Board name"
                                        className={`border text-base rounded w-75 p-2 sm:text-sm bg-transparent dark:text-white ${
                                            newBoard.error
                                                ? 'border-red-400'
                                                : 'border-neutral-400'
                                        }`}
                                        onInput={(e) =>
                                            setNewBoard({
                                                value: e.currentTarget.value,
                                                error: false,
                                            })
                                        }
                                        ref={newBoardInput}
                                    />
                                </div>
                                <button
                                    className="bg-red-600 hover:bg-red-800 w-full text-base text-white font-semibold rounded sm:text-sm self-start p-2 border border-red-600 hover:border-red-800"
                                    onClick={createBoard}
                                >
                                    Create
                                </button>
                            </div>
                            <span
                                className={`text-sm mt-1 block mr-auto text-red-400 ${
                                    newBoard.error ? 'block' : 'hidden'
                                }`}
                            >
                                Board name is too short (4 characters min), or
                                board already exists.
                            </span>
                            <button
                                className={`w-full text-base p-2 bg-red-600 text-white rounded font-semibold hover:bg-red-800 sm:text-sm ${
                                    board === 'new-board' ? 'mt-3' : 'mt-none'
                                }`}
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

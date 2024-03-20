import { useState } from 'react';
import Navbar from '../components/navbar';
import { useQuery } from 'react-query';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Pin from '../components/pin';
import { BiDotsHorizontal, BiTrash } from 'react-icons/bi';

export default function Board() {
    const [userData, setUserData] = useState({
        name: '',
    });
    const [options, setOptions] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    const { isLoading, error, data } = useQuery('getBoard', getBoard);

    async function getBoard() {
        try {
            const res = await fetch(
                `/api/board/${location.pathname.split('/')[2]}`,
                {
                    method: 'POST',
                },
            );

            if (res.status === 200) {
                let response = await res.json();
                getUserData();

                return response;
            }
        } catch (err) {
            console.log(err);
        }
    }

    async function getUserData() {
        try {
            const res = await fetch('/api/user', {
                method: 'POST',
            });

            if (res.status === 200) {
                let user = await res.json();
                setUserData(user);
            } else if (res.status === 401) {
                navigate('/');
            }
        } catch (err) {
            console.log(err);
        }
    }

    async function deleteBoard(boardId: string) {
        try {
            const res = await fetch(`/api/board/delete/${boardId}`, {
                method: 'POST',
            });

            if (res.status === 200) {
                navigate(-1);
            }
        } catch (err) {
            console.log(err);
        }
    }

    //if (isLoading) return <Loading />;

    if (error) return 'Error';

    if (data !== undefined) {
        return (
            <>
                <Navbar />
                <main className="flex justify-center mt-[64px] p-4">
                    <section className="flex flex-col max-w-3xl w-full">
                        <header className="mb-3">
                            <span className="flex justify-between flex-row">
                                <h1 className="text-2xl font-bold sm:text-xl">
                                    {data.name}
                                </h1>
                                {userData.name === data.author && (
                                    <button
                                        className="p-2 hover:bg-neutral-200 relative rounded-full"
                                        onClick={() => setOptions(!options)}
                                    >
                                        <BiDotsHorizontal className="text-2xl" />
                                        <ul
                                            className="flex-col list-none absolute bg-white shadow p-2 rounded-sm mt-3 right-0 z-20 w-max"
                                            style={
                                                options
                                                    ? { display: 'flex' }
                                                    : { display: 'none' }
                                            }
                                        >
                                            <li
                                                className="flex flex-row items-center text-left p-2 hover:bg-neutral-200 rounded-sm text-red-500"
                                                onClick={() =>
                                                    deleteBoard(data._id)
                                                }
                                            >
                                                <BiTrash className="float-left ml-1 mr-2 text-lg" />{' '}
                                                Delete Board
                                            </li>
                                        </ul>
                                    </button>
                                )}
                            </span>
                            <p>
                                Created by
                                <Link
                                    to={`/user/${data.author}`}
                                    className="font-bold"
                                >
                                    {' '}
                                    {data.author}
                                </Link>
                            </p>
                            <p className="mb-3">{data.pins.length} pins</p>
                        </header>
                        {data.pins.length > 0 && (
                            <section className="grid gap-4 grid-cols-2 sm:grid-cols-3">
                                {data.pins.map((pin: any, index: number) => (
                                    <Pin
                                        userName={userData.name}
                                        id={pin._id}
                                        title={pin.title}
                                        author={pin.author}
                                        image={pin.image.url}
                                        key={index}
                                        redirect={false}
                                    />
                                ))}
                            </section>
                        )}
                    </section>
                </main>
            </>
        );
    }
}

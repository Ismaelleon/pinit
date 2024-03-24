import { useState } from 'react';
import { BiDotsHorizontal, BiDownload, BiTrash } from 'react-icons/bi';
import { useQueryClient } from 'react-query';
import { useLocation, useNavigate } from 'react-router-dom';

interface Props {
    userName: string;
    pinAuthor: string;
    pinId: string;
    image: string;
    redirect: boolean;
}

export default function PinOptions({
    userName,
    pinAuthor,
    pinId,
    image,
    redirect,
}: Props) {
    const [options, setOptions] = useState(false);
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const location = useLocation();

    async function deletePin(id: string) {
        try {
            const res = await fetch(`/api/pin/delete/${id}`, {
                method: 'POST',
            });

            if (res.status === 200) {
                if (redirect) {
                    navigate(-1);
                } else {
                    const route = location.pathname.split('/')[1];
                    if (route === 'board') {
                        queryClient.invalidateQueries('getBoard');
                    } else if (route === 'home') {
                        queryClient.invalidateQueries('getLatestPins');
                    }
                }
            }
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <header
            className="py-2"
            onClick={(e) => {
                e.preventDefault();
            }}
        >
            <button
                className={`p-2 bg-neutral-200 hover:bg-neutral-300 dark:bg-neutral-700 dark:hover:bg-neutral-800
					${options && 'bg-neutral-300 dark:bg-neutral-800'}
					rounded-full`}
                onClick={() => setOptions(!options)}
            >
                <BiDotsHorizontal className="text-2xl" />
                <ul
                    className="flex-col list-none absolute bg-white shadow p-2 rounded-sm mt-3 -ml-2 dark:bg-neutral-800 dark:text-white"
                    style={options ? { display: 'flex' } : { display: 'none' }}
                >
                    <li
                        className="flex flex-row items-center text-left p-2 rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-900"
                        onClick={() => window.open(image)}
                    >
                        <BiDownload className="float-left ml-1 mr-2 text-lg" />{' '}
                        Download Image
                    </li>
                    {userName === pinAuthor && (
                        <li
                        className="flex flex-row items-center text-left p-2 rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-900 text-red-500"
                            onClick={() => {
                                deletePin(pinId);
                            }}
                        >
                            <BiTrash className="float-left ml-1 mr-2 text-lg" />
                            Delete Pin
                        </li>
                    )}
                </ul>
            </button>
        </header>
    );
}

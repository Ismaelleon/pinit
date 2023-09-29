import React, { useState } from 'react';
import { BiDotsHorizontal, BiDownload, BiTrash } from 'react-icons/bi';
import { useNavigate } from 'react-router-dom';

interface Props {
    userName: string;
    pinAuthor: string;
    pinId: string;
    image: string;
    filled: Boolean;
};

export default function PinOptions ({ userName, pinAuthor, pinId, image, filled }: Props) {
    const [options, setOptions] = useState(false);
    const navigate = useNavigate();

    async function deletePin (id: string) {
        try {
            const res = await fetch(`/api/pin/delete/${id}`, {
                method: 'POST',
            });

            if (res.status === 200) {
                navigate(-1);
            }
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <header className="py-2" onClick={e => {
                e.preventDefault();
            }}>
            <button className={`p-2 hover:bg-neutral-200 rounded-full ${filled && 'bg-neutral-200'} ${options ? 'bg-neutral-200' : ''}`}
                    onClick={() => setOptions(!options)}>
                <BiDotsHorizontal className="text-2xl" />
                <ul className="flex-col list-none absolute bg-white shadow p-2 rounded-sm mt-3 -ml-2"
                    style={options ? { display: 'flex' } : { display: 'none' }}>
                    <li className="flex flex-row items-center text-left p-2 hover:bg-neutral-200 rounded-sm" onClick={() => window.open(image)}>
                        <BiDownload className="float-left ml-1 mr-2 text-lg" /> Download Image
                    </li>
                    {userName === pinAuthor && (
                        <li className="flex flex-row items-center text-left p-2 hover:bg-neutral-200 rounded-sm text-red-500"
                            onClick={() => deletePin(pinId)}>
                            <BiTrash className="float-left ml-1 mr-2 text-lg" />Delete Pin
                        </li>
                    )}
                </ul>
            </button>
        </header>
    );
}

import { Link, useLocation } from "react-router-dom";
import { BiDotsHorizontal, BiHeart, BiSolidHeart, BiSolidUserCircle, BiTrash } from "react-icons/bi";
import { useQueryClient, useMutation } from "react-query";
import { useState } from "react";

interface Props {
    content: string;
    author: string;
    date: string;
    likes: number;
    id: string;
    deletable: Boolean;
};

export default function Comment ({ content, author, date, likes, id, deletable }: Props) {
    const [liked, setLiked] = useState(false);
    const [options, setOptions] = useState(false);
    const filled = true;
    const location = useLocation();

    const queryClient = useQueryClient();

    const deleteCommentMutation = useMutation(deleteComment, {
        onSuccess: (data) => {
            queryClient.invalidateQueries('getPin');
        }
    });

    function updateLikes () {
        
    }

    async function deleteComment () {
        const res = await fetch('/api/pin/uncomment/', {
            method: 'POST',
            body: JSON.stringify({
                pinId: location.pathname.split('/')[2],
                _id: id,
            }),
            headers: {
                'Content-Type': 'application/json',
            },
        });

    }

    return (
        <section className="grid grid-cols-[32px_auto_40px] gap-2 grid-flow-row mb-2"> 
            <section>
                <Link className="flex flex-row gap-2 hover:underline" to={`/user/${author}`}>
                    <BiSolidUserCircle size={32} />            
                </Link>
            </section>
            <section className="flex flex-col">
                <section className="flex flex-row gap-2">
                    <Link className="flex flex-row gap-2 hover:underline" to={`/user/${author}`}>
                        <h3 className="font-bold">{author}</h3>
                    </Link>
                    <p>{content}</p>
                </section>
                <section className="flex flex-row items-center gap-2">
                    <p className="text-xs">{date}</p>
                    {liked ? 
                        <BiSolidHeart className="cursor-pointer text-red-400" onClick={updateLikes} size={16} /> 
                    : 
                        <BiHeart className="cursor-pointer" onClick={updateLikes} size={16} />}
                    <span className="text-xs -ml-1">{likes}</span>
                </section>
            </section>
            <section>
                {deletable && (
                    <button className={`ml-auto p-2 hover:bg-neutral-300 rounded-full col-start-3 col-end-4 ${filled && 'bg-neutral-200'} ${options ? 'bg-neutral-200' : ''}`}
                            onClick={() => setOptions(!options)}>
                        <BiDotsHorizontal className="text-2xl" />
                        <ul className="flex-col list-none absolute bg-white shadow p-2 rounded-sm mt-3 -ml-2 right-0"
                            style={options ? { display: 'flex' } : { display: 'none' }}>
                            <li className="flex flex-row items-center text-left text-sm p-2 hover:bg-neutral-300 rounded-sm text-red-500" onClick={deleteCommentMutation.mutate}>
                                <BiTrash className="float-left ml-1 mr-2 text-base" /> Delete Comment 
                            </li>
                        </ul>
                    </button>
                )}
            </section>
        </section>
    );
}

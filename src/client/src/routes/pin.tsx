import { useState } from 'react';
import Navbar from '../components/navbar';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import PinOptions from '../components/pin-options';
import PinLoading from '../components/pin-loading';
import { BiLink, BiSend, BiSolidUserCircle } from 'react-icons/bi';
import Comment from '../components/comment';

interface Comment {
	content: string;
	author: string;
	date: string;
	likes: Array<string>;
	_id: string;
}

export default function Pin() {
    const [userData, setUserData] = useState({
        name: '',
    });
    const [commentContent, setCommentContent] = useState('');
    const location = useLocation();
    const navigate = useNavigate();

    const { isLoading, error, data } = useQuery('getPin', getPin);
    const queryClient = useQueryClient();

    const commentMutation = useMutation(sendComment, {
        onSuccess: () => {
            queryClient.invalidateQueries('getPin');
        },
    });

    async function getPin() {
        try {
            const res = await fetch(
                `/api/pin/${location.pathname.split('/')[2]}`,
                {
                    method: 'POST',
                },
            );

            if (res.status === 200) {
                const response = await res.json();
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
                const user = await res.json();
                setUserData(user);
            } else {
                navigate('/');
            }
        } catch (err) {
            console.log(err);
        }
    }

    async function sendComment() {
        try {
            const res = await fetch('/api/pin/comment', {
                method: 'POST',
                body: JSON.stringify({
                    id: location.pathname.split('/')[2],
                    content: commentContent,
                    author: userData.name,
                    date: new Date().toLocaleDateString(),
                }),
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const data = await res.json();

            return data;
        } catch (err) {
            console.log(err);
        }
    }

    if (isLoading) return <PinLoading />;

    if (error) return 'Error';

    if ('image' in data && userData.name !== '') {
        return (
            <>
                <Navbar />
                <main className="flex justify-center mt-[64px] p-4 dark:text-white">
                    <section className="flex flex-col max-w-3xl w-full sm:flex-row gap-2">
                        <img
                            src={data.image.url}
                            className="w-full rounded mb-3 sm:w-1/2 self-start"
                        />
                        <section className="sm:w-1/2 h-full relative">
                            <PinOptions
                                userName={userData.name}
                                pinAuthor={data.author}
                                image={data.image.url}
                                pinId={data._id}
                                redirect={true}
                            />
                            <section className="p-2">
                                {data.url === '' ? (
                                    <h2
                                        className={`text-xl font-bold ${
                                            data.url !== '' && 'hover:underline'
                                        }}`}
                                    >
                                        {data.title}
                                    </h2>
                                ) : (
                                    <a
                                        className="flex flex-row gap-2 items-center text-xl font-bold hover:underline"
                                        href={data.url}
                                        target="_blank"
										rel="noreferrer"
                                    >
                                        {data.title}
                                        <BiLink size={24} />
                                    </a>
                                )}
								<span className="text-sm text-neutral-400 mb-3">{data.date}</span>
                                <p className="text-base mb-3">{data.content}</p>
                                <Link
                                    to={`/user/${data.author}`}
                                    className="text-base font-bold flex flex-row items-center gap-3 mb-2 hover:underline"
                                >
                                    <BiSolidUserCircle size={32} />{' '}
                                    {data.author}
                                </Link>
                                <h3 className="text-lg font-bold mt-6 mb-2">
                                    Comments
                                </h3>
                                <section className="overflow-scroll min-h-24 max-h-36">
                                    {data.comments.length === 0 && (
                                        <p>
                                            There are not comments yet. Add one
                                            to start a conversation.
                                        </p>
                                    )}
                                    {data.comments.map((comment: Comment, index: number) => (
                                        <Comment
                                            content={comment.content}
                                            author={comment.author}
                                            date={comment.date}
                                            likes={comment.likes}
                                            id={comment._id}
                                            deletable={
                                                userData.name === comment.author
                                            }
                                            userName={userData.name}
                                            key={index}
                                        />
                                    ))}
                                </section>
                                <section className="grid grid-cols-[32px_auto_40px] flex-row items-center gap-2 absolute bottom-0 translate-y-full w-full bg-white dark:bg-neutral-900">
                                    <BiSolidUserCircle size={32} />
                                    <input
                                        type="text"
                                        placeholder="Add a comment"
                                        className="border border-neutral-400 text-sm rounded p-2 sm:text-sm bg-transparent dark:text-white"
                                        onChange={(e) =>
                                            setCommentContent(e.target.value)
                                        }
                                    />
                                    <button
                                        className="p-2 bg-red-600 rounded-3xl hover:bg-red-800"
                                        onClick={commentMutation.mutate}
                                    >
                                        <BiSend
                                            size={24}
                                            className="text-white"
                                        />
                                    </button>
                                </section>
                            </section>
                        </section>
                    </section>
                </main>
            </>
        );
    }
}

import { useEffect, useState } from "react";
import Navbar from "../components/navbar";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { BiDotsHorizontal, BiDownload, BiSolidUserCircle, BiTrash } from "react-icons/bi";
import { useQuery } from "react-query";

export default function Pin() {
    const [userData, setUserData] = useState({
        name: '',
    });
    const [options, setOptions] = useState(false);
	const location = useLocation();
    const navigate = useNavigate();

    const { isLoading, error, data } = useQuery('userData', async () => {
        try {
            const res = await fetch(`/api/pin/${location.pathname.split("/")[2]}`, {
                method: "POST",
            });			

            if (res.status === 200) {
                let response = await res.json();
                getUserData();
                return response;
            }
        } catch (err) {
            console.log(err);
        }
    });

    async function getUserData () {
        try {
            const res = await fetch('/api/user', {
                method: 'POST',
            });

            if (res.status === 200) {
                let user = await res.json();
                setUserData(user);
            }
        } catch (err) {
            console.log(err);
        }
    }

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

    if (isLoading) return 'Loading...';

    if (error) return 'Error';

    if ('image' in data && userData.name !== '') {
        return (
            <>
                <Navbar />
                <main className="flex justify-center mt-[64px] p-4">
                    <section className="flex flex-col max-w-3xl w-full sm:flex-row gap-3">
                        <img src={data.image.url} className="w-full rounded mb-3 sm:w-1/2" />
                        <section className="sm:w-1/2">
                            <header className="py-2">
                                <button className={`p-2 hover:bg-neutral-200 rounded-full ${options ? 'bg-neutral-200' : ''}`}
                                        onClick={() => setOptions(!options)}>
                                    <BiDotsHorizontal size={24} />
                                    <ul className="flex-col list-none absolute bg-white shadow p-2 rounded-sm mt-3 -ml-2"
                                        style={options ? { display: 'flex' } : { display: 'none' }}>
                                        <li className="flex flex-row items-center text-left p-2 hover:bg-neutral-200 rounded-sm" onClick={() => window.open(data.image.url)}>
                                            <BiDownload className="float-left ml-1 mr-2" size={18} /> Download Image
                                        </li>
                                        {userData.name === data.author && (
                                            <li className="flex flex-row items-center text-left p-2 hover:bg-neutral-200 rounded-sm text-red-500"
                                                onClick={() => deletePin(data._id)}>
                                                <BiTrash className="float-left ml-1 mr-2" size={18} />Delete Pin
                                            </li>
                                        )}
                                    </ul>
                                </button>
                            </header>
                            <section className="p-2">
                                <h2 className="text-xl font-bold mb-2">{data.title}</h2>
                                <p className="text-base mb-3">{data.content}</p>
                                <Link to={`/user/${data.author}`}  className="text-base font-bold flex flex-row items-center gap-3 mb-2">
                                    <BiSolidUserCircle size={24} /> {data.author}
                                </Link>
                            </section>
                        </section>
                    </section>
                </main>
            </>
        );
    }

}

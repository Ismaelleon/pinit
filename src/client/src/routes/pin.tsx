import { useState } from "react";
import Navbar from "../components/navbar";
import { Link, useLocation } from "react-router-dom";
import { useQuery } from "react-query";
import Loading from "../components/loading";
import PinOptions from "../components/pin-options";
import { BiSolidUserCircle } from "react-icons/bi";

export default function Pin() {
    const [userData, setUserData] = useState({
        name: '',
    });
	const location = useLocation();

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

    if (isLoading) return <Loading />;

    if (error) return 'Error';

    if ('image' in data && userData.name !== '') {
        return (
            <>
                <Navbar />
                <main className="flex justify-center mt-[64px] p-4">
                    <section className="flex flex-col max-w-3xl w-full sm:flex-row gap-3">
                        <img src={data.image.url} className="w-full rounded mb-3 sm:w-1/2" />
                        <section className="sm:w-1/2">
                            <PinOptions userName={userData.name} pinAuthor={data.author} image={data.image.url} pinId={data._id} filled={true} />
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

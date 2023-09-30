import { Link } from "react-router-dom";
import { BiSolidUserCircle } from "react-icons/bi";
import { useState } from "react";
import PinOptions from "./pin-options";

interface Props {
    userName: string;
    id: string;
    image: string;
    title: string;
    author: string;
    redirect: Boolean;
};

export default function Pin ({ userName, id, image, title, author, redirect }: Props) {
    const [overlay, setOverlay] = useState(false);

    return (
        <section> 
            <Link to={`/pin/${id}`}>
                <section className="relative"
                    onMouseEnter={() => setOverlay(true)} 
                    onMouseLeave={() => setOverlay(false)}>
                    <img src={image} className="rounded z-0" />
                    <span className={`absolute pl-2 top-0 left-0 w-full h-full bg-black/50 rounded ${overlay ? 'block' : 'hidden'}`}>
                        <PinOptions userName={userName} pinAuthor={author} image={image} pinId={id} filled={true} redirect={redirect} />
                    </span>
                </section>
                <h2 className="text-lg font-bold mt-1">{title}</h2>
            </Link>
            <Link to={`/user/${author}`} className="flex flex-row items-center mt-2">
                <BiSolidUserCircle className="text-2xl mr-2" />
                <p>{author}</p>
            </Link>
        </section>
    );
}

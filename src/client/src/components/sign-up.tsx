import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface Props {
	signUpModal: boolean;
	setSignUpModal: Function;
}

export default function SignUp(props: Props) {
    const [name, setName] = useState({ value: "", valid: true }),
        [email, setEmail] = useState({ value: "", valid: true }),
		[password, setPassword] = useState({ value: "", valid: true }),
		[birthday, setBirthday] = useState({ value: "", valid: true }),
		[error, setError] = useState(false);

	const navigate = useNavigate();

	function submitForm(event: Event) {
		event.preventDefault();

        if (name.valid && email.valid && password.valid && birthday.valid) {
            fetch("/api/sign-up", {
                method: "post",
                body: JSON.stringify({
                    name: name.value,
                    email: email.value,
                    password: password.value,
                    birthday: birthday.value,
                }),
                headers: {
                    "Content-Type": "application/json",
                },
            }).then((res) => {
                if (res.status === 200) {
                    setError(false);
                    navigate("/home");
                } else {
                    setError(true);
                }
            });
        }
	}

	return (
		<div
			className="absolute left-0 top-0 bg-neutral-800/50 w-full h-screen flex justify-center items-center"
			style={
				props.signUpModal ? { display: "flex" } : { display: "none" }
			}
		>
			<div className="flex flex-col p-5 bg-white rounded">
				<header className="mb-3 flex justify-end">
					<button
						className="p-1 rounded-full font-bold hover:bg-neutral-200"
						onClick={() => props.setSignUpModal(!props.signUpModal)}
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
				<h2 className="text-2xl font-bold text-center mb-3">
					Welcome to PinIt
				</h2>
				<p className="text-center mb-3">Find new ideas to experiment</p>
				<form className="flex flex-col mt-3">
                    <label className="text-base">Name</label>
					<input
						type="text"
						className={`p-2 ${
							name.valid
								? "border-neutral-200"
								: "border-red-400"
						} border text-base rounded`}
						placeholder="p1nt3r3st"
						onInput={(e) => {
							let value = e.currentTarget.value;
							let valid = value.length > 5;

							setName({ value, valid });
							setError(false);
						}}
					/>
					<span
						className="text-sm mt-1 d-block mr-auto text-red-400"
						style={
							error ? { display: "block" } : { display: "none" }
						}
					>
                        Name is too short or is already used
					</span>
					<label className="text-base mt-3">E-mail</label>
					<input
						type="email"
						className={`p-2 ${
							email.valid
								? "border-neutral-200"
								: "border-red-400"
						} border text-base rounded`}
						placeholder="example@pinit.com"
						onInput={(e) => {
							let value = e.currentTarget.value;
							let valid = value.length > 3;

							setEmail({ value, valid });
							setError(false);
						}}
					/>
					<span
						className="text-sm mt-1 d-block mr-auto text-red-400"
						style={
							error ? { display: "block" } : { display: "none" }
						}
					>
						E-mail already signed-up
					</span>
					<label className="text-base mt-3">Password</label>
					<input
						type="password"
						className={`p-2 ${
							password.valid
								? "border-neutral-200"
								: "border-red-400"
						} border text-base rounded`}
						placeholder="secretpwd321"
						onInput={(e) => {
							let value = e.currentTarget.value;
							let valid = value.length > 7;

							setPassword({ value, valid });
						}}
					/>
					<label className="text-base mt-3">Birthday</label>
					<input
						type="date"
						className={`p-2 ${
							birthday.valid
								? "border-neutral-200"
								: "border-red-400"
						} border text-base rounded w-full bg-white`}
						onInput={(e) => {
							let value = e.currentTarget.value;
							let valid =
								new Date(Date.now()).getFullYear() -
									new Date(value).getFullYear() >
								18;

							setBirthday({ value, valid });
						}}
					/>
					<button
						className={`text-base mt-3 p-2 bg-red-600 text-white rounded font-semibold hover:bg-red-800`}
						onClick={submitForm}
					>
						Sign Up
					</button>

					<button className="mt-3 text-xs text-neutral-800 hover:text-black hover:underline">
						Already have an account? <span>Log In</span>
					</button>
				</form>
			</div>
		</div>
	);
}

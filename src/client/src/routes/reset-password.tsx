import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function ResetPassword() {
	const [email, setEmail] = useState({ value: '', valid: true }),
		[password, setPassword] = useState({ value: '', valid: true }),
		[password1, setPassword1] = useState({ value: '', valid: true }),
		[showForm, setShowForm] = useState(true),
		[showMessage, setShowMessage] = useState(false),
		[token, setToken] = useState('');

	const navigate = useNavigate();

    function submitMailForm(event: React.MouseEvent<HTMLButtonElement>) {
		event.preventDefault();
		fetch('/api/reset-password', {
            method: 'post',
            body: JSON.stringify({
                email: email.value,
            }),
            headers: {
                'Content-Type': 'application/json',
            },
		}).then(res => {
			if (res.status === 200) {
				setShowMessage(true);
			}
		})
	}

	function submitPasswordForm (event: React.MouseEvent<HTMLButtonElement>) {
		event.preventDefault();
		if (password.value === password1.value && password.valid && password1.valid) {
			fetch('/api/set-password', {
				method: 'post',
				body: JSON.stringify({
					token,
					password: password.value,
				}),
				headers: {
					'Content-Type': 'application/json',
				},
			}).then(res => {
				if (res.status === 200) {
					setShowMessage(true);
					setTimeout(() => navigate('/'), 1000);
				}
			});
		}
	}

	function getResetToken () {
		const queryParams: URLSearchParams = new URLSearchParams(window.location.search);
		const token = queryParams.get('token');

		if (token !== null) {
			setShowForm(false);
			setToken(token);
		}
	}

	useEffect(getResetToken, []);

    return (
		<>
			<header className="flex w-full justify-center p-3 fixed left-0 top-0 bg-white dark:bg-neutral-900 dark:text-white">
				<div className="flex justify-between items-center max-w-4xl w-full ">
					<Link to="/" className="text-xl font-bold">
						PinIt
					</Link>

					<ul className="flex items-center">
						<li
							className="text-sm p-2 px-3 bg-neutral-200 rounded font-semibold hover:bg-neutral-400 cursor-pointer dark:bg-neutral-700 dark:hover:bg-neutral-800"
							onClick={() => navigate('/')}
						>
							Go Back	
						</li>
					</ul>
				</div>
			</header>
            <main className="flex justify-center mt-[64px] p-4 dark:text-white">
                <section className="flex flex-col max-w-3xl w-full">
                    <h1 className="text-2xl font-bold mb-3 sm:text-xl">
						Reset Password	
                    </h1>
					{showForm ? (
						<section>
							<p className="mb-3 text-base">
								Insert your e-mail address to change your password,
								you will receive a message.
							</p>
							<form className="grid grid-rows-2 gap-0">
								<input
									type="email"
									className={`p-2 ${
										email.valid
											? 'border-neutral-200'
											: 'border-red-400'
									} border text-base rounded bg-transparent max-w-xs`}
									placeholder="example@pinit.com"
									onInput={(e) => {
										const value = e.currentTarget.value;
										const valid = value.length > 3;

										setEmail({ value, valid });
									}}
								/>
								<button
									className="text-base mt-3 p-2 bg-red-600 text-white rounded font-semibold hover:bg-red-800 max-w-xs"
									onClick={submitMailForm}
								>
									Send
								</button>
							</form>
							<p className={`mt-3 text-green-600 ${showMessage ? '' : 'hidden'}`}>
								Email sent. Check your inbox and click the reset link provided.
							</p>
						</section>
					) : 
						<section>
							<form className="flex flex-col">
								<label className="text-base">New password</label>
								<input
									type="password"
									className={`p-2 ${
										password.valid
											? 'border-neutral-200'
											: 'border-red-400'
									} border text-base rounded bg-transparent max-w-xs`}
									placeholder="secretpwd321"
									onInput={(e) => {
										const value = e.currentTarget.value;
										const valid = value.length > 7;

										setPassword({ value, valid });
									}}
								/>
								<label className="text-base mt-3">Repeat your new password</label>
								<input
									type="password"
									className={`p-2 ${
										password1.valid
											? 'border-neutral-200'
											: 'border-red-400'
									} border text-base rounded bg-transparent max-w-xs`}
									placeholder="secretpwd321"
									onInput={(e) => {
										const value = e.currentTarget.value;
										const valid = value.length > 7;

										setPassword1({ value, valid });
									}}
								/>
								<button
									className="text-base mt-3 p-2 bg-red-600 text-white rounded font-semibold hover:bg-red-800 max-w-xs"
									onClick={submitPasswordForm}
								>
									Send
								</button>
							</form>
							<p className={`mt-3 text-green-600 ${showMessage ? '' : 'hidden'}`}>
								Password updated. Redirecting to home page.
							</p>
						</section>
					}
				</section>
			</main>
		</>
    );
}

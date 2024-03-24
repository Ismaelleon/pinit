import {SetStateAction} from "react";

interface Props {
	state: boolean;
	toggleState: SetStateAction<any>;
}

export default function Switch (props: Props) {
	return (
		<div 
			className={`flex items-center p-1 w-[40px] h-[24px] rounded-xl cursor-pointer 
				${props.state ? 'bg-red-600' : 'bg-neutral-400'}`}
			onClick={props.toggleState}
		>
			<span className={`w-[18px] h-[18px] bg-white rounded-xl ${props.state ? 'ml-auto' : 'ml-0'}`}></span>
		</div>
	);
}

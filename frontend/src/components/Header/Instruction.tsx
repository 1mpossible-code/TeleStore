import {useState} from "react"

const Instruction = () => {
    const [switchOn, setSwitchOn] = useState<boolean>(false);

    const toggleInstruction = () => {
        setSwitchOn((switchOn) => !switchOn);
    };


    return (
        <>
            <div className="flex justify-center">
                <button onClick={toggleInstruction} className="">
                    User Instructions
                </button>
            </div>

            {/*below is the instruction for registration*/}
            <div className="text-center mt-14 mb-4">
                {switchOn && <p>switch is on</p>}
            </div>
        </>
    );
};
export default Instruction;

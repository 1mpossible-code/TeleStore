// import {useState} from "react"
import Instruction from "./Instruction.tsx"

const Header = () => {
    // const [switchOn, setSwitchOn] = useState<boolean>(false);
    //
    // const toggleInstruction = () => {
    //   setSwitchOn((switchOn) => !switchOn);
    // };


    return (
        <>
            {/*below is the header*/}
            <div className="text-center mt-14 mb-4">
                <h1 className="font-semibold text-6xl	mb-3">TeleStore</h1>
                <p className="text-s opacity-50">
                    Expand Your Reach, Not Your Costs - Agile Storage for All
                </p>
            </div>

            <div className="justify-center">
                <Instruction/>

            </div>
        </>
    );
};
export default Header;

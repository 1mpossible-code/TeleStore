import cn from "classnames";

const Header = () => {
    // const recieved = false
    const glass = "bg-white bg-opacity-20 shadow-xl backdrop-blur-md rounded-lg border border-white border-opacity-20 ";

    return (
        <>
            <div className="text-center mt-7 mb-4">
                <h1 className={cn("text-6xl justify-center mb-3 text-2xl font-semibold flex")}>Tele <p
                    className={'text-blue-500'}><u
                    className={cn(  'underline underline-offset-3')}>Store</u>
                </p></h1>

                <br/>
                <p className={cn('text-s opacity-50')}>
                    Encrypted cloud storage for all.
                </p>

            </div>
        </>
    );
};
export default Header;

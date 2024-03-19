import Header from './components/Header/Header';
import MainContent from './components/MainContent/MainContent';
import {Footer} from "@/components/Footer /Footer";
import ThemeProvider from '@/components/ThemeProvider';
import {Toaster} from "@/components/ui/toaster"
import './App.css';
import {useSelector} from "react-redux";
import {RootState} from "@/state/store";

import {UserInfo} from "@/UserInfo";


const App = () => {
    const isValid = useSelector((state: RootState) => state.mainContent.validUser);
    return (
        <div>
            <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
                <Header/>
                {isValid ?
                    <MainContent/> :
                    <UserInfo/>}
                <Footer/>
                <Toaster/>
            </ThemeProvider>
        </div>)

};
export default App;

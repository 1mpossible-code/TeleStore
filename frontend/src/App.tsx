import Header from './components/Header/Header';
import MainContent from './components/MainContent/MainContent';
import {Footer} from "@/components/Footer /Footer";
import ThemeProvider from '@/components/ThemeProvider';
import {Toaster} from "@/components/ui/toaster"

import './App.css';


const App = () => {

    return (
        <div>
            <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
                <Header/>
                <MainContent/>
                <Footer/>
                <Toaster/>

            </ThemeProvider>
        </div>)

};
export default App;

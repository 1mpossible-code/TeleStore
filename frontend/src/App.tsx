import Header from './components/Header/Header';
import MainContent from './components/MainContent/MainContent';
import {Footer} from "@/components/Footer /Footer";
import ThemeProvider from '@/components/ThemeProvider';
import {Toaster} from "@/components/ui/toaster"
import './App.css';
import { useDispatch, useSelector } from 'react-redux';
import {UserInfo} from "@/components/UserInfo";
import {  AppDispatch, RootState} from '@/state/store';
import { useEffect } from 'react';
import { getValidUser } from './state/mainContent/mainContentSlice';

const App = () => {
    const dispatch = useDispatch<AppDispatch>();
     const isValid: boolean = useSelector(
       (state: RootState) => state.mainContent.validUser
     );

    useEffect(()=>{
        dispatch(getValidUser());
    },[isValid])
  

    return (
      <div>
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
          <Header />
          {isValid ? <MainContent /> : <UserInfo />}
          <Footer />
          <Toaster />
        </ThemeProvider>
      </div>
    );
};
export default App;

import Header from './components/Header/Header';
import MainContent from './components/MainContent/MainContent';
import ThemeProvider from '@/components/ThemeProvider';
import { useState } from 'react';
import './App.css';

const App = () => {
  const [loading, setLoading] = useState<boolean>(false);

  return loading ? (
    'loaf'
  ) : (
    <div>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <Header />
        <MainContent />
      </ThemeProvider>
    </div>
  );
};
export default App;

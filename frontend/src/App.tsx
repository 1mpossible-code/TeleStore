import Header from './components/Header/Header';
import MainContent from './components/MainContent/MainContent';
import ThemeProvider from '@/components/ThemeProvider';
import { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';

const App = () => {
  const [uploads, setUploads] = useState<Array<Uploads>>([]);
  const [loading, setLoading] = useState<boolean>(false);

  interface Uploads {
    id: number;
    name: string;
    size: number;
  }

  useEffect(() => {
    (async () => {
      setLoading(true);
      const res = await axios.get<Array<Uploads>>(
        'http://127.0.0.1:3000/uploads/'
      );
      setUploads(res.data);
      setLoading(false);
    })();
  }, []);

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

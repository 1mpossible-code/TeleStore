import Header from './components/Header/Header';
import MainContent from './components/MainContent/MainContent';
import ThemeProvider from '@/components/ThemeProvider';
import { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

export interface Upload {
  id: number;
  name: string;
  size: number;
}

const App = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [uploads, setUploads] = useState<Array<Upload>>([]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const res = await axios.get<Array<Upload>>(
        'http://127.0.0.1:3000/uploads/'
      );
      setLoading(false);
      setUploads(res.data);
    })();
  }, []);
  return loading ? (
    'loaf'
  ) : (
    <div>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <Header />
        <MainContent uploads_data={uploads} />
      </ThemeProvider>
    </div>
  );
};
export default App;

import Header from './components/Header/Header';
import MainContent from './components/MainContent/MainContent';
import ThemeProvider from '@/components/ThemeProvider';
import './App.css';

const App = () => {
  return (
    <div>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <Header />
        <MainContent />
      </ThemeProvider>
    </div>
  );
};
export default App;

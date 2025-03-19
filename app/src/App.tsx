import MutantEditor from "./components/Editor";

const App: React.FC = () => {
  return (
    <div className="w-screen h-screen flex flex-col font-family-mono bg-tokyo-bg">
      <MutantEditor />
    </div>
  );
};

export default App;

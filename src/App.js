import Main from "./Components/Main";
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter } from "react-router-dom";
import store from "./Redux/store";
import {Provider} from 'react-redux';

function App() {
  return (
    <Provider store={store}> 
      <BrowserRouter>
        <Main />
      </BrowserRouter>
    </Provider>
  );
}

export default App;

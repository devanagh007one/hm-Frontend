import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import store from './redux/store';
import Header from './components/Header';
import Tobbar from './components/tobbar';
import Homepage from './Pages/Homepage';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import PrivateComponent from './components/PrivateComponent';
import Login from "./components/Modular/login";


const App = () => {
  return (
    <Provider store={store}>
      <DndProvider backend={HTML5Backend}>
        <BrowserRouter>
          <Routes>
          <Route path="/login" element={<Login />}/>
            <Route element={<PrivateComponent />}>
              <Route path="/" element={<div className="flex"><Homepage /></div>}/>
            </Route>
          </Routes>
        </BrowserRouter>
      </DndProvider>
    </Provider>
  );
};

export default App;

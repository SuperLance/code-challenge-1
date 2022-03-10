import React from 'react';
import Autocomplete from './components/Autocomplete';
import axios from 'axios';
import { API_SERVER } from './constants';

const App = () => {
  const ajax = ({ search = '', limit = 50 }) => {
    return axios.request({
      method: 'GET',
      url: `${API_SERVER}/filters`,
      params: {
        search,
        limit,
      }
    });
  };

  return (
    <div className="app">
      <Autocomplete ajax={ajax} limit={50} />
    </div>
  );
}

export default App;

// import React, { Fragment } from 'react';
// import './App.css';
// import Cabecalho from "./Cabecalho";
// import FormCalculadora from "./FormCalculadora";
// import Rodape from "./Rodape";

// function App() {
//   return (
//     <Fragment>
//       <Cabecalho />
//       <FormCalculadora />
//       <Rodape />
//     </Fragment>
//   );
// }

// export default App;

import React, { Fragment } from 'react';
import './App.css';
import Cabecalho from "./Cabecalho";
import FormCalculadora from "./FormCalculadora";
import Rodape from "./Rodape";
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(
  <Fragment>
    <Cabecalho />
    <FormCalculadora />
    <Rodape />
  </Fragment>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();
// import React from 'react';
// import { Provider } from 'react-redux';
// import { store } from './src/store';
// import AppNavigator from './src/navigation/AppNavigator';

// const App = () => {
//   return (
//     <Provider store={store}>
//       <AppNavigator />
//     </Provider>
//   );
// };

// export default App;
import React from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './../MilkywayApp/src/store/index';
import AppNavigator from '../MilkywayApp/src/navigation/AppNavigator';



export default function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AppNavigator />
      </PersistGate>
    </Provider>
  );
}

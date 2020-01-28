import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import Main from './pages/Main';
import Profile from './pages/Profile';

const Routes = createAppContainer(
  createStackNavigator({
    Main: {
      screen: Main,
      navigationOptions: {
        title: 'DevRadar'
      },
    },
    Profile: {
      screen: Profile,
      navigationOptions: {
        title: 'Pefil no GitHub'
      },
    },
  }, {// Segundo Parametro
    defaultNavigationOptions: {// defaultNavigationOptions - sera aplicada em todas as telas
      headerTintColor: '#fff', // Pinta a cor do texo do header
      headerBackTitleVisible: false, //no caso do ios para remover titulo do header
      headerStyle: {
        backgroundColor: '#7d40e7'
      }
    },
  })
);

export default Routes;
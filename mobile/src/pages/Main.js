import React, { useEffect, useState } from 'react';
import { StyleSheet, Image, View, Text, TextInput, TouchableOpacity, Keyboard } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
/**peço permissões do usuário para ultilizar localização dele / Pego a localização do usuário */
import { requestPermissionsAsync, getCurrentPositionAsync } from 'expo-location';
import { MaterialIcons } from '@expo/vector-icons'; // icones disponíveis que vem por padrão no expo

import api from '../services/api';
import { connect, disconnect, subscribeToNewDevs } from '../services/socket';

function Main({ navigation }) { /** destruturaçao - navegation = é uma propriedade que eu recebo automaticamente por ser um componente de navegação */
  const [currentRegion, setCurrentRegion] = useState(null);
  const [devs, setDevs] = useState([]); //Preciso armazenar as informações que vem da api para dentro de um estado
  const [techs, setTechs] = useState('');

  useEffect(() => {
    async function loadInitialPosition() {
      const { granted } = await requestPermissionsAsync();

      if (granted) {
        const { coords } = await getCurrentPositionAsync({
          enableHighAccuracy: true, /**funciona apenas se eu ativar o gps do meu celular/ se não , passa false */
        });

        const { latitude, longitude } = coords;

        setCurrentRegion({
          latitude,
          longitude,
          latitudeDelta: 0.04, //Delta - calucular navais para obter zoom
          longitudeDelta: 0.04,
        })
      }
    }

    loadInitialPosition();
  }, []);

  /**monitora a variavel devs, toda vez que ela mudar eu executo a função subscribeToNewDevs  */
  useEffect(() => {
    subscribeToNewDevs(dev => setDevs([...devs, dev]));
  }, [devs]);

  function setupWebsocket() {
    //antes de fazer um nova conexão, disconecta a anterior/ Evita conexões sobrando... 
    disconnect();

    const { latitude, longitude } = currentRegion;

    /** envios essas infos para o meu back */
    connect(
      latitude,
      longitude,
      techs
    )
  }

  async function loadDevs() {
    const { latitude, longitude } = currentRegion;

    const response = await api.get('/search', {
      params: {
        latitude,
        longitude,
        techs
      }
    });
    setDevs(response.data.devs);
    setupWebsocket();
  }

  async function handleRegionChange(region) {
    setCurrentRegion(region);

  }

  if (!currentRegion) { /** Enquanto meu currentRegion for null, eu apresento apenas o mapa na tela  e não renderizo a tela*/
    return null;
  }

  /** estou passando um codigo javascrpt em objeto , a estilizaçao em react-native é feita 
   * por objeto
  */
  return (
    <>
      <MapView
        onRegionChangeComplete={handleRegionChange}
        initialRegion={currentRegion}
        style={styles.map}
      >
        {devs.map(dev => (
          <Marker
            key={dev._id}
            coordinate={{
              longitude: dev.location.coordinates[0], //latitude 
              latitude: dev.location.coordinates[1], //longitude
            }}>

            <Image style={styles.avatar} source={{ uri: dev.avatar_url }}></Image>

            <Callout onPress={() => {
              //Navegação
              navigation.navigate('Profile', { github_username: dev.github_username });
            }}>
              <View style={styles.callout}>
                <Text style={styles.devName}>{dev.name}</Text>
                <Text style={styles.devBio}>{dev.bio}</Text>
                <Text style={styles.devTechs}>{dev.techs.join(', ')}</Text>
              </View>
            </Callout>
          </Marker>

        ))}
      </MapView >
      <View style={styles.seachForm}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar devs por techs..."
          placeholderTextColor="#999"
          autoCapitalize="words"
          autoCorrect={false}
          value={techs}
          onChangeText={setTechs}
        />

        <TouchableOpacity onPress={loadDevs} style={styles.loadButton}>
          <MaterialIcons name="my-location" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  map: {
    flex: 1
  },
  avatar: {
    width: 54,
    height: 54,
    borderRadius: 4,
    borderWidth: 4,
    borderColor: '#fff'
  },

  callout: {
    width: 260
  },
  devName: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  devBio: {
    color: '#666',
    marginTop: 5
  },
  devTechs: {
    marginTop: 5
  },

  seachForm: {
    position: 'absolute', // Faz o botão flutuar por cima do formulário
    top: 20,
    left: 20,
    right: 20,
    zIndex: 5, //força a ficar por cima do mapa
    flexDirection: 'row' // Obs: display flex é o padrão no React Native
  },

  searchInput: {
    flex: 1, //ocupa o máximo de espaço possível
    height: 50,
    backgroundColor: '#fff',
    color: '#333',
    borderRadius: 25,
    paddingHorizontal: 20,
    fontSize: 16,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: {
      width: 4,
      height: 4,
    },
    elevation: 2
  },

  loadButton: {
    width: 50,
    height: 50,
    backgroundColor: '#8e4dff',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 15,
  }

});

export default Main;
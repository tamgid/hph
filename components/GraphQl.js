import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, FlatList } from 'react-native';
import React, { useEffect } from 'react';

import { useQuery, gql } from '@apollo/client';

const COUNTRY_QUERY = gql`
  query {
    countries {
      name
      code
      capital
      currency
    }
  }
`;
const GraphQl = ({ navigation }) => {
  const { data, loading, error } = useQuery(COUNTRY_QUERY);

  if (loading) {
    return <Text>Loading...</Text>;
  }

  if (error) {
    return <Text>Error: {error.message}</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>GraphQL - Country Details</Text>
      <FlatList
        data={data.countries}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.commentItem}>
            <Text>Name: {item.name}</Text>
            <Text>Age: {item.code}</Text>
            <Text>Address: {item.capital}</Text>
            <Text>Comment: {item.currency}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  commentItem: {
    marginBottom: 20,
    borderColor: 'gray',
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
  },
});

export default GraphQl;

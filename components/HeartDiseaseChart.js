import React from 'react';
import { View, Dimensions } from 'react-native';
import { PieChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

const HeartDiseasePieChart = ({ heartDiseaseCount, noHeartDiseaseCount }) => {
  const data = [
    {
      name: 'Yes',
      population: heartDiseaseCount,
      color: '#ff6384',
      legendFontColor: '#333',
      legendFontSize: 15,
    },
    {
      name: 'No',
      population: noHeartDiseaseCount,
      color: '#36a2eb',
      legendFontColor: '#333',
      legendFontSize: 15,
    },
  ];

  return (
    <View>
      <PieChart
        data={data}
        width={screenWidth}
        height={260}
        chartConfig={{
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        }}
        accessor="population"
        backgroundColor="transparent"
        paddingLeft="50"
        absolute // This makes the numbers inside the pie chart show the actual population
      />
    </View>
  );
};

export default HeartDiseasePieChart;

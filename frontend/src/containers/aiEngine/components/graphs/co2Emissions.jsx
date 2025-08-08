import React, { useEffect, useState } from 'react';
import CustomScatterChart from '../../../../components/customScatteredChart';
import CustomCard from '../../../../components/customCard';
import { useTheme } from '@mui/material/styles';
import { getNextYearCO2 } from '../../../../services/aiEngineServices/aiEngineServices';
// import { getNextYearCO2 } from '../../services';

const scatterChartData = [
  {
    year: '2023',
    values: [
      [2024, 0, '', ''],
      [2024, 5, '', ''],
      [2025, 45, 110000000, 'Jebel Ali'],
      [2025, 55, 110000000, 'Sulay'],
      [2024, 70, '', ''],
      [2024, 70, '', ''],
    ],
  },
  {
    year: '2024',
    values: [
      [2024, 0, '', ''],
      [2024, 5, '', ''],
      [2024, 50, 180000000, 'Jebel Ali'],
      [2024, 40, 180000000, 'Sulay'],
      [2024, 70, '', ''],
      [2024, 70, '', ''],
    ],
  },
  {
    year: '2025',
    values: [
      [2024, 0, '', ''],
      [2024, 5, '', ''],
      [2025, 30, 300000000, 'Jebel Ali'],
      [2025, 60, 300000000, 'Sulay'],
      [2024, 70, '', ''],
      [2024, 70, '', ''],
    ],
  },
];

const Co2Emissions = ({ siteID }) => {
  const theme = useTheme();
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchCO2Data = async () => {
      try {
        const { data } = await getNextYearCO2(siteID);
        if (data) {
          setChartData(data);
        }
      } catch (error) {
        console.error('Error fetching CO2 data:', error);
      }
    };

    if (siteID) {
      fetchCO2Data();
    }
  }, [siteID]);

  return (
    <CustomCard
      style={{
        border: `1px solid ${theme?.palette?.default_card?.border}`,
        backgroundColor: theme?.palette?.default_card?.background,
        borderRadius: '7px',
        position: 'relative',
      }}
    >
      <CustomScatterChart data={chartData} />
    </CustomCard>
  );
};

export default Co2Emissions;

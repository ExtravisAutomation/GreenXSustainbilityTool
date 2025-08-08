import React, { useEffect, useState } from 'react';
import CustomBarChartWithLabels from '../../../../components/customBarchartWithLabel';
// import { getNextYear } from '../../services';
import CustomCard from '../../../../components/customCard';
import { useTheme } from '@mui/material/styles';
import { getNextYear } from '../../../../services/aiEngineServices/aiEngineServices';

const legendData = [
  'Energy Efficiency Ratio (EER)',
  'Power Usage Effectiveness (PUE)',
  'Carbon Usage Effectiveness (CUE)',
];
const config = {
  rotate: 90,
  align: 'left',
  verticalAlign: 'middle',
  position: 'insideBottom',
  distance: 15,
};

const YearlyPrediction = ({ siteID }) => {
  const theme = useTheme();
  const [seriesData, setSeriesData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await getNextYear(siteID);
        if (data) {
          const formattedData = {
            years: data.map((item) => item.year),
            data: [
              {
                name: '(EER)',
                data: data.map((item) => item.EER),
                barGap: 0,
              },
              {
                name: '(PUE)',
                data: data.map((item) => item.PUE),
              },
              {
                name: 'Data Traffic',
                data: data.map((item) => item.datatraffic),
              },
            ],
          };
          setSeriesData(formattedData);
        }
      } catch (error) {
        console.error('Error fetching yearly prediction data:', error);
      }
    };

    if (siteID) {
      fetchData();
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
      <CustomBarChartWithLabels
        title="Sustainability Metrics AI Driven Yearly Prediction"
        seriesData={seriesData}
        legendData={legendData}
        config={config}
      />
    </CustomCard>
  );
};

export default YearlyPrediction;

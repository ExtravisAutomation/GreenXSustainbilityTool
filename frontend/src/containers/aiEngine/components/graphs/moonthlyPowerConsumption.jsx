import React, { useEffect, useState } from 'react';
import GraphWrapper from '../../../../components/ui/graphWrapper';
import PredictionBarChart from './energyUtilization';
import { useSelector } from 'react-redux';
import { fetchNextMonthData } from '../../../../services/aiEngineServices/aiEngineServices';
// import { fetchNextMonthData } from '../../services';

const MonthlyPowerConsumption = ({ siteId }) => {
  const [monthlyPowerData, setMonthlyPowerData] = useState([]);
  const [loading, setLoading] = useState(false);
  const devices = useSelector((state) => state.devices?.data?.data);

  const fetchData = async (value) => {
    setLoading(true);
    const data = await fetchNextMonthData(value, 'PUE');
    if (data) {
      setMonthlyPowerData(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (devices && devices[0]) {
      const firstDevice = devices[0]?.id;
      fetchData(firstDevice);
    }
  }, [devices]);

  return (
    <GraphWrapper
      siteID={siteId}
      title="Power Usage Forcast"
      onDeviceChange={fetchData}
      withDeviceFilter={true}
      loading={loading}
    >
      <PredictionBarChart
        predictionText="Predictive Power Consumption"
        // predictionText=""
        data={monthlyPowerData}
      />
    </GraphWrapper>
  );
};

export default MonthlyPowerConsumption;

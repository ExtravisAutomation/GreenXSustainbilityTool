import React, { useEffect, useState } from 'react';
import GraphWrapper from '../../../../components/ui/graphWrapper';
import PredictionBarChart from './energyUtilization';
import { useSelector } from 'react-redux';
import { fetchNextMonthData } from '../../../../services/aiEngineServices/aiEngineServices';
// import { fetchNextMonthData } from '../../services';

const MonthlyEnergyEfficiency = ({ siteId }) => {
  const [monthlyEfficiencyData, setMonthlyEfficiencyData] = useState([]);
  const [loading, setLoading] = useState(false);
  const devices = useSelector((state) => state.devices?.data?.data);

  const fetchData = async (value) => {
    setLoading(true);
    const data = await fetchNextMonthData(value);
    if (data) {
      setMonthlyEfficiencyData(data);
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
      title="Energy Efficiency Prediction"
      onDeviceChange={fetchData}
      withDeviceFilter={true}
      loading={loading}
    >
      <PredictionBarChart chartId="demo-chart" data={monthlyEfficiencyData} />
    </GraphWrapper>
  );
};

export default MonthlyEnergyEfficiency;

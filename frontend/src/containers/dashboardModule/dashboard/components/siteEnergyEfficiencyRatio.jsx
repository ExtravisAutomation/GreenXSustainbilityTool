import { Spin } from 'antd';
import CustomCard from '../../../../components/customCard';
import KpiSelector from '../kpiSelector';
import EnergyEfficiencyOverall from '../../../../components/energyEfficiencyOverall';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { fetchKpiChartData } from '../../../../store/features/dashboardModule/actions/kpiChartAction';
import { Padding } from '@mui/icons-material';
import CustomSpin from '../../../../components/CustomSpin';

const SiteEnergyEfficiencyRatio = ({
  theme,
  siteName,
  kpiOptions,
  siteId = null,
  isPue = false,
  isDashboard = false,
}) => {
  const dispatch = useDispatch();

  const kpiChartData = useSelector((state) => state.kpiChartData?.data?.data);
  const loading = useSelector((state) => state.kpiChartData.loading);
  const [kpiOption, setKpiOption] = useState('24 hours');

  useEffect(() => {
    if (siteId) {
      dispatch(fetchKpiChartData(siteId, kpiOption));
    }
  }, [kpiOption, siteId]);
  return (
    <CustomSpin spinning={loading}>
      <CustomCard
        style={{
          border: `1px solid ${theme?.palette?.default_card?.border}`,
          backgroundColor: theme?.palette?.main_layout?.background,
          borderRadius: '7px',
          // Padding:'0px',
          position: 'relative',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <p
            style={{
              fontSize: '16px',
              color: theme?.palette?.graph?.title,
              marginBottom: '0px',
              marginTop: '0px',
              fontFamily: 'inter',
            }}
          >
            Overall{' '}
            <span
              style={{
                color: theme?.palette?.main_layout?.secondary_text,
              }}
            >
              {siteName}{' '}
            </span>
            Energy Efficiency Ratio
          </p>
          {isDashboard ? (
            ''
          ) : (
            <div
              style={{
                display: 'flex',
                justifyContent: 'end',
                gap: '10px',
              }}
            >
              <KpiSelector
                options={kpiOptions}
                setKpiOption={setKpiOption}
                value={kpiOption}
                kpi="true"
              />
            </div>
          )}
        </div>
        <EnergyEfficiencyOverall
          // kpiOption={kpiOption}
          data={kpiChartData}
          siteId={siteId}
          siteName={siteName}
          isPue={isPue}
        />
      </CustomCard>
    </CustomSpin>
  );
};

export default SiteEnergyEfficiencyRatio;

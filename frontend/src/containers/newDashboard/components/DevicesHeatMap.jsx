import React from 'react';
import { useTheme } from '@mui/material/styles';
// import CustomCard from '../../../../components/customCard';
// import HeatmapChart from '../../../../components/heatmapChart';
import { useSelector } from 'react-redux';
import CustomCard from '../../../components/customCard';
import HeatmapChart from '../../../components/heatmapChart';
import CustomSpin from '../../../components/CustomSpin';

const DevicesHeatMap = ({ siteId }) => {
  const theme = useTheme();
  const racks = useSelector((state) => state.racks?.racks);
  //   const devices = useSelector((state) => state.devices?.data?.data);

  const {
    data: co2PcrDevicesData = {},
    loading: co2PcrDevicesLoading,
    error: co2PcrDevicesError,
  } = useSelector((state) => state.co2PcrDevices);

  return (
    <CustomSpin spinning={co2PcrDevicesLoading}>
      <CustomCard
        style={{
          border: `1px solid ${theme?.palette?.default_card?.border}`,
          backgroundColor: theme?.palette?.main_layout?.background,
          borderRadius: '7px',
          position: 'relative',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '10px',
          }}
        >
          <p
            style={{
              fontSize: '16px',
              color: theme?.palette?.main_layout?.primary_text,
              marginBottom: '16px',
              marginTop: '0px',
              fontFamily: 'inter',
            }}
          >
            Devices Efficiency Heatmap
          </p>
          {/* <CustomSelector options={months} /> */}
        </div>
        <div
          style={{
            height: '100%',
            minHeight: '340px',
            overflowY: 'auto',
            paddingBottom: '10px',
          }}
        >
          <HeatmapChart
            racks={racks}
            siteId={siteId}
            parent="newDashboard"
            devices={co2PcrDevicesData}
          />
        </div>
        <div style={{ padding: '0px 10px 15px 10px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              height: '15px',
            }}
          >
            {/* <div
            style={{
              color: theme?.palette?.main_layout?.primary_text,
              marginLeft: 5,
              marginTop: 15,
              fontSize: '15px',
              fontWeight: '500',
              lineHeight: '20px',
            }}
          >
            Racks by Space
          </div> */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-evenly',
                width: '350px',
                paddingTop: '15px',
              }}
            >
              <p
                style={{
                  color: theme?.palette?.main_layout?.primary_text,
                }}
              >
                Higher
              </p>
              <div
                style={{
                  // background: '#249b38',
                  background: '#24D9B3',
                  height: '15px',
                  width: '15px',
                  borderRadius: '100%',
                }}
              ></div>
              <p
                style={{
                  color: theme?.palette?.main_layout?.primary_text,
                }}
              >
                Lower{' '}
              </p>

              <div
                style={{
                  // background: '#7a0802',
                  // background: '#fb0200',
                  //   background: '#9B1E1E',
                  background: '#ED3A31',
                  height: '15px',
                  width: '15px',
                  borderRadius: '100%',
                }}
              ></div>

              <p
                style={{
                  color: theme?.palette?.main_layout?.primary_text,
                }}
              >
                Medium{' '}
              </p>

              <div
                style={{
                  background: ' #01A5DE',
                  //   background: '#203C75',
                  height: '15px',
                  width: '15px',
                  borderRadius: '100%',
                }}
              ></div>
            </div>
          </div>
        </div>
      </CustomCard>
    </CustomSpin>
  );
};

export default DevicesHeatMap;

import React, { useContext, useEffect, useState } from 'react';
import { Row, Col, Spin } from 'antd';

import CustomCard from '../../../components/customCard';
import { MdOutlineComputer } from 'react-icons/md';
import { styled, useTheme } from '@mui/material/styles';
import { AppContext } from '../../../context/appContext';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../../utils/axios/axiosInstance';
import { fetchInventoryCount } from '../../../services/dashboardServices/dashboardServices';
import { useDispatch } from 'react-redux';
import { setSelectedModule } from '../../../store/features/sidebarMenu/SidebarSlice';
import { IoIosTrendingUp } from 'react-icons/io';
import { MdDevices } from 'react-icons/md';
import { TbDeviceDesktop } from 'react-icons/tb';
import { BiDollarCircle } from 'react-icons/bi';
import { SiJsonwebtokens } from 'react-icons/si';
const DetailCardsSection = ({ siteId, metricsData }) => {
  // console.log('inventory Dashboard:::', counts);

  const theme = useTheme();
  const { themeMode, handleSetMenu } = useContext(AppContext);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // const { setSelectedMenuItem } = useContext(AppContext);

  const [data, setData] = React.useState(null);
  const [error, setError] = React.useState(null);
  const [pueLoading, setPueLoading] = useState(false);

  const getInventoryCount = async () => {
    setPueLoading(true);

    try {
      const response = await fetchInventoryCount(siteId);
      setData(response?.data?.data);
      setPueLoading(false);
    } catch (err) {
      setError(err);
    }
  };

  useEffect(() => {
    if (siteId) {
      getInventoryCount();
    }
  }, [siteId]);

  // Test code for navigaton:
  //   const countsConfigMap = {
  //     Sites: {
  //       route: '/main_layout/uam_module/sites',
  //       images: [
  //         totalDevices,
  //         totalDevicesLight,
  //         totalDevicesLightBlue,
  //         totalDevicesDarkGreen,
  //         totalDevicesDarkPurple,
  //         totalDevicesLightPurple,
  //       ],
  //     },
  //     Racks: {
  //       route: '/main_layout/uam_module/racks',
  //       images: [
  //         racksDevice,
  //         racksDeviceLight,
  //         racksDeviceLightBlue,
  //         racksDeviceDarkGreen,
  //         racksDevicesDarkPurple,
  //         racksDevicesLightPurple,
  //       ],
  //     },
  //     Devices: {
  //       route: '/main_layout/uam_module/devices/devices',
  //       images: [
  //         onboardDevices,
  //         onboardDevicesLight,
  //         onboardDevicesLightBlue,
  //         onboardDevicesDarkGreen,
  //         onboardDevicesDarkPurple,
  //         onboardDevicesLightPurple,
  //       ],
  //     },
  //     Vendors: {
  //       route: '/main_layout/uam_module/Inventory2/cisco',
  //       images: [
  //         totalVendor,
  //         totalVendorLight,
  //         totalVendorLightBlue,
  //         totalVendorDarkGreen,
  //         totalVendorDarkPurple,
  //         totalVendorLightPurple,
  //       ],
  //     },
  //   };

  // End

  const cardStyle = {
    border: `1px solid ${theme?.palette?.default_card?.border}`,
    backgroundColor: theme?.palette?.default_card?.background,
    borderRadius: '7px',
    cursor: 'pointer',
    height: '120px',
    // display: 'flex',
    // justifyContent: 'center',
    // alignItems: 'center',
  };

  const renderCard = (name, count, icon, unit, onClick) => (
    <div
      style={{
        flex: `0 0  24%`,
        boxSizing: 'border-box',
      }}
    >
      <CustomCard style={cardStyle} onClick={onClick} parent={true}>
        <div
          style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '2rem',
            // marginTop: ` 10px`,
          }}
        >
          <div
            style={{
              //   width: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '8px',
              borderRadius: '4px',
              //   background: theme?.palette?.main_layout?.sideBar?.icon_bg,
              color: theme?.palette?.main_layout?.sideBar?.icon_color,
            }}
          >
            {icon}
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              // alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <p
              className="name"
              style={{
                fontSize: '14px',
                fontWeight: 500,
                marginBottom: '10px',
                marginTop: '0px',
                letterSpacing: '1%',
              }}
            >
              {name}
            </p>
            <p
              style={{
                fontSize: '24px',
                fontWeight: 700,
                color: theme?.palette?.main_layout?.secondary_text,
                marginBottom: '0px',
                marginTop: '0px',
              }}
            >
              {count}
              <span style={{ margin: '0px 5px' }}>{unit}</span>
            </p>
          </div>
        </div>
      </CustomCard>
    </div>
    // </Col>
  );

  const cardData = [
    {
      title: 'Total Device',
      count: metricsData?.total_devices || '0',
      icon: <TbDeviceDesktop size={32} />,
      unit: '',

      //   navigateTo: () => {
      //     dispatch(setSelectedModule('Devices Inventory'));
      //     navigate('/main_layout/uam_module/devices/devices');
      //   },
    },
    {
      title: 'Total Racks',
      count: metricsData?.total_rack || '0',
      icon: <MdDevices size={32} />,
      unit: '',
      //   navigateTo: () => {
      //     navigate('/main_layout/onboarding-devices/devices');
      //   },
    },
    {
      title: 'Total Vendor',
      count: metricsData?.total_vendors || '0',
      icon: <SiJsonwebtokens size={28} />,
      unit: '',
      //   navigateTo: () => {
      //     dispatch(setSelectedModule('Devices Inventory'));
      //     navigate('/main_layout/uam_module/Inventory2/cisco');
      //   },
    },
    {
      title: 'Cost Estimation',
      count: metricsData?.cost_estimation || '0',
      icon: (
        <BiDollarCircle
          size={32}
          //    color="#F82B2B"
        />
      ),
      unit: metricsData?.cost_unit,
      //   navigateTo: () => {
      //     dispatch(setSelectedModule('Devices Inventory'));
      //     navigate('/main_layout/uam_module/racks');
      //   },
    },
  ];

  return (
    <>
      <Row
        gutter={[16, 16]}
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          margin: '10px',
          // gap: '10px',
          justifyContent: 'space-between',
        }}
      >
        {/* My cards Data */}
        {cardData.map((card) =>
          renderCard(
            card.title,
            card.count,
            card.icon,
            card?.unit,
            card.navigateTo
          )
        )}
      </Row>
    </>
  );
};

export default DetailCardsSection;

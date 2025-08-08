import React, { useContext, useEffect, useState } from 'react';
import { Row, Col, Spin } from 'antd';
import totalDevices from '../../../resources/images/total-device.png';
import totalDevicesLight from '../../../resources/images/totalDevicesLight.png';
import totalDevicesLightBlue from '../../../resources/images/totalDevicesLightBlue.png';
import totalDevicesDarkGreen from '../../../resources/images/total-devce-dark-green.svg';
import totalDevicesDarkPurple from '../../../resources/images/total_devices_purple.png';
import totalDevicesLightPurple from '../../../resources/images/t_devices_purple_light.png';

import onboardDevices from '../../../resources/images/onboard-device.png';
import onboardDevicesLight from '../../../resources/images/onboardDevicesLight.png';
import onboardDevicesLightBlue from '../../../resources/images/onboardDevicesLightBlue.png';
import onboardDevicesDarkGreen from '../../../resources/images/onboard-device-dark-green.svg';
import onboardDevicesDarkPurple from '../../../resources/images/onboard_devices_purple.png';
import onboardDevicesLightPurple from '../../../resources/images/onboeard_devices_purple_light.png';

import racksDevice from '../../../resources/images/racks.png';
import racksDeviceLight from '../../../resources/images/racksDeviceLight.png';
import racksDeviceLightBlue from '../../../resources/images/racksDeviceLightBlue.png';
import racksDeviceDarkGreen from '../../../resources/images/racks-dark-green.svg';
import racksDevicesLightPurple from '../../../resources/images/rack_purple_light.png';
import racksDevicesDarkPurple from '../../../resources/images/racks_purple.png';

import totalVendor from '../../../resources/images/total-vendor.png';
import totalVendorLight from '../../../resources/images/totalVendorLight.png';
import totalVendorLightBlue from '../../../resources/images/totalVendorLightBlue.png';
import totalVendorDarkGreen from '../../../resources/images/total-vendor-dark-green.svg';
import totalVendorLightPurple from '../../../resources/images/t_vandor_purple_light.png';
import totalVendorDarkPurple from '../../../resources/images/total_vandor_purple.png';

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
const DetailCards = ({
  counts,
  report,
  inventoryDashboard,
  siteId,
  isPueMode = false,
  loading,
  updatedDashboard = false,
}) => {
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
  // old working img
  // const getImageSrc = (defaultImg, lightImg, lightBlueImg, darkGreenImg) => {
  //   if (report === 'true') return defaultImg;
  //   return themeMode.includes('light')
  //     ? themeMode.includes('green')
  //       ? lightImg
  //       : lightBlueImg
  //     : themeMode.includes('green')
  //       ? darkGreenImg
  //       : defaultImg;
  // };

  const getImageSrc = (
    defaultImg,
    lightGreenImg,
    lightBlueImg,
    darkGreenImg,
    darkPurpleImg,
    lightPurpleImg
  ) => {
    if (report === 'true') return defaultImg;

    if (themeMode.includes('light')) {
      if (themeMode.includes('green')) return lightGreenImg;
      if (themeMode.includes('purple')) return lightPurpleImg;
      return lightBlueImg;
    } else {
      if (themeMode.includes('green')) return darkGreenImg;
      if (themeMode.includes('purple')) return darkPurpleImg;
      return defaultImg; // dark-blue default
    }
  };

  // Test code for navigaton:
  const countsConfigMap = {
    Sites: {
      route: '/main_layout/uam_module/sites',
      images: [
        totalDevices,
        totalDevicesLight,
        totalDevicesLightBlue,
        totalDevicesDarkGreen,
        totalDevicesDarkPurple,
        totalDevicesLightPurple,
      ],
    },
    Racks: {
      route: '/main_layout/uam_module/racks',
      images: [
        racksDevice,
        racksDeviceLight,
        racksDeviceLightBlue,
        racksDeviceDarkGreen,
        racksDevicesDarkPurple,
        racksDevicesLightPurple,
      ],
    },
    Devices: {
      route: '/main_layout/uam_module/devices/devices',
      images: [
        onboardDevices,
        onboardDevicesLight,
        onboardDevicesLightBlue,
        onboardDevicesDarkGreen,
        onboardDevicesDarkPurple,
        onboardDevicesLightPurple,
      ],
    },
    Vendors: {
      route: '/main_layout/uam_module/Inventory2/cisco',
      images: [
        totalVendor,
        totalVendorLight,
        totalVendorLightBlue,
        totalVendorDarkGreen,
        totalVendorDarkPurple,
        totalVendorLightPurple,
      ],
    },
  };

  // End

  const cardStyle = {
    border:
      report === 'true'
        ? '2px solid lightgray'
        : `1px solid ${theme?.palette?.default_card?.border}`,
    backgroundColor:
      report === 'true'
        ? '2px solid lightgray'
        : theme?.palette?.default_card?.background,
    borderRadius: inventoryDashboard ? '0px' : '7px',
    cursor: 'pointer',
    height: '107px',
  };

  const renderCard = (name, count, imgSrc, onClick) => (
    // <Col xs={24} sm={12} lg={4} style={{ padding: '24px 10px' }}>
    // <Col
    //   xs={24}
    //   sm={12}
    //   md={8}
    //   lg={isPueMode ? 4 : 6} // 5 per row if true, 4 per row if false
    //   xl={isPueMode ? 4 : 6}
    //   style={{ padding: '10px' }}
    // >
    <div
      style={{
        flex: `0 0 ${isPueMode ? '19%' : '24%'}`, // 5 cards per row or 4
        // padding: '10px',
        boxSizing: 'border-box',
      }}
    >
      <CustomCard style={cardStyle} onClick={onClick}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'center',
            marginTop: `${isPueMode ? '0px' : '10px'}`,
          }}
        >
          {/* {!inventoryDashboard && !isPueMode ? <img src={imgSrc} alt="" /> : ''} */}
          {!inventoryDashboard && imgSrc ? <img src={imgSrc} alt="" /> : null}

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <p
              style={{
                fontSize: '24px',
                fontWeight: 700,
                // color:
                //   report === 'true'
                //     ? 'gray'
                //     : theme?.palette?.default_card?.color,
                color: theme?.palette?.main_layout?.secondary_text,
                marginBottom: '0px',
                marginTop: '0px',
              }}
            >
              {count}
            </p>
            <p
              className="name"
              style={{
                fontSize: '14px',
                fontWeight: 400,
                marginBottom: '0px',
                marginTop: '0px',
                letterSpacing: '1%',
              }}
            >
              {name}
            </p>
            {isPueMode ? (
              <p
                style={{
                  fontSize: '10px',
                  fontWeight: 300,
                  marginBottom: '0px',
                  marginTop: '5px',
                  color: '#14A166',
                }}
              >
                <span>
                  <IoIosTrendingUp />
                </span>{' '}
                <span>+12 vs last month</span>
              </p>
            ) : null}
          </div>
        </div>
      </CustomCard>
    </div>
    // </Col>
  );

  // const cardData = [
  //   {
  //     title: 'Total Device',
  //     count: data?.total_devices || '0',
  //     imageSrc: getImageSrc(
  //       totalDevices,
  //       totalDevicesLight,
  //       totalDevicesLightBlue,
  //       totalDevicesDarkGreen,
  //       totalDevicesDarkPurple,
  //       totalDevicesLightPurple
  //     ),

  //     navigateTo: () => {
  //       const matchedId = 'devices'; // or any logic to get the correct ID
  //       // handleSetMenu('devices');

  //       // handleSetMenu('racks');
  //       dispatch(setSelectedModule('Devices Inventory'));
  //       // localStorage.setItem('selectedContextItem', matchedId);
  //       navigate('/main_layout/uam_module/devices/devices');
  //     },
  //   },
  //   {
  //     title: 'Onboard Device',
  //     count: data?.onboarded_devices || '0',
  //     imageSrc: getImageSrc(
  //       onboardDevices,
  //       onboardDevicesLight,
  //       onboardDevicesLightBlue,
  //       onboardDevicesDarkGreen,
  //       onboardDevicesDarkPurple,
  //       onboardDevicesLightPurple
  //     ),
  //     navigateTo: () => {
  //       const matchedId = 'devices';
  //       // handleSetMenu('devices');
  //       // localStorage.setItem('selectedModule', 'Onboarded Devices');
  //       // dispatch(setSelectedModule('Onboarded Devices'));
  //       navigate('/main_layout/onboarding-devices/devices');
  //     },
  //   },
  //   isPueMode ? (
  //     {
  //       title: 'Total Vendor',
  //       count: data?.total_vendors || '0',
  //       imageSrc: getImageSrc(
  //         totalVendor,
  //         totalVendorLight,
  //         totalVendorLightBlue,
  //         totalVendorDarkGreen,
  //         totalVendorDarkPurple,
  //         totalVendorLightPurple
  //       ),

  //       navigateTo: () => {
  //         const matchedId = 'inventory'; // or any logic to get the correct ID
  //         // handleSetMenu('inventory');
  //         dispatch(setSelectedModule('Devices Inventory'));
  //         // localStorage.setItem('selectedContextItem', matchedId);
  //         navigate('/main_layout/uam_module/Inventory2/cisco');
  //       },
  //     }
  //   ) : (
  //     <></>
  //   ),
  //   {
  //     title: 'Racks',
  //     count: data?.total_racks || '0',
  //     imageSrc: getImageSrc(
  //       racksDevice,
  //       racksDeviceLight,
  //       racksDeviceLightBlue,
  //       racksDeviceDarkGreen,
  //       racksDevicesDarkPurple,
  //       racksDevicesLightPurple
  //     ),

  //     navigateTo: () => {
  //       const matchedId = 'racks'; // or any logic to get the correct ID
  //       // handleSetMenu('racks');
  //       // localStorage.setItem('selectedContextItem', matchedId);
  //       dispatch(setSelectedModule('Devices Inventory'));
  //       navigate('/main_layout/uam_module/racks');
  //       //   navigate('/main_layout/uam_module/racks');
  //     },
  //   },
  //   {
  //     title: 'Total Vendor',
  //     count: data?.total_vendors || '0',
  //     imageSrc: getImageSrc(
  //       totalVendor,
  //       totalVendorLight,
  //       totalVendorLightBlue,
  //       totalVendorDarkGreen,
  //       totalVendorDarkPurple,
  //       totalVendorLightPurple
  //     ),

  //     navigateTo: () => {
  //       const matchedId = 'inventory'; // or any logic to get the correct ID
  //       // handleSetMenu('inventory');
  //       dispatch(setSelectedModule('Devices Inventory'));
  //       // localStorage.setItem('selectedContextItem', matchedId);
  //       navigate('/main_layout/uam_module/Inventory2/cisco');
  //     },
  //   },
  // ];
  const cardData = [
    {
      title: 'Total Device',
      count: data?.total_devices || '0',
      imageSrc: getImageSrc(
        totalDevices,
        totalDevicesLight,
        totalDevicesLightBlue,
        totalDevicesDarkGreen,
        totalDevicesDarkPurple,
        totalDevicesLightPurple
      ),
      navigateTo: () => {
        dispatch(setSelectedModule('Devices Inventory'));
        navigate('/main_layout/uam_module/devices/devices');
      },
    },
    {
      title: 'Onboard Device',
      count: data?.onboarded_devices || '0',
      imageSrc: getImageSrc(
        onboardDevices,
        onboardDevicesLight,
        onboardDevicesLightBlue,
        onboardDevicesDarkGreen,
        onboardDevicesDarkPurple,
        onboardDevicesLightPurple
      ),
      navigateTo: () => {
        navigate('/main_layout/onboarding-devices/devices');
      },
    },
    {
      title: 'Racks',
      count: data?.total_racks || '0',
      imageSrc: getImageSrc(
        racksDevice,
        racksDeviceLight,
        racksDeviceLightBlue,
        racksDeviceDarkGreen,
        racksDevicesDarkPurple,
        racksDevicesLightPurple
      ),
      navigateTo: () => {
        dispatch(setSelectedModule('Devices Inventory'));
        navigate('/main_layout/uam_module/racks');
      },
    },
    {
      title: 'Total Vendor',
      count: data?.total_vendors || '0',
      imageSrc: getImageSrc(
        totalVendor,
        totalVendorLight,
        totalVendorLightBlue,
        totalVendorDarkGreen,
        totalVendorDarkPurple,
        totalVendorLightPurple
      ),
      navigateTo: () => {
        dispatch(setSelectedModule('Devices Inventory'));
        navigate('/main_layout/uam_module/Inventory2/cisco');
      },
    },
  ];
  const pueCardsData = [
    {
      title: 'Total Device',
      count: data?.total_devices || '0',
    },
    {
      title: 'Current Power (kW)',
      count: data?.onboarded_devices || '0',
    },
    {
      title: 'Efficiency Rating',
      count: data?.total_racks || '0',
    },
    {
      title: 'Data Utilization',
      count: data?.total_vendors || '0',
    },
    {
      title: 'CO2 Emission (Tons)',
      count: data?.total_vendors || '0',
    },
  ];

  // Add one more card if `isPueMode` is true
  // if (isPueMode) {
  //   cardData.push({
  //     title: 'CO2 Emission (Tons)',
  //     count: data?.total_vendors || '0',
  //     imageSrc: getImageSrc(
  //       totalVendor,
  //       totalVendorLight,
  //       totalVendorLightBlue,
  //       totalVendorDarkGreen,
  //       totalVendorDarkPurple,
  //       totalVendorLightPurple
  //     ),
  //     navigateTo: () => {
  //       dispatch(setSelectedModule('Devices Inventory'));
  //       navigate('/main_layout/uam_module/Inventory2/cisco');
  //     },
  //   });
  // }

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
        {/* {counts?.length > 0
          ? counts.map((count) =>
              renderCard(
                count?.name,
                count?.count || '0',
                getImageSrc(
                  totalDevices,
                  totalDevicesLight,
                  totalDevicesLightBlue,
                  totalDevicesDarkGreen
                ),
                () => navigate('/main_layout/uam_module/devices/devices')
              )
            )
          : cardData.map((card, index) =>
              renderCard(card.title, card.count, card.imageSrc, card.navigateTo)
            )} */}
        {/* working for Cards on dashbord */}
        {/* {counts?.length > 0
          ? counts.map((count) => {
              const config = countsConfigMap[count.name] || {};
              const [
                def,
                light,
                lightBlue,
                darkGreen,
                darkPurple,
                lightPurple,
              ] = config.images || [];
              const imgSrc = getImageSrc(
                def,
                light,
                lightBlue,
                darkGreen,
                darkPurple,
                lightPurple
              );
              return renderCard(count.name, count.count || '0', imgSrc, () => {
                const title =
                  count.name === 'Vendors'
                    ? 'inventory'
                    : count.name.toLowerCase();
                // handleSetMenu(title);
                localStorage.setItem('selectedContextItem', title);
                navigate(config.route || '/');
              });
            })
          : cardData.map((card) =>
              renderCard(card.title, card.count, card.imageSrc, card.navigateTo)
            )} */}
        {/* My cards Data */}
        {isPueMode
          ? pueCardsData.map((card) =>
              renderCard(card.title, card.count, null, card.navigateTo)
            )
          : counts?.length > 0
            ? counts.map((count) => {
                const config = countsConfigMap[count.name] || {};
                const [
                  def,
                  light,
                  lightBlue,
                  darkGreen,
                  darkPurple,
                  lightPurple,
                ] = config.images || [];
                const imgSrc = getImageSrc(
                  def,
                  light,
                  lightBlue,
                  darkGreen,
                  darkPurple,
                  lightPurple
                );
                return renderCard(
                  count.name,
                  count.count || '0',
                  imgSrc,
                  () => {
                    const title =
                      count.name === 'Vendors'
                        ? 'inventory'
                        : count.name.toLowerCase();
                    localStorage.setItem('selectedContextItem', title);
                    navigate(config.route || '/');
                  }
                );
              })
            : cardData.map((card) =>
                renderCard(
                  card.title,
                  card.count,
                  card.imageSrc,
                  card.navigateTo
                )
              )}
      </Row>
    </>
  );
};

export default DetailCards;

// import React from 'react';
// import CustomCard from '../../../../components/customCard.jsx';
// import HardwareLifeCycleGraph from '../../../../components/hardwareLifeCycleGraph.jsx';
// import { useNavigate } from 'react-router-dom';
// import { useTheme } from '@mui/material/styles';
// import { useSelector } from 'react-redux';
// import styled from 'styled-components';
// import CustomSpin from '../../../../components/CustomSpin.jsx';
// import { Tabs } from 'antd';
// import SoftwareLifeCycleGraph from '../../../../components/softwareLifeCycleGraph.jsx';
// import * as echarts from 'echarts';
// const StyledTabs = styled(Tabs)`
//   /* Remove default nav styles */
//   .ant-tabs-nav {
//     margin: 0;
//     border: none !important;
//     box-shadow: none !important;
//   }

//   .ant-tabs-nav::before {
//     display: none !important;
//   }

//   .ant-tabs-nav-list {
//     display: flex;
//     width: 100%;
//     flex-wrap: wrap;
//   }

//   /* Default tab style */
//   .ant-tabs-tab {
//     display: flex;
//     align-items: center;
//     width: 45%;
//     height: 54px;
//     padding: 4px 8px;
//     border-radius: 4px;
//     background-color: #0f1620;
//     border: none !important;

//     transition: none !important;
//     box-shadow: none !important;
//     outline: none !important;
//   }

//   /* Active tab style */
//   .ant-tabs-tab-active {
//     background-color: #141d2a;
//     border: 1px solid #34404b !important;
//   }

//   /* Tab button inside */
//   .ant-tabs-tab-btn {
//     display: flex;
//     align-items: center;
//     width: 100%;
//   }

//   /* Custom label structure */
//   .tab-label-wrapper {
//     display: flex;
//     justify-content: space-between;
//     align-items: center;
//     width: 100%;
//   }

//   .tab-label {
//     font-size: 14px;
//     font-weight: 400;
//     color: ${({ theme }) =>
//       theme?.palette?.available_options?.primary_text} !important;
//   }

//   .tab-number {
//     font-weight: 700;
//     color: #a855f7;
//     font-size: 24px;
//   }

//   /* Active tab label color override */
//   .ant-tabs-tab-active .tab-label {
//     color: ${({ theme }) =>
//       theme?.palette?.available_options?.primary_text} !important;
//   }

//   /* Remove blue ink bar */
//   .ant-tabs-ink-bar {
//     display: none !important;
//   }

//   /* Remove wrap shadow */
//   .ant-tabs-nav-wrap {
//     box-shadow: none !important;
//   }
// `;

// const HardwareLifeCycle = ({ siteName, newDashboard = false }) => {
//   const theme = useTheme();
//   const navigate = useNavigate();
//   const { pi } = useSelector((state) => state);
//   const loading = pi?.loading;
//   const piData = pi?.data;

//   const num_devices = piData?.num_devices;

//   const chartData = [
//     { value: piData?.hardware_eos_count, name: 'End of Sale' },
//     { value: piData?.hardware_eol_count, name: 'End of Life' },
//     { value: piData?.software_eos_count, name: 'End of Support' },
//   ];

//   const StyledButton = styled.button`
//     background: none;
//     border: none;
//     color: ${theme?.palette?.main_layout?.secondary_text};
//     cursor: pointer;
//     font-family: 'Inter', sans-serif;
//     width: 100px;
//     font-weight: 600;
//     font-size: 0.8rem;
//     padding: 10px 15px;
//     border-radius: 9999px;
//     transition: all 0.2s ease;
//     margin-left: 10px;

//     &:hover {
//       background: ${theme?.name?.includes('Purple')
//         ? 'linear-gradient(to right, #791b9c, #5454be)'
//         : theme?.palette?.main_layout?.secondary_text};
//       color: ${theme?.name?.includes('Purple')
//         ? theme?.palette?.default_button?.primary_text
//         : theme?.palette?.main_layout?.primary_text};
//       outline: none;
//     }
//   `;

//   // const StyledTabs = styled(Tabs)`
//   //   .ant-tabs-nav {
//   //     margin: 0;
//   //     border: none !important;
//   //     box-shadow: none !important;
//   //   }

//   //   .ant-tabs-nav::before {
//   //     border: none !important;
//   //   }

//   //   .ant-tabs-nav-list {
//   //     display: flex;
//   //     width: 100%;
//   //     flex-wrap: wrap;
//   //   }

//   //   .ant-tabs-tab {
//   //     display: flex;
//   //     align-items: center;
//   //     border-radius: 8px;
//   //     padding: 8px;
//   //     background-color: #0f1620;
//   //     border: none !important;
//   //     color: #aaa;

//   //     /* ✅ Remove transition */
//   //     transition: none !important;

//   //     flex: 1;
//   //     box-shadow: none !important;
//   //     outline: none !important;
//   //     height: 54px;
//   //   }

//   //   .ant-tabs-tab-active {
//   //     background-color: #141d2a;
//   //     border: 1px solid #34404b;
//   //     color: #fff;
//   //     box-shadow: none !important;
//   //     flex: 1;
//   //     box-shadow: none !important;
//   //     outline: none !important;
//   //     height: 54px;
//   //   }

//   //   .ant-tabs-tab-btn {
//   //     display: flex;
//   //     align-items: center;
//   //     width: 100%;
//   //   }

//   //   .tab-label-wrapper {
//   //     display: flex;
//   //     width: 100%;
//   //     justify-content: space-between;
//   //     align-items: center;
//   //   }

//   //   .tab-label {
//   //     font-size: 14px;
//   //     color: ${({ theme }) =>
//   //       theme?.palette?.available_options?.primary_text} !important;
//   //     font-weight: 400;
//   //   }

//   //   .tab-number {
//   //     font-weight: 700;
//   //     color: #a855f7;
//   //     font-size: 24px;
//   //   }

//   //   .ant-tabs-tab-active .tab-label {
//   //     color: ${({ theme }) =>
//   //       theme?.palette?.available_options?.primary_text} !important;
//   //   }

//   //   .ant-tabs-ink-bar {
//   //     display: none !important; /* hides the bottom blue line */
//   //   }

//   //   .ant-tabs-nav-wrap {
//   //     box-shadow: none !important;
//   //   }
//   // `;

//   const items = [
//     {
//       key: '1',
//       label: (
//         <div className="tab-label-wrapper">
//           <div className="tab-label">Hardware</div>
//           <div className="tab-number">53</div>
//         </div>
//       ),
//       children: (
//         <HardwareLifeCycleGraph
//           num_devices={num_devices}
//           chartData={chartData}
//           newDashboard={newDashboard}
//           chartId="hardware-life-cycle-chart"
//         />
//       ),
//     },
//     {
//       key: '2',
//       label: (
//         <div className="tab-label-wrapper">
//           <div className="tab-label">Software</div>
//           <div className="tab-number">34</div>
//         </div>
//       ),
//       children: (
//         <SoftwareLifeCycleGraph
//           num_devices={num_devices}
//           chartData={chartData}
//           newDashboard={newDashboard}
//           chartId="software-life-cycle-chart"
//         />
//       ),
//     },
//   ];

//   // const onChange = (key) => {
//   //   console.log('Selected tab:', key);
//   // };
//   const onChange = (key) => {
//     setTimeout(() => {
//       const chartId =
//         key === '1' ? 'hardware-life-cycle-chart' : 'software-life-cycle-chart';
//       const chartDom = document.getElementById(chartId);
//       if (chartDom) {
//         const chartInstance = echarts.getInstanceByDom(chartDom);
//         if (chartInstance) {
//           chartInstance.resize();
//         }
//       }
//     }, 100);
//   };

//   return (
//     // <CustomSpin spinning={loading}>
//     <CustomCard
//       style={{
//         border: `1px solid ${theme?.palette?.default_card?.border}`,
//         backgroundColor: theme?.palette?.main_layout?.background,
//         borderRadius: '7px',
//         position: 'relative',
//       }}
//     >
//       <div
//         style={{
//           display: 'flex',
//           justifyContent: 'space-between',
//           alignItems: 'center',
//           marginBottom: '7px',
//         }}
//       >
//         <p
//           style={{
//             fontSize: '16px',
//             color: theme?.palette?.main_layout?.primary_text,
//             marginBottom: '0px',
//             marginTop: '0px',
//             fontFamily: 'inter',
//           }}
//         >
//           <span
//             style={{
//               color: theme?.palette?.main_layout?.secondary_text,
//             }}
//           >
//             {newDashboard ? '' : siteName}{' '}
//           </span>
//           Lifecycle
//         </p>

//         {!newDashboard && (
//           <StyledButton
//             onClick={() => navigate('/main_layout/uam_module/devices/devices')}
//           >
//             See Details
//           </StyledButton>
//         )}
//       </div>

//       {newDashboard ? (
//         <StyledTabs
//           theme={theme}
//           defaultActiveKey="1"
//           items={items}
//           onChange={onChange}
//         />
//       ) : (
//         <HardwareLifeCycleGraph
//           num_devices={num_devices}
//           chartData={chartData}
//           newDashboard={newDashboard}
//         />
//       )}
//     </CustomCard>
//     // </CustomSpin>
//   );
// };

// export default HardwareLifeCycle;

import React from 'react';
import CustomCard from '../../../../components/customCard.jsx';
import HardwareLifeCycleGraph from '../../../../components/hardwareLifeCycleGraph.jsx';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import CustomSpin from '../../../../components/CustomSpin.jsx';
import { Tabs } from 'antd';
import SoftwareLifeCycleGraph from '../../../../components/softwareLifeCycleGraph.jsx';
import * as echarts from 'echarts';
const StyledTabs = styled(Tabs)`
  /* Remove default nav styles */
  .ant-tabs-nav {
    margin: 0;
    border: none !important;
    box-shadow: none !important;
  }

  .ant-tabs-nav::before {
    display: none !important;
  }

  .ant-tabs-nav-list {
    display: flex;
    width: 100%;
    flex-wrap: wrap;
  }

  /* Default tab style */
  .ant-tabs-tab {
    display: flex;
    align-items: center;
    width: 45%;
    height: 54px;
    padding: 4px 8px;
    border-radius: 4px;
    background-color: #0f1620;
    border: none !important;

    transition: none !important;
    box-shadow: none !important;
    outline: none !important;
  }

  /* Active tab style */
  .ant-tabs-tab-active {
    background-color: #141d2a;
    border: 1px solid #34404b !important;
  }

  /* Tab button inside */
  .ant-tabs-tab-btn {
    display: flex;
    align-items: center;
    width: 100%;
  }

  /* Custom label structure */
  .tab-label-wrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
  }

  .tab-label {
    font-size: 14px;
    font-weight: 400;
    color: ${({ theme }) =>
      theme?.palette?.available_options?.primary_text} !important;
  }

  .tab-number {
    font-weight: 700;
    color: #a855f7;
    font-size: 24px;
  }

  /* Active tab label color override */
  .ant-tabs-tab-active .tab-label {
    color: ${({ theme }) =>
      theme?.palette?.available_options?.primary_text} !important;
  }

  /* Remove blue ink bar */
  .ant-tabs-ink-bar {
    display: none !important;
  }

  /* Remove wrap shadow */
  .ant-tabs-nav-wrap {
    box-shadow: none !important;
  }
`;

const HardwareLifeCycle = ({ siteName, newDashboard = false }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { pi } = useSelector((state) => state);
  const loading = pi?.loading;
  const piData = pi?.data;
  const [activeView, setActiveView] = React.useState('hardware'); // 'hardware' | 'software'

  const num_devices = piData?.num_devices;
  // const chartData =
  //   activeView === 'hardware' ? hardwareChartData : softwareChartData;
  // const chartData = [
  //   { value: piData?.hardware_eos_count, name: 'End of Sale' },
  //   { value: piData?.hardware_eol_count, name: 'End of Life' },
  //   { value: piData?.software_eos_count, name: 'End of Support' },
  // ];

  const StyledButton = styled.button`
    background: none;
    border: none;
    color: ${theme?.palette?.main_layout?.secondary_text};
    cursor: pointer;
    font-family: 'Inter', sans-serif;
    width: 100px;
    font-weight: 600;
    font-size: 0.8rem;
    padding: 10px 15px;
    border-radius: 9999px;
    transition: all 0.2s ease;
    margin-left: 10px;

    &:hover {
      background: ${theme?.name?.includes('Purple')
        ? 'linear-gradient(to right, #791b9c, #5454be)'
        : theme?.palette?.main_layout?.secondary_text};
      color: ${theme?.name?.includes('Purple')
        ? theme?.palette?.default_button?.primary_text
        : theme?.palette?.main_layout?.primary_text};
      outline: none;
    }
  `;
  const TabButton = styled.button`
    display: flex;
    justify-content: space-between;
    align-items: center;
    // width: 45%;
    flex: 1;
    height: 54px;
    padding: 4px 8px;
    border-radius: 4px;
    background-color: #0f1620;
    color: ${theme?.palette?.available_options?.primary_text};
    transition: none !important;
    box-shadow: none !important;
    outline: none !important;
  `;

  // const items = [
  //   {
  //     key: '1',
  //     label: (
  //       <div className="tab-label-wrapper">
  //         <div className="tab-label">Hardware</div>
  //         <div className="tab-number">53</div>
  //       </div>
  //     ),
  //     children: (
  //       <HardwareLifeCycleGraph
  //         num_devices={num_devices}
  //         chartData={chartData}
  //         newDashboard={newDashboard}
  //         chartId="hardware-life-cycle-chart"
  //       />
  //     ),
  //   },
  //   {
  //     key: '2',
  //     label: (
  //       <div className="tab-label-wrapper">
  //         <div className="tab-label">Software</div>
  //         <div className="tab-number">34</div>
  //       </div>
  //     ),
  //     children: (
  //       <SoftwareLifeCycleGraph
  //         num_devices={num_devices}
  //         chartData={chartData}
  //         newDashboard={newDashboard}
  //         chartId="software-life-cycle-chart"
  //       />
  //     ),
  //   },
  // ];

  // const onChange = (key) => {
  //   console.log('Selected tab:', key);
  // };
  // const onChange = (key) => {
  //   setTimeout(() => {
  //     const chartId =
  //       key === '1' ? 'hardware-life-cycle-chart' : 'software-life-cycle-chart';
  //     const chartDom = document.getElementById(chartId);
  //     if (chartDom) {
  //       const chartInstance = echarts.getInstanceByDom(chartDom);
  //       if (chartInstance) {
  //         chartInstance.resize();
  //       }
  //     }
  //   }, 100);
  // };

  const hardwareChartData = [
    { name: 'End of Sale', value: 33 },
    { name: 'End of Support', value: 40 },
    { name: 'End of Life', value: 27 },
  ];

  const softwareChartData = [
    { name: 'End of Sale', value: 20 },
    { name: 'End of Support', value: 35 },
    { name: 'End of Life', value: 45 },
  ];
  const chartData =
    activeView === 'hardware' ? hardwareChartData : softwareChartData;
  console.log('chart data for hardware', chartData);
  return (
    // <CustomSpin spinning={loading}>
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
          marginBottom: '7px',
        }}
      >
        <p
          style={{
            fontSize: '16px',
            color: theme?.palette?.main_layout?.primary_text,
            marginBottom: '0px',
            marginTop: '0px',
            fontFamily: 'inter',
          }}
        >
          <span
            style={{
              color: theme?.palette?.main_layout?.secondary_text,
            }}
          >
            {newDashboard ? '' : siteName}{' '}
          </span>
          Lifecycle
        </p>

        {!newDashboard && (
          <StyledButton
            onClick={() => navigate('/main_layout/uam_module/devices/devices')}
          >
            See Details
          </StyledButton>
        )}
      </div>
      {newDashboard ? (
        <>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
            <TabButton
              onClick={() => setActiveView('hardware')}
              style={{
                backgroundColor:
                  activeView === 'hardware' ? '#141D2A' : '#0F1620',
                border:
                  activeView === 'hardware' ? '1px solid #34404b' : 'none',
              }}
            >
              <span> Hardware</span>
              <span
                style={{
                  fontSize: '20px',
                  fontWeight: 600,
                  color: theme?.palette?.shades?.purple,
                }}
              >
                45
              </span>
            </TabButton>
            <TabButton
              onClick={() => setActiveView('software')}
              style={{
                backgroundColor:
                  activeView === 'software' ? '#141D2A' : '#0F1620',
                border:
                  activeView === 'software' ? '1px solid #34404b' : 'none',
              }}
            >
              <span> Software</span>
              <span
                style={{
                  fontSize: '20px',
                  fontWeight: 600,
                  color: theme?.palette?.shades?.purple,
                }}
              >
                34
              </span>
            </TabButton>
          </div>

          <HardwareLifeCycleGraph
            num_devices={num_devices}
            chartData={chartData}
            newDashboard={newDashboard}
            chartId="life-cycle-chart"
          />
        </>
      ) : (
        <HardwareLifeCycleGraph
          num_devices={num_devices}
          chartData={chartData}
          newDashboard={newDashboard}
        />
      )}

      {/* {newDashboard ? (
        <StyledTabs
          theme={theme}
          defaultActiveKey="1"
          items={items}
          onChange={onChange}
        />
      ) : (
        <HardwareLifeCycleGraph
          num_devices={num_devices}
          chartData={chartData}
          newDashboard={newDashboard}
        />
      )} */}
    </CustomCard>
    // </CustomSpin>
  );
};

export default HardwareLifeCycle;

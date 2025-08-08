import { Col, Row, Spin } from 'antd';
import React, { useEffect, useState } from 'react';
import CustomCard from '../../../components/customCard';
import { useTheme, styled } from '@mui/material/styles';
import SiteEnergyConsumptionBarChart from '../../../components/siteEnergyConsumptionBarChart';
import EChartComponent from '../../../components/inventoryDashboard/barChart';
import DifferentColorBarChart from '../../../components/inventoryDashboard/differentColorBarChart';
import KpiSelector from '../../dashboardModule/dashboard/kpiSelector';
import DefaultPiChart from '../../../components/inventoryDashboard/defaultPiChart';
import DefaultTable from '../../../components/tables';
import CustomTable from '../../../components/customTable';

import { Select } from 'antd';
import DetailCards from '../../dashboardModule/dashboard/detailCards';
import DefaultSelector from '../../../components/defaultSelector';
import { IoExpand } from 'react-icons/io5';
import axios from 'axios';
import { baseUrl } from '../../../utils/axios';
import { fetchRacksAsync } from '../../../store/features/uamModule/racks/slices/racksSlice';
import { useDispatch, useSelector } from 'react-redux';
import { IoReturnUpBack } from 'react-icons/io5';
import { Expand } from '@mui/icons-material';
import EnergyEfficiencyOverall from '../../../components/energyEfficiencyOverall';
import CustomLineGraph from '../../../components/inventoryDashboard/lineGraph';
import { customFilter } from '../../../utils/helpers';
import MultiLineGraph from '../../../components/inventoryDashboard/multiLineGraph';
import ScoreCardModels from '../../dashboardModule/dashboard/components/scorecardPerModel';
import CustomSpin from '../../../components/CustomSpin';
const { Option } = Select;

const durations = [
  {
    value: '24 hours',
    label: '24 hours',
  },
  {
    value: '7 Days',
    label: '7 Days',
  },

  {
    value: 'Last Month',
    label: 'Last Month',
  },
  {
    value: 'Current Month',
    label: 'Current Month',
  },
  { value: 'First Quarter', label: 'First Quarter' },
  { value: 'Second Quarter', label: 'Second Quarter' },
  { value: 'Third Quarter', label: 'Third Quarter' },
  {
    value: 'Last 3 Months',
    label: 'Last 3 Months',
  },
  {
    value: 'Last 6 Months',
    label: 'Last 6 Months',
  },
  {
    value: 'Last 9 Months',
    label: 'Last 9 Months',
  },
  {
    value: 'Last Year',
    label: 'Last Year',
  },
  {
    value: 'Current Year',
    label: 'Current Year',
  },
];
const DashboardInventory = () => {
  const access_token = localStorage.getItem('access_token');
  const dispatch = useDispatch();
  const theme = useTheme();
  const [selectedTime, setSelectedTime] = useState(null); // Track selected value

  const [isTable, setIsTable] = useState(false);
  const [isExpand, setIsExpand] = useState(false);

  const [sites, setSites] = useState();
  const [siteId, setSiteId] = useState(null);
  const [vendorId, setVendorId] = useState(null);
  const [rackId, setRackId] = useState(null);

  const [siteId4, setSiteId4] = useState(null);
  const [vendorId4, setVendorId4] = useState(null);
  const [vendorId5, setVendorId5] = useState();

  const [rackId4, setRackId4] = useState(null);
  const [rackId5, setRackId5] = useState();

  const [physicalVsVirtualData, setPhysicalVsVirtualData] = useState([]);
  const [siteId2, setSiteId2] = useState(null);
  const [siteId3, setSiteId3] = useState();

  const [vendorId2, setVendorId2] = useState(null);
  const [rackId2, setRackId2] = useState(null);

  const [counts, setCounts] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [vendorName, setVendorName] = useState(null);
  const [siteName, setSiteName] = useState(null);
  const [rackName, setRackName] = useState(null);
  const [rackName5, setRackName5] = useState(null);

  const [vendorName2, setVendorName2] = useState(null);
  const [siteName2, setSiteName2] = useState(null);
  const [siteName3, setSiteName3] = useState(null);
  const [rackName2, setRackName2] = useState(null);

  const [siteName4, setSiteName4] = useState(null);
  const [rackName4, setRackName4] = useState(null);
  const [vendorName4, setVendorName4] = useState(null);
  const [vendorName5, setVendorName5] = useState(null);

  const [duration, setDuration] = useState('24 hours');
  const [duration2, setDuration2] = useState('24 hours');

  const [modelCount, setModelCount] = useState([]);
  const [modelCount2, setModelCount2] = useState([]);
  const [countsByModelData, setCountsByModelData] = useState([]);

  const [model, setModel] = useState();
  const [filteredValue, setFilteredValue] = useState('15');
  const [filteredValue2, setFilteredValue2] = useState('15');
  const [filteredValue3, setFilteredValue3] = useState('15');

  // ---------loader's states----------
  const [loader1, setLoader1] = useState(false);
  const [loader2, setLoader2] = useState(false);
  const [loader3, setLoader3] = useState(false);
  const [loader4, setLoader4] = useState(false);

  const [deviceTypeCount, setDeviceTypeCount] = useState([]);
  const [vendorsCounts, setVendorsCounts] = useState([]);
  const [filterName, setFilterName] = useState('Top 15');
  const [filterName2, setFilterName2] = useState('Top 15');
  const [filterName3, setFilterName3] = useState('Top 15');

  const racks = useSelector((state) => state.racks?.racks);

  const filteredData = modelCount.slice(0, parseInt(filteredValue, 10));
  const filteredData2 = modelCount.slice(0, parseInt(filteredValue2, 10));
  const [filteredData3, setFilteredData3] = useState([]);

  const updatedCountsByModelData = countsByModelData?.slice(
    0,
    parseInt(filteredValue3, 10)
  );
  // const xyz = modelCount.slice(0, parseInt(filteredValue3, 10));
  // const [filteredData4, setFilteredData4] = useState([]);

  const updatedRacks = racks?.map((item) => {
    return {
      label: item?.rack_name,
      value: item?.id,
    };
  });

  const filterOptions = [
    {
      value: '5',
      label: 'Top 5',
    },
    {
      value: '10',
      label: 'Top 10',
    },
    {
      value: '15',
      label: 'Top 15',
    },
    {
      value: '20',
      label: 'Top 20',
    },
    {
      value: '25',
      label: 'Top 25',
    },
    // {
    //   value: "30",
    //   label: "Top 30",
    // },
    // {
    //   value: "35",
    //   label: "Top 35",
    // },
    // {
    //   value: "40",
    //   label: "Top 40",
    // },
    // {
    //   value: "45",
    //   label: "Top 45",
    // },
    // {
    //   value: "50",
    //   label: "Top 50",
    // },
  ];

  // const byOptions = [
  //   {
  //     value: 'Make',
  //     label: 'Make',
  //   },
  //   {
  //     value: 'Model',
  //     label: 'Model',
  //   },

  //   {
  //     value: 'RU height',
  //     label: 'RU height',
  //   },
  //   {
  //     value: 'Weight',
  //     label: 'Weight',
  //   },
  //   { value: 'Mounting', label: 'Mounting' },
  //   { value: 'Form Factor', label: 'Form Factor' },
  //   { value: 'Data Ports Count', label: 'Data Ports Count' },
  //   {
  //     value: 'Power Ports Count',
  //     label: 'Power Ports Count',
  //   },
  //   {
  //     value: 'My Company Standard',
  //     label: 'My Company Standard',
  //   },
  //   {
  //     value: 'Library Version',
  //     label: 'Library Version',
  //   },
  // ];
  // const classOptions = [
  //   {
  //     value: 'Cabinet',
  //     label: 'Cabinate',
  //   },
  //   {
  //     value: 'CRAC',
  //     label: 'CRAC',
  //   },

  //   {
  //     value: 'CRAC Group',
  //     label: 'CRAC Group',
  //   },
  //   {
  //     value: 'Data Panel',
  //     label: 'Data Panel',
  //   },
  //   { value: 'Device', label: 'Device' },
  //   { value: 'Floor PDU', label: 'Floor PDU' },
  //   { value: 'Network', label: 'Network' },
  //   {
  //     value: 'Passive',
  //     label: 'Passive',
  //   },
  //   {
  //     value: 'Perforated Tiles',
  //     label: 'Perforated Tiles',
  //   },
  //   {
  //     value: 'Power Outlet',
  //     label: 'Power Outlet',
  //   },
  // ];

  const [filter, setFilter] = useState({});

  const handleFilterChange = (key, value) => {
    setFilter((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleTimeChange = (value) => {
    setSelectedTime(value);
    if (value) {
      // Filter dataSource based on selected value
      const filtered = countsByModelData?.filter((item) => item.time === value);
      setFilteredData3(filtered);
    } else {
      // If no value selected, reset to original data
      setFilteredData3([]);
    }
  };
  const filters = [
    {
      text: 'Maximum',
      value: 'max',
    },
    {
      text: 'Minimum',
      value: 'min',
    },
    {
      text: 'Average',
      value: 'avrage',
    },
  ];
  // const columns = [

  //   {
  //     title: (
  //       <div>
  //         <DefaultSelector
  //           table="true"
  //           options={[
  //             {
  //               label: "John",
  //               value: "John",
  //             },
  //             {
  //               label: "Jane",
  //               value: "jane",
  //             },
  //             {
  //               label: "John-3",
  //               value: "John-3",
  //             },
  //           ]}
  //           // onChange={handleChange}
  //           // value={siteName}
  //           placeholder="Name"
  //         />
  //       </div>
  //     ),
  //     dataIndex: "name",
  //     key: "name",
  //   },
  //   {
  //     title: (
  //       <div>
  //         <DefaultSelector
  //           table="true"
  //           options={[
  //             {
  //               label: "25",
  //               value: "25",
  //             },
  //             {
  //               label: "30",
  //               value: "30",
  //             },
  //             {
  //               label: "35",
  //               value: "35",
  //             },
  //           ]}
  //           // onChange={handleChange}
  //           // value={siteName}
  //           placeholder="Age"
  //         />
  //       </div>
  //     ),
  //     dataIndex: "age",
  //     key: "age",
  //   },
  //   {
  //     title: (
  //       <div>
  //         <DefaultSelector
  //           table="true"
  //           options={[
  //             {
  //               label: "New York",
  //               value: "New York",
  //             },
  //             {
  //               label: "London",
  //               value: "London",
  //             },
  //           ]}
  //           // onChange={handleChange}
  //           // value={siteName}
  //           placeholder="Address"
  //         />
  //       </div>
  //     ),
  //     dataIndex: "address",
  //     key: "address",
  //   },
  // ];
  const columns = [
    // {
    //   title: 'IP Address',
    //   dataIndex: 'ip_address',
    //   key: 'ip_address',
    //   render: (value) => value ?? 'N/A',
    // },
    // {
    //   title: 'Device Name',
    //   dataIndex: 'device_name',
    //   key: 'device_name',
    //   render: (value) => value ?? 'N/A',
    // },
    {
      title: 'Model',
      dataIndex: 'model_no',
      key: 'model_no',
    },
    {
      title: 'Model Count',
      dataIndex: 'model_count',
      key: 'model_count',
    },
    {
      title: 'Energy Efficiency',
      dataIndex: 'energy_efficiency',
      key: 'energy_efficiency',
      render: (value) => value ?? 'N/A',
      filters: filters,
      onFilter: (filterValue, record) =>
        customFilter(
          filterValue,
          record,
          countsByModelData,
          'energy_efficiency'
        ),
    },
    {
      title: 'Total Power Output (POut)',
      dataIndex: 'avg_total_POut',
      key: 'avg_total_POut',
      filters: filters,
      onFilter: (filterValue, record) =>
        customFilter(filterValue, record, countsByModelData, 'avg_total_POut'),
    },
    {
      title: 'Total Power Input (PIn)',
      dataIndex: 'avg_total_PIn',
      key: 'avg_total_PIn',
      filters: filters,
      onFilter: (filterValue, record) =>
        customFilter(filterValue, record, countsByModelData, 'avg_total_PIn'),
    },

    {
      title: 'Site Name',
      dataIndex: 'site_name',
      key: 'site_name',
    },
    {
      title: 'Rack Name',
      dataIndex: 'rack_name',
      key: 'rack_name',
    },
    {
      title: 'Average CO₂ Emissions (Kgs)',
      dataIndex: 'avg_co2_emissions',
      key: 'avg_co2_emissions',
      filters: filters,
      onFilter: (filterValue, record) =>
        customFilter(
          filterValue,
          record,
          countsByModelData,
          'avg_co2_emissions'
        ),
    },
    {
      title: 'Average Data Traffic',
      dataIndex: 'avg_data_traffic',
      key: 'avg_data_traffic',
      render: (value) => value ?? 'N/A',
      filters: filters,
      onFilter: (filterValue, record) =>
        customFilter(
          filterValue,
          record,
          countsByModelData,
          'avg_data_traffic'
        ),
    },
  ];
  const siteNames = async () => {
    try {
      const res = await axios.get(baseUrl + '/sites/get_site_names', {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });

      if (res.status === 200) {
        setSites(
          res?.data?.data?.map((item) => {
            return {
              label: item?.site_name,
              value: item?.id,
            };
          })
        );
      }
    } catch (error) {
      console.log(' error', error);
    }
  };

  useEffect(() => {
    siteNames();
  }, []);

  const fetchCounts = async () => {
    try {
      const res = await axios.get(baseUrl + `/device_inventory/get_count`, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });
      if (res.status === 200) {
        console.log('fetchModelCount...', res);
        setCounts(res?.data?.data);
      }
    } catch (error) {}
  };

  const fetchVendors = async () => {
    try {
      const res = await axios.get(baseUrl + `/device_inventory/get_vendors`, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });
      if (res.status === 200) {
        console.log('fetched vendors...', res);
        setVendors(
          res?.data?.data?.map((vendor) => {
            return {
              label: vendor?.vendor_name,
              value: vendor?.id,
            };
          })
        );
      }
    } catch (error) {}
  };
  const fetchVendorsCounts = async () => {
    try {
      const res = await axios.get(
        baseUrl + `/device_inventory/get_vendor_count`,
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );
      if (res.status === 200) {
        console.log('vendors counts...', res);
        setVendorsCounts(res?.data?.data);
      }
    } catch (error) {}
  };

  const fetchModelCount = async () => {
    const payload = {
      site_id: siteId,
      rack_id: rackId,
      vendor_id: vendorId,
    };
    try {
      setLoader1(true);
      const res = await axios.post(
        baseUrl + `/device_inventory/get_model_Count`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );
      if (res.status === 200) {
        setLoader1(false);
        setModelCount(res?.data?.data);
        setModelCount2(res?.data?.data);
      }
    } catch (error) {
      setLoader1(false);
    }
  };

  const updatedModelCount =
    modelCount &&
    modelCount?.map((item) => {
      return {
        label: item?.model_name,
        value: item?.model_name,
      };
    });
  // useEffect(() => {
  //   setModel(modelCount[0]?.model_name);
  // }, []);
  const fetchDeviceByType = async () => {
    const payload = {
      site_id: siteId2,
      rack_id: rackId2,
      vendor_id: vendorId2,
    };
    try {
      setLoader2(true);
      const res = await axios.post(
        baseUrl + `/device_inventory/devicetype_count`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );
      if (res.status === 200) {
        setLoader2(false);
        // console.log("setDeviceTypeCount", res?.data?.data);

        setDeviceTypeCount(res?.data?.data);
      }
    } catch (error) {
      setLoader2(false);
    }
  };
  useEffect(() => {
    fetchDeviceByType();
  }, [siteId2, rackId2, vendorId2]);

  const fetchPhysicalVsVirtual = async () => {
    const payload = {
      site_id: siteId4,
      rack_id: rackId4,
      vendor_id: vendorId4,
    };
    try {
      setLoader4(true);
      const res = await axios.post(
        baseUrl + `/device_inventory/get_device_nature`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );
      if (res.status === 200) {
        setLoader4(false);
        // console.log("virtual data.....", res?.data?.data);

        setPhysicalVsVirtualData(res?.data?.data);
      }
    } catch (error) {
      setLoader4(false);
    }
  };

  useEffect(() => {
    fetchPhysicalVsVirtual();
  }, [siteId4, rackId4, vendorId4]);
  console.log('pgyVData', physicalVsVirtualData);

  useEffect(() => {
    fetchCounts();
    fetchVendors();
    fetchVendorsCounts();
    fetchModelCount();
    dispatch(fetchRacksAsync(access_token));
  }, []);

  useEffect(() => {
    fetchModelCount();
  }, [siteId, rackId, vendorId]);

  const fetchCountsByModel = async () => {
    try {
      setLoader3(true);
      const payload = {
        siteId: siteId3,
        // duration: duration2,
        rack_id: rackId5,
        // limit: Number(filteredValue3),
        // model_no: model,
        vendor_id: vendorId5,
      };
      const res = await axios.post(
        baseUrl + `/sites/sites/avg_energy_consumption_with_model_count`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );
      if (res.status === 200) {
        setLoader3(false);
        console.log('avg_energy_consumption_with_model_count', res);

        setCountsByModelData(res?.data);
      }
    } catch (error) {
      setCountsByModelData([]);
      setLoader3(false);
    }
  };
  // const fetchCountsByModel = async () => {
  //   try {
  //     setLoader3(true);
  //     const payload = {
  //       siteId: siteId3,
  //       duration: duration2,
  //       rack_id: rackId5,
  //       model_no: model,
  //     };
  //     const res = await axios.post(
  //       baseUrl + `/sites/sites/avg_energy_consumption_with_model_count`,
  //       payload,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${access_token}`,
  //         },
  //       }
  //     );
  //     if (res.status === 200) {
  //       setLoader3(false);
  //       console.log("avg_energy_consumption_with_model_count", res);

  //       setCountsByModelData(res?.data);
  //     }
  //   } catch (error) {
  //     setCountsByModelData([]);
  //     setLoader3(false);
  //   }
  // };

  useEffect(() => {
    // if (siteId) {
    fetchCountsByModel();
    // }
  }, [siteId3, rackId5]);
  const toggleGraph = () => {
    if (isExpand) {
      setIsExpand(false);
      setSiteId(null);
      setVendorId(null);
      setRackId(null);
    } else {
      setIsExpand(true);
      setSiteId(null);
      setVendorId(null);
      setRackId(null);
    }
  };
  const toggleTable = () => {
    setIsTable(!isTable);
  };
  const handleChangeSite = (value, option) => {
    setSiteName(option?.children);
    setSiteId(value);
  };
  const handleChangeRack = (value, option) => {
    setRackName(option?.children);
    setRackId(value);
  };
  const handleChangeVendor = (value, option) => {
    setVendorName(option?.children);
    setVendorId(value);
  };

  const handleChangeSite2 = (value, option) => {
    setSiteName2(option?.children);
    setSiteId2(value);
  };
  const handleChangeSite3 = (value, option) => {
    setSiteName3(option?.children);
    setSiteId3(value);
  };
  const handleChangeRack2 = (value, option) => {
    setRackName2(option?.children);
    setRackId2(value);
  };
  const handleChangeVendor2 = (value, option) => {
    setVendorName2(option?.children);
    setVendorId2(value);
  };

  const handleChangeSite4 = (value, option) => {
    setSiteName4(option?.children);
    setSiteId4(value);
  };
  const handleChangeRack4 = (value, option) => {
    setRackName4(option?.children);
    setRackId4(value);
  };
  const handleChangeRack5 = (value, option) => {
    setRackName5(option?.children);
    setRackId5(value);
  };
  const handleChangeVendor4 = (value, option) => {
    setVendorName4(option?.children);
    setVendorId4(value);
  };
  const handleChangeVendor5 = (value, option) => {
    setVendorName5(option?.children);
    setVendorId5(value);
  };

  const handleChangeModel = (value, option) => {
    // setModelName(option.children);
    setModel(value);
  };
  const handleChangeFilter = (value, option) => {
    setFilteredValue(value);
    setFilterName(option?.children);
  };
  const handleChangeFilter2 = (value, option) => {
    setFilteredValue2(value);
    setFilterName2(option?.children);
  };
  const handleChangeFilter3 = (value, option) => {
    setFilteredValue3(value);
    setFilterName3(option?.children);
  };
  const handleChangeDuration2 = (value) => {
    console.log(value);
    setDuration2(value);
  };
  // -----------------------
  const title = 'Stacked Area Chart Example';
  const xData = countsByModelData?.map((item) => item?.model_no);
  const powers = countsByModelData?.map((item) => item?.avg_total_PIn);
  const dataTraffic = countsByModelData?.map(
    (entry) => entry?.avg_data_traffic
  );
  const energyEfficiency = countsByModelData?.map(
    (entry) => entry?.avg_energy_efficiency
  );
  const co2Kgs = countsByModelData?.map((item) => item?.avg_co2_emissions);

  const legendData = [
    'Email',
    'Union Ads',
    'Video Ads',
    'Direct',
    'Search Engine',
  ];
  // const seriesData = countsByModelData;
  const seriesData = [
    {
      name: 'Input Power',
      type: 'line',
      stack: 'Total',
      areaStyle: {},
      emphasis: { focus: 'series' },
      data: powers,
    },
    {
      name: 'Data Traffic',
      type: 'line',
      stack: 'Total',
      areaStyle: {},
      emphasis: { focus: 'series' },
      data: dataTraffic,
    },
    {
      name: 'Energy Efficiency',
      type: 'line',
      stack: 'Total',
      areaStyle: {},
      emphasis: { focus: 'series' },
      data: energyEfficiency,
    },
    {
      name: 'Carbon Emission',
      type: 'line',
      stack: 'Total',
      areaStyle: {},
      emphasis: { focus: 'series' },
      data: co2Kgs,
    },
    // {
    //   name: "Search Engine",
    //   type: "line",
    //   stack: "Total",
    //   areaStyle: {},
    //   emphasis: { focus: "series" },
    //   data: [820, 932, 901, 934, 1290, 1330, 1320],
    // },
  ];

  return (
    <div style={{ width: '99%', margin: '0 auto', paddingTop: '8px' }}>
      <DetailCards counts={counts} inventoryDashboard="true" />
      {!isExpand ? (
        <Row>
          <Col xs={24} style={{ padding: '10px' }}>
            <CustomSpin spinning={loader1}>
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
                  }}
                >
                  <p
                    style={{
                      fontSize: '16px',
                      color: theme?.palette?.main_layout?.primary_text,
                      marginBottom: '10px',
                      marginTop: '-10px',
                      fontSize: '14px',
                      fontWeight: 500,
                      fontFamily: 'inter',
                    }}
                  >
                    Distribution of Devices Across Different Models
                  </p>

                  <IoExpand
                    onClick={toggleGraph}
                    style={{
                      fontSize: '16px',
                      color: theme?.palette?.main_layout?.primary_text,
                      marginBottom: '10px',
                      marginTop: '-20px',
                      fontSize: '14px',
                      fontWeight: 500,
                      fontFamily: 'inter',
                      padding: '5px',
                      backgroundColor:
                        theme?.palette?.default_select?.background,
                      cursor: 'pointer',
                    }}
                  />
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'end',
                    alignItems: 'center',
                    gap: '30px',
                  }}
                >
                  <KpiSelector
                    options={filterOptions}
                    onChange={handleChangeFilter2}
                    value={filteredValue2}
                  />
                </div>
                {modelCount?.length > 0 ? (
                  <EChartComponent
                    data={filteredData2 ? filteredData2 : modelCount2}
                  />
                ) : (
                  <div
                    style={{
                      height: '200px',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <p
                      style={{
                        color: theme?.palette?.main_layout?.primary_text,
                      }}
                    >
                      No data found
                    </p>
                  </div>
                )}
              </CustomCard>
            </CustomSpin>
          </Col>
        </Row>
      ) : (
        <Row>
          <Col xs={24} style={{ padding: '10px' }}>
            <CustomSpin spinning={loader1}>
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
                  }}
                >
                  <p
                    style={{
                      fontSize: '16px',
                      color: theme?.palette?.main_layout?.primary_text,
                      marginBottom: '10px',
                      marginTop: '-10px',
                      fontSize: '14px',
                      fontWeight: 500,
                      fontFamily: 'inter',
                    }}
                  >
                    Storage Inventory By Model
                  </p>

                  <IoReturnUpBack
                    onClick={toggleGraph}
                    style={{
                      fontSize: '16px',
                      color: theme?.palette?.main_layout?.primary_text,
                      marginBottom: '10px',
                      marginTop: '-20px',
                      fontSize: '14px',
                      fontWeight: 500,
                      fontFamily: 'inter',
                      padding: '5px',
                      backgroundColor:
                        theme?.palette?.default_select?.background,
                      cursor: 'pointer',
                    }}
                  />
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'end',
                    alignItems: 'center',
                    gap: '30px',
                  }}
                >
                  <DefaultSelector
                    options={sites}
                    onChange={handleChangeSite}
                    value={siteName}
                    placeholder="Select Site"
                  />

                  <DefaultSelector
                    options={updatedRacks}
                    onChange={handleChangeRack}
                    value={rackName}
                    placeholder="Select Rack"
                    disabled={!siteName}
                  />

                  <DefaultSelector
                    options={vendors}
                    onChange={handleChangeVendor}
                    value={vendorName}
                    placeholder="Select Vendor"
                    disabled={!rackName}
                  />

                  <KpiSelector
                    options={filterOptions}
                    onChange={handleChangeFilter}
                    value={filterName}
                  />
                </div>
                {modelCount?.length > 0 ? (
                  <EChartComponent
                    data={filteredData ? filteredData : modelCount}
                  />
                ) : (
                  <div
                    style={{
                      height: '200px',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <p
                      style={{
                        color: theme?.palette?.main_layout?.primary_text,
                      }}
                    >
                      No data found
                    </p>
                  </div>
                )}
              </CustomCard>
            </CustomSpin>
          </Col>
        </Row>
      )}
      <Row>
        <Col xs={24} xl={9} style={{ padding: '10px' }}>
          <CustomSpin spinning={loader2}>
            <CustomCard
              style={{
                border: `1px solid ${theme?.palette?.default_card?.border}`,
                backgroundColor: theme?.palette?.main_layout?.background,
                borderRadius: '7px',
              }}
            >
              <p
                style={{
                  fontSize: '16px',
                  color: theme?.palette?.main_layout?.primary_text,
                  marginBottom: '10px',
                  marginTop: '-10px',
                  fontSize: '14px',
                  fontWeight: 500,
                  fontFamily: 'inter',
                }}
              >
                Device Type Distribution
              </p>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'end',
                  alignItems: 'center',
                  gap: '30px',
                  marginBottom: '20px',
                }}
              >
                <DefaultSelector
                  options={sites}
                  onChange={handleChangeSite2}
                  value={siteName2}
                  placeholder="Select Site"
                />

                <DefaultSelector
                  options={updatedRacks}
                  onChange={handleChangeRack2}
                  value={rackName2}
                  placeholder="Select Rack"
                />

                <DefaultSelector
                  options={vendors}
                  onChange={handleChangeVendor2}
                  value={vendorName2}
                  placeholder="Select Vendor"
                />
              </div>

              <DefaultPiChart
                data={
                  deviceTypeCount &&
                  deviceTypeCount?.device_type_count?.map((item) => {
                    return { value: item?.count, name: item?.device_type };
                  })
                }
                title=""
                radius="78%"
                totalValue={deviceTypeCount?.count}
                // to be updated
                color={[
                  '#848ff5',
                  '#FD8B05',
                  '#0490e7',
                  '#6FAD5B',
                  '#dd3c56',
                  '#7b52db',
                ]}
              />
            </CustomCard>
          </CustomSpin>
        </Col>
        <Col xs={24} xl={9} style={{ padding: '10px' }}>
          <CustomSpin spinning={loader4}>
            <CustomCard
              style={{
                border: `1px solid ${theme?.palette?.default_card?.border}`,
                backgroundColor: theme?.palette?.main_layout?.background,
                borderRadius: '7px',
              }}
            >
              <p
                style={{
                  fontSize: '16px',
                  color: theme?.palette?.main_layout?.primary_text,
                  marginBottom: '10px',
                  marginTop: '-10px',
                  fontSize: '14px',
                  fontWeight: 500,
                  fontFamily: 'inter',
                }}
              >
                Network Devices: Physical vs Virtual Breakdown
              </p>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'end',
                  alignItems: 'center',
                  gap: '30px',
                  marginBottom: '20px',
                }}
              >
                <DefaultSelector
                  options={sites}
                  onChange={handleChangeSite4}
                  value={siteName4}
                  placeholder="Select Site"
                />

                <DefaultSelector
                  options={updatedRacks}
                  onChange={handleChangeRack4}
                  value={rackName4}
                  placeholder="Select Rack"
                />

                <DefaultSelector
                  options={vendors}
                  onChange={handleChangeVendor4}
                  value={vendorName4}
                  placeholder="Select Vendor"
                />
              </div>

              <DefaultPiChart
                data={physicalVsVirtualData?.device_nature_count?.map(
                  (item) => {
                    return { value: item?.count, name: item?.device_nature };
                  }
                )}
                title=""
                radius="78%"
                totalValue={physicalVsVirtualData?.total_count}
                // color={
                //   theme?.name?.includes('Purple')
                //     ? theme?.palette?.graph?.graph_area?.pi_graph
                //     : '#91CC75'
                // }
                color={
                  // theme?.palette?.main_layout?.secondary_text
                  theme?.name.includes('Purple')
                    ? ['#848ff5']
                    : theme?.name.includes('Green')
                      ? ['#40af48']
                      : [
                          `${theme?.palette?.graph?.graph_area?.secondary_tooltip}`,
                        ]
                }
              />
            </CustomCard>
          </CustomSpin>
        </Col>
        <Col xs={24} xl={6} style={{ padding: '10px' }}>
          <CustomSpin spinning={false}>
            <CustomCard
              style={{
                border: `1px solid ${theme?.palette?.default_card?.border}`,
                backgroundColor: theme?.palette?.main_layout?.background,
                borderRadius: '7px',
                height: '369px',
              }}
            >
              <p
                style={{
                  fontSize: '16px',
                  color: theme?.palette?.main_layout?.primary_text,
                  marginBottom: '60px',
                  marginTop: '-10px',
                  fontSize: '14px',
                  fontWeight: 500,
                  fontFamily: 'inter',
                }}
              >
                Vendors-Specific Inventory
              </p>

              <DefaultPiChart
                data={vendorsCounts?.vendor_data?.map((item) => {
                  return { value: item?.count, name: item?.vendor_name };
                })}
                title=""
                radius="78%"
                totalValue={vendorsCounts?.total_count}
                color={['#0490e7', '#83c5be']}
              />
            </CustomCard>
          </CustomSpin>
        </Col>
      </Row>

      <Row>
        <Col id="scorecard" xs={24}>
          <ScoreCardModels />
        </Col>
      </Row>

      {/* <Row>
        <Col xs={24}>
          <CustomCard
            style={{
              border: `1px solid ${theme?.palette?.default_card?.border}`,
              backgroundColor: theme?.palette?.main_layout?.background,
              borderRadius: "7px",
              margin: "10px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "10px",
              }}
            >
              <p
                style={{
                  fontSize: "16px",
                  color: theme?.palette?.main_layout?.primary_text,
                  fontSize: "16px",
                  fontWeight: 500,
                  fontFamily: "inter",
                  marginTop: "-10px",
                }}
              >
                Energy and Emissions Profile for Each Model
              </p>
              <div
                style={{
                  display: "flex",
                  justifyContent: "end",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <DefaultSelector
                  options={sites}
                  onChange={handleChangeSite3}
                  value={siteName3}
                  placeholder="Select Site"
                />

                <DefaultSelector
                  options={updatedModelCount}
                  onChange={handleChangeModel}
                  value={model}
                  placeholder="Select Model"
                />

                <DefaultSelector
                  options={updatedRacks}
                  onChange={handleChangeRack5}
                  value={rackName5}
                  placeholder="Select Rack"
                />
                // <KpiSelector
                //   options={durations}
                //   value={duration2}
                //   onChange={handleChangeDuration2}
                //   kpi="true"
                // />
              </div>
            </div>
            <MultiLineGraph
              title={title}
              xData={xData}
              legendData={legendData}
              seriesData={seriesData}
            />
          </CustomCard>
        </Col>
      </Row> */}
      <CustomSpin size="large" spinning={loader3}>
        <CustomCard
          style={{
            border: `1px solid ${theme?.palette?.default_card?.border}`,
            backgroundColor: theme?.palette?.main_layout?.background,
            borderRadius: '7px',
            margin: '10px',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '10px',
            }}
          >
            <p
              style={{
                fontSize: '16px',
                color: theme?.palette?.main_layout?.primary_text,
                fontSize: '16px',
                fontWeight: 500,
                fontFamily: 'inter',
                marginTop: '-10px',
              }}
            >
              Comprehensive Model Analysis
            </p>
            <div
              style={{
                display: 'flex',
                justifyContent: 'end',
                alignItems: 'center',
                gap: '10px',
              }}
            >
              <DefaultSelector
                options={sites}
                onChange={handleChangeSite3}
                value={siteName3}
                placeholder="Select Site"
              />

              {/* <DefaultSelector
                options={updatedModelCount}
                onChange={handleChangeModel}
                value={model}
                placeholder="Select Model"
              /> */}

              <DefaultSelector
                options={updatedRacks}
                onChange={handleChangeRack5}
                value={rackName5}
                placeholder="Select Rack"
                disabled={!siteName3}
              />
              <DefaultSelector
                options={vendors}
                onChange={handleChangeVendor5}
                value={vendorName5}
                disabled={!rackName5}
                placeholder="Select Vendor"
              />
              <KpiSelector
                options={filterOptions}
                onChange={handleChangeFilter3}
                value={filteredValue3}
              />
              {/* <KpiSelector
                options={durations}
                value={duration2}
                onChange={handleChangeDuration2}
                kpi="true"
              /> */}
            </div>
          </div>
          <Row>
            <Col xs={24} style={{ padding: '10px 0 0 0' }}>
              <CustomCard
                style={{
                  border: `1px solid ${theme?.palette?.default_card?.border}`,
                  backgroundColor: theme?.palette?.main_layout?.background,
                  borderRadius: '7px',
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
                      color: theme?.palette?.main_layout?.primary_text,
                      marginBottom: '10px',
                      marginTop: '-10px',
                      fontSize: '14px',
                      fontWeight: 500,
                      fontFamily: 'inter',
                    }}
                  >
                    Model Input Power
                  </p>

                  {/* <IoExpand
                    onClick={toggleTable}
                    style={{
                      fontSize: '16px',
                      color: theme?.palette?.main_layout?.primary_text,
                      marginBottom: '10px',
                      marginTop: '-20px',
                      fontSize: '14px',
                      fontWeight: 500,
                      fontFamily: 'inter',
                      padding: '5px',
                      backgroundColor:
                        theme?.palette?.default_select?.background,
                      cursor: 'pointer',
                    }}
                  /> */}
                </div>

                <DifferentColorBarChart
                  data={
                    updatedCountsByModelData?.length > 0
                      ? updatedCountsByModelData
                      : countsByModelData
                  }
                />
              </CustomCard>
            </Col>
            <Col xs={24} style={{ padding: '10px 0' }}>
              {isTable ? (
                <CustomSpin spinning={false}>
                  <CustomCard
                    style={{
                      border: `1px solid ${theme?.palette?.default_card?.border}`,
                      backgroundColor: theme?.palette?.main_layout?.background,
                      borderRadius: '7px',
                      position: 'relative',
                    }}
                  >
                    <p
                      style={{
                        fontSize: '16px',
                        color: theme?.palette?.main_layout?.primary_text,
                        marginBottom: '10px',
                        marginTop: '-10px',
                        fontSize: '14px',
                        fontWeight: 500,
                        fontFamily: 'inter',
                      }}
                    >
                      Models Analysis
                    </p>

                    <CustomTable
                      rowClassName={(record, index) =>
                        index % 2 === 0 ? 'even' : 'odd'
                      }
                      // padding="null"
                      columns={columns}
                      dataSource={
                        filteredData3?.length > 0
                          ? filteredData3
                          : countsByModelData
                      }
                      scroll={{ x: 1800 }}
                    />
                  </CustomCard>
                </CustomSpin>
              ) : null}
            </Col>
            <Col xs={24} xl={12} style={{ padding: '0px 10px 10px 0' }}>
              <CustomSpin spinning={false}>
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
                      Model-Specific Data Traffic Overview
                    </p>

                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'end',
                        gap: '10px',
                      }}
                    ></div>
                  </div>

                  <CustomLineGraph
                    data={
                      updatedCountsByModelData?.length > 0
                        ? updatedCountsByModelData
                        : countsByModelData
                    }
                    tooltipPostfix="GB"
                  />
                </CustomCard>
              </CustomSpin>
            </Col>
            <Col xs={24} xl={12} style={{ padding: '0px 0 10px 10px' }}>
              <CustomSpin spinning={false}>
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
                      Models-Specific Energy Efficiency
                    </p>

                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'end',
                        gap: '10px',
                      }}
                    ></div>
                  </div>

                  <CustomLineGraph
                    ee="true"
                    data={
                      updatedCountsByModelData?.length > 0
                        ? updatedCountsByModelData
                        : countsByModelData
                    }

                    // color='#6EAE5A'
                  />
                </CustomCard>
              </CustomSpin>
            </Col>
            <Col xs={24} style={{ padding: '10px 0 0 0' }}>
              <CustomSpin spinning={loader3}>
                <CustomCard
                  style={{
                    border: `1px solid ${theme?.palette?.default_card?.border}`,
                    backgroundColor: theme?.palette?.main_layout?.background,
                    borderRadius: '7px',
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
                        color: theme?.palette?.main_layout?.primary_text,
                        marginBottom: '10px',
                        marginTop: '-10px',
                        fontSize: '14px',
                        fontWeight: 500,
                        fontFamily: 'inter',
                      }}
                    >
                      <span
                        style={{
                          color: theme?.palette?.main_layout?.secondary_text,
                        }}
                      >
                        {model ? model : 'Model'}
                      </span>{' '}
                      Model Wise Carbon Footprint
                    </p>

                    {/* <IoExpand
                      onClick={toggleTable}
                      style={{
                        fontSize: "16px",
                        color: theme?.palette?.main_layout?.primary_text,
                        marginBottom: "10px",
                        marginTop: "-20px",
                        fontSize: "14px",
                        fontWeight: 500,
                        fontFamily: "inter",
                        padding: "5px",
                        backgroundColor:
                          theme?.palette?.default_select?.background,
                        cursor: "pointer",
                      }}
                    /> */}
                  </div>

                  <DifferentColorBarChart
                    co2="true"
                    data={
                      updatedCountsByModelData?.length > 0
                        ? updatedCountsByModelData
                        : countsByModelData
                    }
                  />
                </CustomCard>
              </CustomSpin>
            </Col>
          </Row>
        </CustomCard>
      </CustomSpin>

      {/* <Spin size="large" spinning={loader3}>
        <CustomCard
          style={{
            border: `1px solid ${theme?.palette?.default_card?.border}`,
            backgroundColor: theme?.palette?.main_layout?.background,
            borderRadius: "7px",
            margin: "10px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "10px",
            }}
          >
            <p
              style={{
                fontSize: "16px",
                color: theme?.palette?.main_layout?.primary_text,
                fontSize: "16px",
                fontWeight: 500,
                fontFamily: "inter",
                marginTop: "-10px",
              }}
            >
              Model Wise Visualization
            </p>
            <div
              style={{
                display: "flex",
                justifyContent: "end",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <DefaultSelector
                options={sites}
                onChange={handleChangeSite3}
                value={siteName3}
                placeholder="Select Site"
              />

              <DefaultSelector
                options={updatedModelCount}
                onChange={handleChangeModel}
                value={model}
                placeholder="Select Model"
              />

              <KpiSelector
                options={durations}
                value={duration2}
                onChange={handleChangeDuration2}
                kpi="true"
              />
            </div>
          </div>
          <Row>
            <Col xs={24} style={{ padding: "10px 0" }}>
              <CustomCard
                style={{
                  border: `1px solid ${theme?.palette?.default_card?.border}`,
                  backgroundColor: theme?.palette?.main_layout?.background,
                  borderRadius: "7px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <p
                    style={{
                      fontSize: "16px",
                      color: theme?.palette?.main_layout?.primary_text,
                      marginBottom: "10px",
                      marginTop: "-10px",
                      fontSize: "14px",
                      fontWeight: 500,
                      fontFamily: "inter",
                    }}
                  >
                    <span
                      style={{
                        color: theme?.palette?.main_layout?.secondary_text,
                      }}
                    >
                      {model ? model : "Model"}
                    </span>{" "}
                    Wise Input Power
                  </p>

                  <IoExpand
                    onClick={toggleTable}
                    style={{
                      fontSize: "16px",
                      color: theme?.palette?.main_layout?.primary_text,
                      marginBottom: "10px",
                      marginTop: "-20px",
                      fontSize: "14px",
                      fontWeight: 500,
                      fontFamily: "inter",
                      padding: "5px",
                      backgroundColor:
                        theme?.palette?.default_select?.background,
                      cursor: "pointer",
                    }}
                  />
                </div>

                <DifferentColorBarChart data={countsByModelData} />
              </CustomCard>
            </Col>
            <Col xs={24} xl={12} style={{ padding: "10px 10px 10px 0" }}>
              <Spin spinning={false}>
                <CustomCard
                  style={{
                    border: `1px solid ${theme?.palette?.default_card?.border}`,
                    backgroundColor: theme?.palette?.main_layout?.background,
                    borderRadius: "7px",
                    position: "relative",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <p
                      style={{
                        fontSize: "16px",
                        color: theme?.palette?.graph?.title,
                        marginBottom: "0px",
                        marginTop: "0px",
                        fontFamily: "inter",
                      }}
                    >
                      <span
                        style={{
                          color: theme?.palette?.main_layout?.secondary_text,
                        }}
                      >
                        {model ? model : "Model"}
                      </span>{" "}
                      Wise Data Traffic
                    </p>

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "end",
                        gap: "10px",
                      }}
                    ></div>
                  </div>

                  <CustomLineGraph data={countsByModelData} />
                </CustomCard>
              </Spin>
            </Col>
            <Col xs={24} xl={12} style={{ padding: "10px 0 10px 10px" }}>
              <Spin spinning={false}>
                <CustomCard
                  style={{
                    border: `1px solid ${theme?.palette?.default_card?.border}`,
                    backgroundColor: theme?.palette?.main_layout?.background,
                    borderRadius: "7px",
                    position: "relative",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <p
                      style={{
                        fontSize: "16px",
                        color: theme?.palette?.graph?.title,
                        marginBottom: "0px",
                        marginTop: "0px",
                        fontFamily: "inter",
                      }}
                    >
                      <span
                        style={{
                          color: theme?.palette?.main_layout?.secondary_text,
                        }}
                      >
                        {model ? model : "Model"}
                      </span>{" "}
                      Wise Energy Efficiency
                    </p>

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "end",
                        gap: "10px",
                      }}
                    ></div>
                  </div>

                  <CustomLineGraph ee="true" data={countsByModelData} />
                </CustomCard>
              </Spin>
            </Col>
            <Col xs={24} style={{ padding: "10px 0 0 0" }}>
              <Spin spinning={loader3}>
                <CustomCard
                  style={{
                    border: `1px solid ${theme?.palette?.default_card?.border}`,
                    backgroundColor: theme?.palette?.main_layout?.background,
                    borderRadius: "7px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <p
                      style={{
                        fontSize: "16px",
                        color: theme?.palette?.main_layout?.primary_text,
                        marginBottom: "10px",
                        marginTop: "-10px",
                        fontSize: "14px",
                        fontWeight: 500,
                        fontFamily: "inter",
                      }}
                    >
                      <span
                        style={{
                          color: theme?.palette?.main_layout?.secondary_text,
                        }}
                      >
                        {model ? model : "Model"}
                      </span>{" "}
                      Wise Carbon Emission
                    </p>

                    <IoExpand
                      onClick={toggleTable}
                      style={{
                        fontSize: "16px",
                        color: theme?.palette?.main_layout?.primary_text,
                        marginBottom: "10px",
                        marginTop: "-20px",
                        fontSize: "14px",
                        fontWeight: 500,
                        fontFamily: "inter",
                        padding: "5px",
                        backgroundColor:
                          theme?.palette?.default_select?.background,
                        cursor: "pointer",
                      }}
                    />
                  </div>

                  <DifferentColorBarChart co2="true" data={countsByModelData} />
                </CustomCard>
              </Spin>
            </Col>
          </Row>
        </CustomCard>
      </Spin> */}
    </div>
  );
};

export default DashboardInventory;

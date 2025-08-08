import { useTheme } from '@mui/material/styles';
import CustomCard from '../../../../components/customCard';
import DefaultSelector from '../../../../components/defaultSelector';
import KpiSelector from '../kpiSelector';
import axiosInstance from '../../../../utils/axios/axiosInstance';
import DefaultTable from '../../../../components/tables';
import { useEffect, useState } from 'react';
import { Spin } from 'antd';
import {
  fetchAllVendors,
  fetchRacksBySiteId,
  fetchSiteNames,
} from '../../../../services/services';
import { fetchAvgEnergyConsumptionWithModelCount } from '../../../../services/dashboardServices/dashboardServices';

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

const ScoreCardModels = () => {
  const theme = useTheme();
  const [models, setModels] = useState(null);
  const [dataSource, setDataSource] = useState([]);

  // SITES
  const [siteOptions, setSiteOptions] = useState([]);
  const [selectedSite, setSelectedSite] = useState(null);

  // RACKS
  const [rackOptions, setRackOptions] = useState([]);
  const [selectedRack, setSelectedRack] = useState(null);

  // VENDORS
  const [vendorOptions, setVendorOptions] = useState([]);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [scorecardKpi, setScorecardKpi] = useState(durations?.[0] ?? null); // pick default from list

  const [loader, setLoader] = useState(false);

  // const fetchModels = async () => {
  //   const payload = {
  //     site_id: siteId,
  //     //   rack_id: rackId,
  //     //   vendor_id: vendorId,
  //   };
  //   try {
  //     setLoader(true);
  //     const res = await axiosInstance.post(
  //       `/device_inventory/get_model_Count`,
  //       payload
  //     );
  //     if (res.status === 200) {
  //       setLoader(false);
  //       setModels(res?.data?.data);
  //       setSelectedModel(res?.data?.data[0]);
  //     }
  //   } catch (error) {
  //     setLoader(false);
  //   }
  // };

  const getSites = async () => {
    try {
      const response = await fetchSiteNames();

      const sites = response; // Assuming the API returns an array of site options
      // console.log('ScoreCard Sites', sites);
      setSiteOptions(
        sites?.map((item) => {
          return {
            label: item?.site_name,
            value: item?.id,
          };
        })
      );
      if (sites.length > 0) {
        setSelectedSite(sites[0].id); // Automatically select the first site
      }
    } catch (error) {
      console.error('Error fetching site names:', error);
    }
  };

  const fetchRackData = async () => {
    try {
      // const response = await axiosInstance.post(
      //   `/sites/get_racks_by_site_id/${selectedSite}`
      // );

      const response = await fetchRacksBySiteId(selectedSite);
      // console.log('ScoreCard Reacks', response?.data?.data);
      setRackOptions(
        response?.data?.data?.map((item) => {
          return {
            label: item?.rack_name,
            value: item?.id,
          };
        })
      ); // Assuming the API returns an array of rack options
    } catch (error) {
      console.error('Error fetching rack data:', error);
    }
  };

  const fetchVendorData = async () => {
    try {
      const response = await fetchAllVendors();
      // console.log('ScoreCard Vendord', response?.data?.data);

      setVendorOptions(
        response?.data?.data?.map((item) => {
          return {
            label: item?.vendor_name,
            value: item?.id,
          };
        })
      ); // Assuming the API returns an array of vendor options
    } catch (error) {
      console.error('Error fetching vendor data:', error);
    }
  };

  const getModelsData = async (param = null) => {
    setLoader(true); // Start the loader
    const selectedTime = param ? param : durations?.[0]?.value;
    // const selectedTime = param
    //   ? durations?.find((item) => item?.value == param)
    //   : durations?.[0];

    try {
      const payload = {
        site_id: selectedSite,
        ...(selectedVendor && { vendor_id: selectedVendor }),
        ...(selectedRack && { rack_id: selectedRack }),
        ...(selectedTime && { duration: selectedTime }),
      };
      const res = await fetchAvgEnergyConsumptionWithModelCount(payload);

      if (res.status === 200) {
        console.log('avg_energy_consumption_with_model_count', res);
        setDataSource(res?.data);
      }
    } catch (error) {
      console.error('Error fetching models data:', error);
    } finally {
      setLoader(false); // Stop the loader
    }
  };

  useEffect(() => {
    if (selectedSite) {
      getModelsData();
    }
  }, [selectedSite, selectedVendor, selectedRack]);

  useEffect(() => {
    if (selectedSite) {
      fetchRackData(selectedSite);
    }
  }, [selectedSite]);

  useEffect(() => {
    getSites();
    fetchVendorData();
  }, []);

  const handleChangeModel = (value, option) => {
    setModels(value);
  };

  const handleChangeRack = (value, option) => {
    setSelectedRack(value);
    console.log('Selected Rack:', option);
  };

  const handleChangeVendor = (value, option) => {
    setSelectedVendor(value);
    console.log('Selected Vendor:', option);
  };

  const handleChangeSite = (value, option) => {
    setSelectedSite(value);
    setSelectedRack(null);
    console.log('Selected Site:', option);
  };

  const updatedModels =
    models &&
    models?.map((item) => {
      return {
        label: item?.model_name,
        value: item?.model_name,
      };
    });

  const handleChangeDuration = (value) => {
    setScorecardKpi(value);
    getModelsData(value);
  };
  return (
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
          Score-Card for Models
        </p>
        <div
          style={{
            display: 'flex',
            justifyContent: 'end',
            alignItems: 'center',
            gap: '10px',
          }}
        >
          <KpiSelector
            options={durations}
            value={scorecardKpi}
            onChange={handleChangeDuration}
            kpi="true"
          />
          {/* <KpiSelector
            options={durations}
            value={durations}
            onChange={handleChangeDuration}
            kpi="true"
          /> */}
          <DefaultSelector
            options={siteOptions}
            onChange={handleChangeSite}
            value={selectedSite}
            placeholder="Select Site"
            allowClear={false}
          />

          <DefaultSelector
            options={rackOptions}
            onChange={handleChangeRack}
            value={selectedRack}
            placeholder="Select Rack"
          />

          <DefaultSelector
            options={vendorOptions}
            onChange={handleChangeVendor}
            value={selectedVendor}
            placeholder="Select Vendor"
          />

          {/* <DefaultSelector
            options={updatedModels}
            onChange={handleChangeModel}
            value={selectedModel}
            placeholder="Select Model"
          /> */}
        </div>
      </div>
      <Spin spinning={loader}>
        <DefaultTable
          key="score-card table"
          rowClassName={(record, index) => (index % 2 === 0 ? 'even' : 'odd')}
          size="small"
          columns={columns}
          dataSource={dataSource}
          rowKey="id"
          style={{ whiteSpace: 'pre' }}
          pagination={false}
          scroll={{
            x: 600,
          }}
        />
      </Spin>
    </CustomCard>
  );
};

export default ScoreCardModels;

const columns = [
  {
    title: 'Model Number',
    dataIndex: 'model_no',
    key: 'model_no',
  },
  {
    title: 'Devices Count',
    dataIndex: 'model_count',
    key: 'model_count',
  },
  // {
  //   title: 'Device Name',
  //   dataIndex: 'device_name',
  //   key: 'device_name',
  // },
  // {
  //   title: 'IP Address',
  //   dataIndex: 'ip_address',
  //   key: 'ip_address',
  // },
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
    title: 'Vendor Name',
    dataIndex: 'vendor_name',
    key: 'vendor_name',
  },
  {
    title: 'Total Power Input (KW)',
    dataIndex: 'avg_total_PIn',
    key: 'avg_total_PIn',
  },
  {
    title: 'Total Power Output (KW)',
    dataIndex: 'avg_total_POut',
    key: 'avg_total_POut',
  },
  {
    title: 'Energy Efficiency',
    dataIndex: 'avg_energy_efficiency',
    key: 'avg_energy_efficiency',
  },
  {
    title: 'Power Efficiency',
    dataIndex: 'avg_power_efficiency',
    key: 'avg_power_efficiency',
  },

  {
    title: 'Data Traffic (GB)',
    dataIndex: 'avg_data_traffic',
    key: 'avg_data_traffic',
  },
  {
    title: ' PCR',
    dataIndex: 'avg_pcr',
    key: 'avg_pcr',
  },
  {
    title: 'CO2 Emissions (Kg)',
    dataIndex: 'avg_co2_emissions',
    key: 'avg_co2_emissions',
  },

  {
    title: 'Message',
    dataIndex: 'message',
    key: 'message',
  },
];

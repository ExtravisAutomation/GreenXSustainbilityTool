import { useEffect, useState } from 'react';
import InlineFilters from '../../../../components/ui/inlinefilters';

import { generateFltersList } from './filterConfig';
import { debounce, formateOptions, formateOptionsWithId } from './utils';
import ExportButton from '../../../../components/exportButton';
import { Form, message } from 'antd';
import axiosInstance from '../../../../utils/axios/axiosInstance';
import {
  fetchDeviceTypes,
  fetchSoftwareVersion,
  fetchHardwareVersion,
} from '../../../../services/devicesServices';
import {
  fetchRacksBySiteId,
  fetchSiteNames,
  fetchAllVendors,
} from '../../../../services/services.js';

export const scoreValues = {
  8: [8],
  '0-5': [0, 5],
  '5-8': [5, 8],
};

const InventoryFilter = ({ fetchSeeds, columns }) => {
  const [messageApi] = message.useMessage();
  const [form] = Form.useForm();

  // FILTER OPTIONS
  const [softwareVersion, setSoftwareVersion] = useState(null);
  const [hardwareVersion, setHardwareVersion] = useState(null);
  const [vendors, setVendors] = useState([]);
  const [deviceTypes, setDeviceTypes] = useState([]);
  const [racks, setRacks] = useState([]);
  const [siteNames, setSiteNames] = useState([]);

  // LOADER
  const [siteChangeLoader, setSiteChangeLoader] = useState(false);

  const getDeviceTypes = async () => {
    try {
      const deviceTypes = await fetchDeviceTypes();
      setDeviceTypes(
        formateOptionsWithId(
          deviceTypes?.data?.device_type_count,
          'device_type',
          'device_type'
        )
      );
    } catch (error) {
      console.error('Error fetching device types:', error);
    }
  };

  const getSoftwareVersion = async () => {
    try {
      const version = await fetchSoftwareVersion();
      setSoftwareVersion(formateOptions(version?.data));
    } catch (error) {
      console.error('Error fetching software version:', error);
    }
  };

  const getHardwareVersion = async () => {
    try {
      const version = await fetchHardwareVersion();
      setHardwareVersion(formateOptions(version?.data));
    } catch (error) {
      console.error('Error fetching hardware version:', error);
    }
  };

  const getVendors = async () => {
    try {
      const vendorData = await fetchAllVendors();
      setVendors(formateOptionsWithId(vendorData?.data?.data, 'vendor_name'));
    } catch (error) {
      console.error('Error fetching vendors:', error);
    }
  };

  const getSiteNames = async () => {
    try {
      const siteNameData = await fetchSiteNames();
      setSiteNames(formateOptionsWithId(siteNameData.data, 'site_name'));
    } catch (error) {
      console.error('Error fetching site names:', error);
    }
  };

  useEffect(() => {
    getDeviceTypes();
    getSoftwareVersion();
    getHardwareVersion();
    getVendors();
    getSiteNames();
  }, []);

  // useEffect(() => {
  //   const handler = setTimeout(() => {
  //     let payload = {
  //       ...filterValues,
  //     };

  //     // fetchSeeds(1, payload);
  //   }, 300);

  //   return () => {
  //     clearTimeout(handler);
  //   };
  // }, [
  //   filterValues.ip_address,
  //   filterValues.device_type,
  //   filterValues.device_name,
  //   filterValues.score,
  // ]);

  const onSiteChange = async (value) => {
    if (value) {
      setSiteChangeLoader(true);
      try {
        form.setFieldsValue({ rack_id: null });
        const racksData = await fetchRacksBySiteId(value);
        setRacks(formateOptionsWithId(racksData?.data?.data, 'rack_name'));
      } catch (error) {
        console.error('Error fetching racks:', error);
      } finally {
        setSiteChangeLoader(false);
      }
    } else {
      setRacks([]);
    }
  };

  const filtersConfig = generateFltersList({
    onSiteChange,
    siteChangeLoader,
    onInlineFieldChange: debounce((value) => {
      handleAdvanceSearch(value);
    }, 300),
    softwareVersion,
    hardwareVersion,
    siteNames,
    vendors,
    deviceTypes,
    racks,
  });

  // console.log('harwareVersion::', hardwareVersion);

  const handleAdvanceSearch = async (values) => {
    // const filteredValues = Object.fromEntries(
    //   Object.entries(values).filter(([_, value]) => value !== undefined)
    // );

    // Use the filtered values to update the state or perform any other operations
    // if (filteredValues.ip_address) {
    //   setSelectedIpAddress(filteredValues.ip_address);
    // }
    // if (filteredValues.device_name) {
    //   setSelectedDeviceName(filteredValues.device_name);
    // }
    // if (filteredValues.device_type) {
    //   setSelectedDeviceType(filteredValues.device_type);
    // }
    // if (filteredValues.score) {
    //   filteredValues.score = scoreValues[filteredValues.score];
    //   // setSelectedDeviceScorePoint(filteredValues.deviceScorePointFilter);
    // }
    // setFilterValues((prev) => ({ ...prev, ...filteredValues }));

    const formValues = form.getFieldsValue();

    fetchSeeds(1, { ...formValues });
  };

  const handleExport = async () => {
    try {
      const formValues = form.getFieldsValue();
      const response = await axiosInstance.post(
        '/device_inventory/generate_excel',
        { ...formValues },
        { responseType: 'blob' }
      );

      if (response && response.data) {
        const blob = new Blob([response.data], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'device_inventory.xlsx'; // Set the desired file name
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url); // Clean up the URL object
        messageApi.open({
          type: 'success',
          content: 'Excel file generated and downloaded successfully!',
        });
      }
    } catch (error) {
      console.error('Error generating Excel file:', error);
      messageApi.open({
        type: 'error',
        content: 'Failed to generate Excel file.',
      });
    }
  };

  return (
    <>
      <InlineFilters
        styles={{ display: 'flex', gap: '10px' }}
        filtersConfig={filtersConfig}
        handleSearch={() => {}}
        handleAdvanceSearch={handleAdvanceSearch}
        form={form}
      />
      <ExportButton
        // dataSource={
        //   selectedRowsData?.length > 0
        //     ? selectedRowsData
        //     : inventoryPageData?.devices || []
        // }
        onClick={handleExport}
        columns={columns}
        name="Devices"
      />
    </>
  );
};

export default InventoryFilter;

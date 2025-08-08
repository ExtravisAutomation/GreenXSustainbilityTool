import React from 'react';
import { useTheme } from '@mui/material';
import { useSelector } from 'react-redux';
import ProgressDetailItem from './ProgressDetailItem';
import styled from 'styled-components';

function DetailItem({ label, value, status }) {
  const theme = useTheme();
  //   status = ;
  const StatusBadge = styled.span`
    font-size: 0.75rem;
    font-weight: 500;
    padding: 0.15rem 0.5rem;
    border-radius: 9999px;

    color: ${(props) =>
      props.status === 'Active'
        ? '#065f46'
        : props.status === 'Maintainance'
          ? '#b45309'
          : '#991b1b'};
    background-color: ${(props) =>
      props.status === 'Active'
        ? '#d1fae5'
        : props.status === 'Maintainance'
          ? '#fde68a'
          : '#fee2e2'};
    margin-top: 0.25rem;
    display: inline-block;
    width: fit-content;
  `;

  return (
    <div
      style={{
        borderBottom: `1px solid ${theme?.palette?.available_options?.border}`,
        paddingBottom: '0.5rem',
      }}
    >
      <span
        style={{
          fontSize: '0.875rem',
          color: theme?.palette?.default_input?.primary_text,
        }}
      >
        {label}
      </span>
      <p
        style={{
          fontWeight: 500,
          margin: 0,
          color: theme?.palette?.main_layout?.primary_text,
        }}
      >
        {status ? <StatusBadge status={status}>{status} </StatusBadge> : value}
      </p>
    </div>
  );
}

// status badge:

const StatusTag = styled.div`
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: capitalize;

  color: ${(props) =>
    props.status === 'Active'
      ? '#065f46'
      : props.status === 'Maintainance'
        ? '#b45309'
        : '#991b1b'};

  background-color: ${(props) =>
    props.status === 'Active'
      ? '#d1fae5'
      : props.status === 'Maintainance'
        ? '#fde68a'
        : '#fee2e2'};
`;

function StatusBox({ status }) {
  if (!status) return null;

  return <StatusTag status={status}>{status}</StatusTag>;
}

function DevicesDetailsSection({ deviceData, energy_effeciency }) {
  const theme = useTheme();

  //   console.log('Device Data:::: ', deviceData);

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr',
        gap: '1.5rem',
        padding: '1rem',

        margin: '0 auto',
      }}
    >
      <div
        style={{
          backgroundColor: theme?.palette?.default_card?.background,
          borderRadius: '0.5rem',

          //   padding: '0rem 1rem',
          gridColumn: 'span 3',
        }}
      >
        {/* <h3
          style={{
            fontWeight: 600,
            fontSize: '1.125rem',
            marginBottom: '1rem',
          }}
        >
          Rack Details
        </h3> */}
        <h3
          style={{
            fontWeight: 600,
            fontSize: '1.125rem',
            margin: '0px',
            marginBottom: '1rem',
            color: theme?.palette?.main_layout?.primary_text,
          }}
        >
          Device Details
        </h3>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
            gap: '1.5rem',
          }}
        >
          <DetailItem label="Device Name" value={deviceData?.device_name} />
          <DetailItem label="Device IP" value={deviceData?.device_ip} />
          <DetailItem label="Serial Number" value={deviceData?.serial_number} />
          <DetailItem label="Modal Number" value="custom" />
          <DetailItem label="Site Name" value={deviceData?.site_name} />
          <DetailItem label="Rack Name" value={deviceData?.rack_name} />
          <DetailItem
            label="Software Version"
            value={deviceData?.software_version}
          />
          <DetailItem
            label="End of Life External Announcement"
            value={deviceData?.hw_eol_ad}
          />
          <DetailItem label="End of Sale" value={deviceData?.hw_eos} />
          <DetailItem
            label="End of Software Maintenance Release"
            value={deviceData?.sw_EoSWM}
          />
          <DetailItem
            label="End of Routine Failure Analysis"
            value={deviceData?.hw_EoRFA}
          />
          <DetailItem
            label="End of Vulnerability/Security Support
"
            value={deviceData?.sw_EoVSS}
          />
          <DetailItem
            label="End of Service Contract Renewal"
            value={deviceData?.hw_EoSCR}
          />
          {/*  */}
          <DetailItem
            label="Last Date of Support
"
            value={deviceData?.hw_ldos}
          />
          <DetailItem
            label="Hardware Version"
            value={deviceData?.hardware_version}
          />
          <DetailItem
            label="Manufacturer
"
            value={deviceData?.manufacturer}
          />

          <DetailItem label="Power Input" value={deviceData?.power_input} />
          <ProgressDetailItem
            label="Energy Efficiency"
            labelColor={theme?.palette?.default_input?.primary_text}
            value={deviceData?.power_utilization}
            percentage={deviceData?.power_utilization}
            maxValue="100"
            color={`${deviceData?.power_utilization > 75 ? ' #44ad47' : deviceData?.power_utilization > 50 ? '#3b82f6' : '#fb0200'}`}
          />
          {/* <DetailItem
            label="Status"
            value={rackDetail?.Depth}
            status={rackDetail?.status}
          /> */}
          <StatusBox
            status={deviceData?.status === true ? 'Active' : 'InActive'}
          />
        </div>
      </div>
    </div>
  );
}

export default DevicesDetailsSection;

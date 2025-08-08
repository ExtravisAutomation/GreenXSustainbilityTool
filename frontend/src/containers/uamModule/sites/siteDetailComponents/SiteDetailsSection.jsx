import React from 'react';
import { useTheme } from '@mui/material';
import { useSelector } from 'react-redux';

import styled from 'styled-components';
import ProgressDetailItem from './ProgressDetailItem';
import { useLocation } from 'react-router-dom';

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
          marginTop: '10px',
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

function SiteDetailsSection({ energy_effeciency }) {
  //   const { data } = location.state || {};
  const location = useLocation();
  const { data } = location.state || {};
  const theme = useTheme();

  const rackDetail = useSelector((state) => state.hmRackDetail?.data);

  console.log(' data:::::', data);

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr',
        gap: '1.5rem',
        padding: '1rem',
        // maxWidth: '1000px',
        margin: '0 auto',
      }}
    >
      <div
        style={{
          backgroundColor: theme?.palette?.default_card?.background,
          borderRadius: '0.5rem',

          padding: '0rem 1rem',
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
          Site Details
        </h3>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
            gap: ' 2rem',
          }}
        >
          <DetailItem label="Site Name" value={data?.site_name} />
          <DetailItem label="Region" value={data?.region} />
          <DetailItem label="City" value={data?.city} />
          <DetailItem label="Total Racks" value={data?.num_racks} />
          <DetailItem label="Total Devices" value={data?.num_devices} />
          <DetailItem label="Longitude" value={data?.longitude} />
          <DetailItem label="Latitude" value={data?.latitude} />
          <DetailItem
            label="Data Traffic"
            value={`${data?.datatraffic} Gb/s`}
          />

          <DetailItem label="Power Input" value={data?.power_input} />
          <ProgressDetailItem
            label="Energy Efficiency"
            labelColor={theme?.palette?.default_input?.primary_text}
            value={data?.energy_efficiency}
            percentage={data?.energy_efficiency}
            maxValue="100"
            color={`${data?.energy_efficiency > 75 ? ' #44ad47' : data?.energy_efficiency > 50 ? '#3b82f6' : '#fb0200'}`}
          />
          {/* <DetailItem
            label="Status"
            value={rackDetail?.Depth}
            status={rackDetail?.status}
          /> */}
          <StatusBox status={data?.status} />
        </div>
      </div>
    </div>
  );
}

export default SiteDetailsSection;

import { Col, Row } from 'antd';
import React from 'react';
import CustomCard from '../../../components/customCard';
import { useTheme } from '@mui/material';
import Co2MetricsChart from './Co2MetricsChart';
import styled from 'styled-components';
import AeroplaneSVG from '../../../resources/svgs/airoplane.svg';
import CarSVG from '../../../resources/svgs/car.svg';
const ChartTitle = styled.span`
  font-size: 16px;
  font-weight: 600;
  font-family: 'Inter', sans-serif;
  margin: 0;
  letter-spacing: 1px;
  color: ${({ theme }) => theme?.palette?.graph?.title};
`;

function Co2EmissionSection({ metricsData, electricityMapData }) {
  // console.log('Map Data', electricityMapData);

  // const chartData = [
  //   { value: 1048, name: 'Solar', itemStyle: { color: '#facc15' } },
  //   { value: 735, name: 'Natural Gas', itemStyle: { color: '#9619B5' } },
  //   { value: 580, name: 'Wind', itemStyle: { color: '#34d399' } },
  //   { value: 484, name: 'Coal', itemStyle: { color: '#f87171' } },
  // ];

  // const colorMap = {
  //   solar: '#facc15',
  //   gas: '#c077d2ff',
  //   wind: '#34d399',
  //   coal: '#D21E16',
  //   hydro: '#0198CC',
  //   nuclear: '#9619B5',
  //   biomass: '#10b981',
  //   geothermal: '#fb923c',
  //   oil: '#882727ff',
  //   battery_discharge: '#38bdf8',
  //   unknown: '#d1d5db',
  // };

  const customColors = ['#38bdf8', '#c077d2ff', '#22C1A7', , '#8B5CF6'];

  const chartData = electricityMapData
    ? Object.entries(electricityMapData)
        .sort((a, b) => b[1] - a[1]) // Sort by value descending
        .slice(0, 4) // Take top 4 entries
        .map(([key, value], index) => ({
          name: key,
          value,
          itemStyle: {
            color: customColors[index], // Assign color based on index
            borderWidth: 4,
          },
        }))
    : [];

  const theme = useTheme();
  return (
    <Row gutter={[16, 16]} style={{ padding: '10px 10px' }}>
      <Col xs={24} lg={8}>
        <CustomCard
          style={{
            border: `1px solid ${theme?.palette?.default_card?.border}`,
            backgroundColor: theme?.palette?.main_layout?.background,
            borderRadius: '7px',
            color: theme?.palette?.main_layout?.primary_text,
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
              height: '100%',
            }}
          >
            <ChartTitle theme={theme}>Emission </ChartTitle>
            <div
              style={{
                marginTop: '20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '20px',
                height: '100%',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  // justifyContent: 'center',
                  alignItems: 'center',
                  height: '36px',
                  width: 'max-content',
                  padding: '0px 15px',
                  borderRadius: '4px',
                  backgroundColor:
                    theme?.palette?.main_layout?.sideBar?.icon_bg,
                }}
              >
                <h3
                  style={{
                    margin: '0',
                    padding: '0',
                    fontFamily: 'Inter',
                    fontWeight: 700,
                    fontStyle: 'normal',
                    fontSize: '22px',
                    lineHeight: '24px',
                    letterSpacing: '0',
                    verticalAlign: 'middle',
                    color: theme?.palette?.main_layout?.secondary_text,
                  }}
                >
                  {metricsData?.co2_em_kg} kg ({metricsData?.co2_em_tons} tons)
                  CO2e
                </h3>
              </div>
              <p
                style={{
                  color: theme?.palette?.default_option?.primary_text,
                  fontFamily: 'Inter',
                  fontWeight: 400,
                  fontSize: '12px',
                  // width: '360px',
                }}
              >
                estimated carbon emissions calculated using the formula: Power
                Output (consumed energy) × UAE_GRID_Carbon_0.4041 reflecting the
                actual environmental impact based on the carbon intensity of the
                UAE grid energy source.
              </p>
              <div style={{ display: 'flex', gap: '10px' }}>
                <div
                  className="co2_emission_card"
                  style={{
                    width: '206px',
                    height: '140px',
                    // backgroundColor: '#0D131C',
                    backgroundColor:
                      theme?.mode == 'dark'
                        ? '#0D131C'
                        : theme?.palette?.availble_options?.card_bg,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px',
                    padding: '8px',
                    boxSizing: 'border-box',
                    borderRadius: '8px',
                  }}
                >
                  <img src={CarSVG} alt="" width={46} height={46} />
                  <p style={{ fontSize: '12px' }}>
                    Equivalent of {metricsData?.co2_car_trip_km} km driven by a
                    petrol car (average emissions ~0.25 kg CO₂/km).
                  </p>
                </div>
                <div
                  className="co2_emission_card"
                  style={{
                    width: '206px',
                    height: '140px',
                    // backgroundColor: '#0D131C',
                    backgroundColor:
                      theme?.mode == 'dark'
                        ? '#0D131C'
                        : theme?.palette?.availble_options?.card_bg,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px',
                    padding: '8px',
                    boxSizing: 'border-box',
                    borderRadius: '8px',
                  }}
                >
                  <img src={AeroplaneSVG} alt="" width={46} height={46} />
                  <p style={{ fontSize: '12px' }}>
                    {/* 33 Airplane Flights of 1 hour, 50 minutes each */}
                    {metricsData?.co2_flights_avoided} long-haul flights (e.g.,
                    NYC–Dubai roundtrip flight emits ~700 kg CO₂).
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CustomCard>
      </Col>

      <Col xs={24} lg={16}>
        <CustomCard
          style={{
            border: `1px solid ${theme?.palette?.default_card?.border}`,
            backgroundColor: theme?.palette?.main_layout?.background,
            borderRadius: '7px',
            color: theme?.palette?.main_layout?.primary_text,
          }}
        >
          <ChartTitle theme={theme}>Metrics Visualisation</ChartTitle>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '20px',
            }}
          >
            <div
              className="co2_pie_chart"
              style={{ width: '350px', height: '300px', margin: '0px auto' }}
            >
              <Co2MetricsChart data={chartData} />
            </div>
            <div
              className="description_section"
              style={{
                flex: '1',
                width: '100%',
                padding: '8px',
                borderRadius: '8px',
                backgroundColor:
                  theme?.mode == 'dark'
                    ? '#0D131C'
                    : theme?.palette?.availble_options?.card_bg,
                // backgroundColor: theme?.palette?.availble_options?.card_bg,
                display: 'flex',
                flexDirection: 'column',
                // margin: '0px 20px',
              }}
            >
              <div
                className="description_item"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                  borderBottom: `1px dashed #36424E`,
                  padding: '10px 20px',
                }}
              >
                <h5
                  style={{
                    margin: 0,
                    padding: 0,
                    fontFamily: 'Inter',
                    fontWeight: 600,
                    fontStyle: 'normal',
                    fontSize: '14px',
                    lineHeight: '23px',
                    letterSpacing: '0',
                    verticalAlign: 'middle',
                  }}
                >
                  Consolidation and Decommissioning:
                </h5>
                <p
                  style={{
                    margin: 0,
                    padding: 0,
                    fontFamily: 'Inter',
                    fontWeight: 400,
                    fontSize: '12px',
                    color: theme?.palette?.default_option?.primary_text,
                  }}
                >
                  Estimated Monthly carbon dioxide equivalent emissions(based on
                  energy usage) Emissions are estimates from Utility data
                </p>
              </div>
              <div
                className="description_item"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                  borderBottom: `1px dashed #36424E`,
                  padding: '10px 20px',
                }}
              >
                <h5
                  style={{
                    margin: 0,
                    padding: 0,
                    fontFamily: 'Inter',
                    fontWeight: 600,
                    fontStyle: 'normal',
                    fontSize: '14px',
                    lineHeight: '23px',
                    letterSpacing: '0',
                    verticalAlign: 'middle',
                  }}
                >
                  High-Efficiency Power Supplies:
                </h5>
                <p
                  style={{
                    margin: 0,
                    padding: 0,
                    fontFamily: 'Inter',
                    fontWeight: 400,
                    fontSize: '12px',
                    color: theme?.palette?.default_option?.primary_text,
                  }}
                >
                  Use power supplies with high-efficiency ratings (e.g., 80 PLUS
                  Platinum or Titanium)
                </p>
              </div>
              <div
                className="description_item"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                  borderBottom: `1px dashed #36424E`,
                  padding: '10px 20px',
                }}
              >
                <h5
                  style={{
                    margin: 0,
                    padding: 0,
                    fontFamily: 'Inter',
                    fontWeight: 600,
                    fontStyle: 'normal',
                    fontSize: '14px',
                    lineHeight: '23px',
                    letterSpacing: '0',
                    verticalAlign: 'middle',
                  }}
                >
                  Data Center Certification:
                </h5>
                <p
                  style={{
                    margin: 0,
                    padding: 0,
                    fontFamily: 'Inter',
                    fontWeight: 400,
                    fontSize: '12px',
                    color: theme?.palette?.default_option?.primary_text,
                  }}
                >
                  Pursue certifications such as LEED (Leadership in Energy and
                  Environmental Design) or ISO 14001 for environmental
                  management.
                </p>
              </div>
              <div
                className="description_item"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                  borderBottom: `1px dashed #36424E`,
                  padding: '10px 20px',
                }}
              >
                <h5
                  style={{
                    margin: 0,
                    padding: 0,
                    fontFamily: 'Inter',
                    fontWeight: 600,
                    fontStyle: 'normal',
                    fontSize: '14px',
                    lineHeight: '23px',
                    letterSpacing: '0',
                    verticalAlign: 'middle',
                  }}
                >
                  Regular Maintenance:
                </h5>
                <p
                  style={{
                    margin: 0,
                    padding: 0,
                    fontFamily: 'Inter',
                    fontWeight: 400,
                    fontSize: '12px',
                    color: theme?.palette?.default_option?.primary_text,
                  }}
                >
                  Conduct regular maintenance of IT equipment and cooling
                  systems to ensure optimal performance.
                </p>
              </div>
            </div>
          </div>
        </CustomCard>
      </Col>
    </Row>
  );
}

export default Co2EmissionSection;

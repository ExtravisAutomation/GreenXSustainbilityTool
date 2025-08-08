import React from 'react';
import CustomCard from './customCard';
import { useTheme } from '@mui/material/styles';
import { Col, Row } from 'antd';
import DefaultTable from './tables';
import { render } from '@testing-library/react';

const ScoringCards = () => {
  const theme = useTheme();
  const columns = [
    {
      title: 'KPI',
      dataIndex: 'kpi',
      key: 'kpi',
      render: (text, record, index) => {
        return index === dataSource.length - 1 ? <strong>{text}</strong> : text;
      },
    },
    // {
    //   title: "Score (100)",
    //   dataIndex: "score100",
    //   key: "score100",
    //   render: (text, record, index) => {
    //     return index === dataSource.length - 1 ? <strong>{text}</strong> : text;
    //   },
    // },
    {
      title: 'Weightage (%)',
      dataIndex: 'weighatge',
      key: 'weighatge',
      render: (text, record, index) => {
        return index === dataSource.length - 1 ? <strong>{text}</strong> : text;
      },
    },
    // {
    //   title: "Weightage Score",
    //   dataIndex: "weighatge_score",
    //   key: "weighatge_score",
    //   render: (text, record, index) => {
    //     return index === dataSource.length - 1 ? <strong>{text}</strong> : text;
    //   },
    // },
  ];
  const dataSource = [
    {
      key: '1',
      kpi: 'Energy Efficiency',
      // score100: 95,
      weighatge: '25%',
      // weighatge_score: '19',
    },
    {
      key: '2',
      kpi: 'Power Efficiency',
      // score100: 75,
      weighatge: '20%',
      // weighatge_score: 15,
    },
    {
      key: '3',
      kpi: 'Data Traffic',
      // score100: 80,
      weighatge: '20%',
      // weighatge_score: 16,
    },
    {
      key: '4',
      kpi: 'PCR',
      // score100: 80,
      weighatge: '15%',
      // weighatge_score: 16,
    },
    {
      key: '5',
      kpi: 'Co2 Emission',
      // score100: 92,
      weighatge: '20%',
      // weighatge_score: 9.2,
    },
    {
      key: '6',
      kpi: 'Total',
      // score100: 92,
      weighatge: '100%',
      // weighatge_score: 9.2,
    },

    // {
    //   key: '8',
    //   kpi: 'Total',
    //   score100: 514,
    //   weighatge: 100,
    //   weighatge_score: 84.4,
    // },
    // {
    //   key: "7",
    //   kpi: "Capacity Utilization",
    //   score75: 78,
    // },
    // {
    //   key: "8",
    //   kpi: "Security Compliance",
    //   score75: 78,
    // },
    // {
    //   key: "9",
    //   kpi: "Cost Management",

    //   score50: 64,
    // },
  ];

  return (
    <>
      <div>
        <Row gutter={10}>
          <Col xs={24} lg={16}>
            <CustomCard
              style={{
                border: `1px solid ${theme?.palette?.default_card?.border}`,
                backgroundColor: theme?.palette?.main_layout?.background,
                borderRadius: '7px',
                position: 'relative',
                minHeight: '400px',
              }}
            >
              <DefaultTable
                rowClassName={(record, index) =>
                  index % 2 === 0 ? 'even' : 'odd'
                }
                size="small"
                //  onChange={handleChange}
                columns={columns}
                dataSource={dataSource}
                rowKey="id"
                style={{ whiteSpace: 'pre' }}
                pagination={false}
                // scroll={{
                //   x: 500,
                // }}
              />
            </CustomCard>
          </Col>
          <Col xs={24} lg={8}>
            <div
              style={{
                minHeight: '400px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <div style={{ width: '98%' }}>
                <div
                  style={{
                    border: `1px solid ${theme?.palette?.main_layout?.secondary_text}`,
                    backgroundColor:
                      theme?.palette?.main_layout?.secondary_text,
                    borderRadius: '7px 7px 0 0',
                  }}
                >
                  <p
                    style={{
                      fontWeight: 500,
                      fontSize: '16px',
                      textAlign: 'center',
                      color: 'white',
                      letterSpacing: '1px',
                    }}
                  >
                    Scoring Criteria
                  </p>
                </div>

                <CustomCard
                  style={{
                    border: `1px solid ${theme?.palette?.default_card?.border}`,
                    backgroundColor: theme?.palette?.main_layout?.background,
                    borderRadius: '0 0 7px 7px',
                    position: 'relative',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      color: theme?.palette?.main_layout?.primary_text,
                    }}
                  >
                    <p style={{ fontWeight: 500 }}>Threshhold</p>
                    <p style={{ fontWeight: 500 }}>Efficiency</p>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      color: theme?.palette?.default_card?.color,
                    }}
                  >
                    <p>70% or above</p>
                    <p>High</p>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      color: theme?.palette?.default_card?.color,
                    }}
                  >
                    <p>45% - 70%</p>
                    <p>Moderate</p>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      color: theme?.palette?.default_card?.color,
                    }}
                  >
                    <p>Less than 45%</p>
                    <p>Low</p>
                  </div>
                </CustomCard>
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default ScoringCards;

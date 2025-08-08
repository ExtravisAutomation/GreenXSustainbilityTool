import React from 'react';
import Card from '../../ui/Card';
import enterpriseIcon from '../../assets/comprehensiveSolution/enterprise-monitoring.svg';
import assetInfoIcon from '../../assets/comprehensiveSolution/asset-information.svg';
import workflowIcon from '../../assets/comprehensiveSolution/workflow-managemen.svg';
import reportIcon from '../../assets/comprehensiveSolution/visualize-and-report.svg';
import powerIcon from '../../assets/comprehensiveSolution/power-coonnectivity.svg';
import libraryIcon from '../../assets/comprehensiveSolution/comprehensive-library.svg';
import './comprehensiveSolution.css';

const ComprehensiveSolution = () => {
  const components = [
    {
      title: 'Enterprise Class Monitoring',
      description:
        'Manage power and environment systems<br/> with multi-protocol support.',
      icon: enterpriseIcon,
    },
    {
      title: 'Complete Asset Inventory Information',
      description:
        'Track infrastructure details, from racks to<br/> ports, bridging IT and facilities.',
      icon: assetInfoIcon,
    },
    {
      title: 'Ways to Visualize & Report on Data',
      description:
        'View asset data through intuitive dashboards and<br/> detailed reports.',
      icon: reportIcon,
    },
    {
      title: 'Change & Workflow Management',
      description:
        'DCS streamlines planning, tracking, and<br/> auditing for efficient operations and teamwork.',
      icon: workflowIcon,
    },
    {
      title: 'Power Chain and Physical Connectivity',
      description:
        'Track, visualize, and streamline power and data<br/> connections.',
      icon: powerIcon,
    },
    {
      title: 'Comprehensive Models Library',
      description:
        '30,000+ Smart Models, 450+ manufacturers, and<br/> key data sustainability specs.',
      icon: libraryIcon,
    },
  ];

  return (
    <div className="comprehensive-solution-section">
      <h2 className="section-header">
        A comprehensive DCS solution is comprised of
        <br /> components that provide:
      </h2>
      <div className="components-container">
        {components.map((component, index) => (
          <Card key={index} padding="20px" className="component-card">
            <img
              src={component.icon}
              alt={component.title}
              className="component-icon"
            />
            <h3>{component.title}</h3>
            <p dangerouslySetInnerHTML={{ __html: component.description }}></p>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ComprehensiveSolution;

import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import '../css/ExecutionReportModal.css';

const ExecutionReportModal = ({ show, message, onClose, dealData, handleReset }) => {
  const labels = [
    'Deal ID:',
    'Sale Price:',
    'Sale Currency:',
    'Symbol:',
    'Delivery Date:',
    'Currency I Have:',
    'FX Rate:',
    'Amount to Pay:'
  ];

  const values = dealData
    ? [
        dealData.dealID,
        dealData.salePrice,
        dealData.saleCurrency,
        dealData.symbol,
        dealData.deliveryDate,
        dealData.currencyIHave,
        dealData.fxRate,
        dealData.secondaryAmount
      ]
    : [];

  const handleClose = () => {
    handleReset(); // Call the reset handler
    onClose(); // Close the modal
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header>
        <Modal.Title>Execution Report</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {dealData ? (
          <div className="execution-report-container">
            {labels.map((label, index) => (
              <React.Fragment key={index}>
                <div className="label">{label}</div>
                <div className="value">{values[index]}</div>
              </React.Fragment>
            ))}
          </div>
        ) : (
          <pre>{message}</pre>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ExecutionReportModal;


import React, { useEffect, useMemo, useRef } from 'react';
import { Modal, Button } from 'react-bootstrap';
import '../css/ExecutionReportModal.css';
import { appendExecutionReportToBlotter } from '../utils/blotterStorage.js';

const ExecutionReportModal = ({ show, message, onClose, executionReport, handleReset }) => {
  const persistedKeysRef = useRef(new Set());

  useEffect(() => {
    if (!show || !executionReport?.dealID || !executionReport?.kind) {
      return;
    }

    const persistenceKey = `${executionReport.kind}:${executionReport.dealID}`;
    if (persistedKeysRef.current.has(persistenceKey)) {
      return;
    }

    appendExecutionReportToBlotter(executionReport);
    persistedKeysRef.current.add(persistenceKey);
  }, [executionReport, show]);

  const fields = useMemo(() => {
    if (!executionReport) {
      return [];
    }

    if (executionReport.kind === 'trading') {
      return [
        { label: 'Deal ID:', value: executionReport.dealID },
        { label: 'Type:', value: executionReport.transactionType },
        { label: 'Ccy:', value: executionReport.symbol },
        {
          label: 'Legs:',
          value: (
            <div className="execution-report-legs">
              {executionReport.legs?.map((leg, index) => (
                <div key={`${executionReport.dealID}-leg-${index}`}>
                  {[
                    `L${index + 1}`,
                    leg.side,
                    leg.amount,
                    leg.currency,
                    leg.valueDate,
                    leg.price ? `@ ${leg.price}` : '',
                    leg.spot ? `spot ${leg.spot}` : '',
                    leg.fwd ? `fwd ${leg.fwd}` : '',
                    leg.secondaryAmount || leg.secondaryCurrency
                      ? `${leg.secondaryAmount || ''} ${leg.secondaryCurrency || ''}`.trim()
                      : ''
                  ].filter(Boolean).join(' ')}
                </div>
              ))}
            </div>
          )
        }
      ];
    }

    return [
      { label: 'Deal ID:', value: executionReport.dealID },
      { label: 'Sale Price:', value: executionReport.amount },
      { label: 'Sale Currency:', value: executionReport.currency },
      { label: 'Symbol:', value: executionReport.symbol },
      { label: 'Delivery Date:', value: executionReport.deliveryDate },
      { label: 'FX Rate:', value: executionReport.rate },
      { label: 'Currency to Pay:', value: executionReport.secondaryCurrency },
      { label: 'Amount to Pay:', value: executionReport.secondaryAmount }
    ];
  }, [executionReport]);

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
        {executionReport ? (
          <div className="execution-report-container">
            {fields.map((field) => (
              <React.Fragment key={field.label}>
                <div className="label">{field.label}</div>
                <div className="value">{field.value}</div>
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


// ExecutionReportModal.js
import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const ExecutionReportModal = ({ show, message, onClose }) => (
  <Modal show={show} onHide={onClose}>
    <Modal.Header closeButton>
      <Modal.Title>Execution Report</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <pre>{message}</pre>
    </Modal.Body>
    <Modal.Footer>
      <Button variant="secondary" onClick={onClose}>
        Close
      </Button>
    </Modal.Footer>
  </Modal>
);

export default ExecutionReportModal;

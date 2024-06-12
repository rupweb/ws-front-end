import React from 'react';
import useCurrencyConversion from '../hooks/useCurrencyConversion';
import KYCStatusModal from './KYCStatusModal';
import ExecutionReportModal from './ExecutionReportModal';
import SalePriceField from './SalePriceField';
import SaleCurrencyField from './SaleCurrencyField';
import DeliveryDateField from './DeliveryDateField';
import FromCurrencyField from './FromCurrencyField';
import KYCStatusField from './KYCStatusField';
import { addBusinessDays, isWeekday } from '../utils/utils';
import '../css/CurrencyConverter.css';

const CurrencyConverter = () => {
    const {
        fromCurrency,
        setFromCurrency,
        toCurrency,
        setToCurrency,
        amount,
        setAmount,
        conversionRate,
        convertedAmount,
        selectedDate,
        setSelectedDate,
        showExecute,
        isFormValid,
        kycStatus,
        setKycStatus,
        kycModalMessage,
        showKycModal,
        executionModalMessage,
        showExecutionModal,
        handleConvert,
        handleExecute,
        handleReset,
        handleKycModalClose,
        handleExecutionModalClose,
    } = useCurrencyConversion();

    const minDate = addBusinessDays(new Date(), 2);
    const maxDate = new Date();
    maxDate.setFullYear(maxDate.getFullYear() + 1);

    return (
        <div className="converter-container">
            <KYCStatusModal show={showKycModal} message={kycModalMessage} onClose={handleKycModalClose} />
            <ExecutionReportModal show={showExecutionModal} message={executionModalMessage} onClose={handleExecutionModalClose} />
            <div className="card rounded p-4">
                <SalePriceField amount={amount} setAmount={setAmount} />
                <SaleCurrencyField toCurrency={toCurrency} setToCurrency={setToCurrency} />
                <DeliveryDateField 
                    selectedDate={selectedDate} 
                    setSelectedDate={setSelectedDate} 
                    minDate={minDate} 
                    maxDate={maxDate} 
                    isWeekday={isWeekday} 
                />
                <FromCurrencyField fromCurrency={fromCurrency} setFromCurrency={setFromCurrency} toCurrency={toCurrency} />
                <KYCStatusField kycStatus={kycStatus} setKycStatus={setKycStatus} />
                <div>
                    <button
                        className="btn btn-primary btn-block"
                        onClick={handleConvert}
                        disabled={!isFormValid}
                        style={{ backgroundColor: isFormValid ? 'blue' : 'lightblue' }}
                    >
                        Convert
                    </button>
                </div>
                {conversionRate && (
                    <div className="mt-3">
                        <p>FX Rate: {conversionRate}</p>
                        <p>Amount to pay: {convertedAmount.toFixed(2)} {fromCurrency}</p>
                    </div>
                )}
                {showExecute && (
                    <div className="mt-3">
                        <div className="form-group row align-items-center">
                            <label className="col-sm-8 col-form-label text-right">Execute:</label>
                            <div className="col-sm-4">
                                <button className="btn btn-success mr-2" onClick={handleExecute}>YES</button>
                                <button className="btn btn-danger" onClick={handleReset}>NO</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CurrencyConverter;

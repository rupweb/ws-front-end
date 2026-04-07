export const BLOTTER_STORAGE_KEY = 'blotterExecutions';
export const LEGACY_EXECUTIONS_KEY = 'executions';
export const BLOTTER_SCHEMA_VERSION = 1;

const EMPTY_ARRAY = [];

const readArray = (key) => {
  try {
    const parsed = JSON.parse(localStorage.getItem(key));
    return Array.isArray(parsed) ? parsed : EMPTY_ARRAY;
  } catch (error) {
    return EMPTY_ARRAY;
  }
};

const normalizeStoredRecord = (record) => {
  if (!record || !record.kind || !record.dealID) {
    return null;
  }

  return {
    schemaVersion: BLOTTER_SCHEMA_VERSION,
    executedAt: '',
    legs: [],
    ...record
  };
};

const normalizeLegacyRecord = (record) => {
  if (!record || !record.dealID) {
    return null;
  }

  return {
    schemaVersion: BLOTTER_SCHEMA_VERSION,
    kind: 'sales',
    dealID: record.dealID,
    executedAt: record.executedAt || '',
    date: record.date || '',
    salePrice: record.salePrice || '',
    saleCurrency: record.saleCurrency || '',
    symbol: record.symbol || '',
    deliveryDate: record.deliveryDate || '',
    currencyIHave: record.currencyIHave || '',
    fxRate: record.fxRate || '',
    amountToPay: record.amountToPay || ''
  };
};

export const getBlotterExecutionKey = (record) => `${record.kind}:${record.dealID}`;

export const getBlotterExecutionTimestamp = (record) => {
  const rawValue = record.executedAt || record.date;
  const timestamp = Date.parse(rawValue);
  return Number.isNaN(timestamp) ? 0 : timestamp;
};

export const formatBlotterExecutionDate = (record) => {
  if (record.executedAt) {
    const timestamp = Date.parse(record.executedAt);
    if (!Number.isNaN(timestamp)) {
      return new Date(timestamp).toLocaleString();
    }
  }

  return record.date || '';
};

export const getStoredBlotterExecutions = () => {
  const storedRecords = readArray(BLOTTER_STORAGE_KEY)
    .map(normalizeStoredRecord)
    .filter(Boolean);
  const legacyRecords = readArray(LEGACY_EXECUTIONS_KEY)
    .map(normalizeLegacyRecord)
    .filter(Boolean);

  const merged = [];
  const seenKeys = new Set();

  [...storedRecords, ...legacyRecords].forEach((record) => {
    const key = getBlotterExecutionKey(record);
    if (seenKeys.has(key)) {
      return;
    }

    seenKeys.add(key);
    merged.push(record);
  });

  return merged.sort((left, right) => getBlotterExecutionTimestamp(right) - getBlotterExecutionTimestamp(left));
};

const buildSalesBlotterRecord = (executionReport) => ({
  schemaVersion: BLOTTER_SCHEMA_VERSION,
  kind: 'sales',
  executedAt: executionReport.executedAt || new Date().toISOString(),
  dealID: executionReport.dealID,
  salePrice: executionReport.amount || '',
  saleCurrency: executionReport.currency || '',
  symbol: executionReport.symbol || '',
  deliveryDate: executionReport.deliveryDate || '',
  currencyIHave: executionReport.secondaryCurrency || '',
  fxRate: executionReport.rate || '',
  amountToPay: executionReport.secondaryAmount || ''
});

const buildTradingBlotterRecord = (executionReport) => ({
  schemaVersion: BLOTTER_SCHEMA_VERSION,
  kind: 'trading',
  executedAt: executionReport.executedAt || new Date().toISOString(),
  dealID: executionReport.dealID,
  transactionType: executionReport.transactionType || '',
  symbol: executionReport.symbol || '',
  legs: Array.isArray(executionReport.legs) ? executionReport.legs : []
});

export const appendExecutionReportToBlotter = (executionReport) => {
  if (!executionReport?.dealID || !executionReport?.kind) {
    return false;
  }

  const key = getBlotterExecutionKey(executionReport);
  const existingRecords = getStoredBlotterExecutions();
  if (existingRecords.some((record) => getBlotterExecutionKey(record) === key)) {
    return false;
  }

  const storedRecords = readArray(BLOTTER_STORAGE_KEY)
    .map(normalizeStoredRecord)
    .filter(Boolean);
  const blotterRecord = executionReport.kind === 'trading'
    ? buildTradingBlotterRecord(executionReport)
    : buildSalesBlotterRecord(executionReport);

  storedRecords.push(blotterRecord);
  localStorage.setItem(BLOTTER_STORAGE_KEY, JSON.stringify(storedRecords));
  return true;
};

// Simplified JavaScript for debugging
try {
    const Java = Polyglot.import('java');
    const QuoteRequestEncoder = Java.type('agrona.QuoteRequestEncoder');
    console.log(QuoteRequestEncoder);
} catch (e) {
    console.error("Error importing Java classes:", e);
}

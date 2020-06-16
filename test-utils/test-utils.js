const getStub = () => {
    const stub = (...args) => {
        stub.callCount++;
        stub.lastCallArgs = args;
        return stub.sequencedReturnValues ? stub.sequencedReturnValues.shift() : stub.returnVal;
    }
    stub.callCount = 0;
    return stub;
}

module.exports = { getStub: getStub }
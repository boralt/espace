export default {
    channels: [
        {
            id: '1',
            name: 'Channel 1',
            bandwidth: 100,
            dropPercent: 0,
            latency: 10,
            jitter: 2,
        },
        {
            id: '2',
            name: 'Channel 2',
            bandwidth: 200,
            dropPercent: 0,
            latency: 5,
            jitter: 10,
        },
    ],
    trafficClasses: [
        {
            placeholder: false,
            id: '1',
            name: 'Traffic Class #1',
            bandwidth: 40,
            jitterCost: 2,
            latencyCost: 3,
            dropCost: 2,
        },
        {
            placeholder: false,
            id: '2',
            name: 'Traffic Class #2',
            bandwidth: 90,
            jitterCost: 2,
            latencyCost: 3,
            dropCost: 2,
        },
    ],
    fecs: [
        {
            id: '1',
            name: 'FEC #1',
            multiplier: 2,
            divider: 10,
        },
        {
            id: '2',
            name: 'FEC #2',
            multiplier: 3,
            divider: 23,
        },
    ],
};

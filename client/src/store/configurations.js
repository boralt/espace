export default {
    capacity: {
        latency: 2000,
        jitter: 600,
        bandwidth: 9000000,
        dropPercent: 1000,
    },
    channels: [
        {
            id: '1',
            name: 'Channel #1',
            bandwidth: 10000,
            dropPercent: 1,
            latency: 100,
            jitter: 30,
        },
        {
            id: '2',
            name: 'Channel #2',
            bandwidth: 20000,
            dropPercent: 2,
            latency: 200,
            jitter: 10,
        },
        {
            id: '3',
            name: 'Channel #3',
            bandwidth: 40000,
            dropPercent: 3,
            latency: 300,
            jitter: 40,
        },
    ],
    trafficClasses: [
        {
            placeholder: false,
            id: '1',
            name: 'Traffic Class #1',
            bandwidthMir: 5000,
            bandwidthCir: 5000,
            bandwidthMirCost: 8,
            bandwidthCirCost: 9,
            jitterCost: 9,
            latencyCost: 9,
            dropCost: 9,
        },
        {
            placeholder: false,
            id: '2',
            name: 'Traffic Class #2',
            bandwidthMir: 6000,
            bandwidthCir: 6000,
            bandwidthMirCost: 8,
            bandwidthCirCost: 9,
            jitterCost: 8,
            latencyCost: 8,
            dropCost: 8,
        },
        {
            placeholder: false,
            id: '3',
            name: 'Traffic Class #3',
            bandwidthMir: 7000,
            bandwidthCir: 7000,
            bandwidthMirCost: 8,
            bandwidthCirCost: 9,
            jitterCost: 7,
            latencyCost: 7,
            dropCost: 7,
        },
        {
            placeholder: false,
            id: '4',
            name: 'Traffic Class #4',
            bandwidthMir: 8000,
            bandwidthCir: 8000,
            bandwidthMirCost: 8,
            bandwidthCirCost: 9,
            jitterCost: 6,
            latencyCost: 6,
            dropCost: 6,
        },
        {
            placeholder: false,
            id: '5',
            name: 'Traffic Class #5',
            bandwidthMir: 9000,
            bandwidthCir: 9000,
            bandwidthMirCost: 8,
            bandwidthCirCost: 9,
            jitterCost: 5,
            latencyCost: 5,
            dropCost: 5,
        },
        {
            placeholder: false,
            id: '6',
            name: 'Traffic Class #6',
            bandwidthMir: 10000,
            bandwidthCir: 10000,
            bandwidthMirCost: 8,
            bandwidthCirCost: 9,
            jitterCost: 4,
            latencyCost: 4,
            dropCost: 4,
        },
        {
            placeholder: false,
            id: '7',
            name: 'Traffic Class #7',
            bandwidthMir: 11000,
            bandwidthCir: 11000,
            bandwidthMirCost: 8,
            bandwidthCirCost: 9,
            jitterCost: 3,
            latencyCost: 3,
            dropCost: 3,
        },
        {
            placeholder: false,
            id: '8',
            name: 'Traffic Class #8',
            bandwidthMir: 12000,
            bandwidthCir: 12000,
            bandwidthMirCost: 8,
            bandwidthCirCost: 9,
            jitterCost: 2,
            latencyCost: 2,
            dropCost: 2,
        },
    ],
    fecs: [
        {
            id: '1',
            name: 'FEC #1',
            multiplier: 100,
            divider: 1,
        },
        {
            id: '2',
            name: 'FEC #2',
            multiplier: 110,
            divider: 2,
        },
        {
            id: '3',
            name: 'FEC #3',
            multiplier: 150,
            divider: 3,
        },
    ],
};
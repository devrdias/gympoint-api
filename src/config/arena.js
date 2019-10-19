export default {
  config: {
    queues: [
      {
        name: 'EnrollmentMail',
        hostId: 'localhost', // hostname or queue prefix, whatever you want
        type: 'bee',
        redis: {
          port: process.env.REDIS_PORT,
          host: process.env.REDIS_HOST,
          password: null,
        },
      },
      {
        name: 'HelpAnsweredMail',
        hostId: 'localhost', // hostname or queue prefix, whatever you want
        type: 'bee',
        redis: {
          port: process.env.REDIS_PORT,
          host: process.env.REDIS_HOST,
          password: null,
        },
      },
    ],
  },
  listenOpts: {
    basePath: '/arena',
    disableListen: true, // Let express handle the listening
  },
};

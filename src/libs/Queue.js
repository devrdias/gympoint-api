import Bee from 'bee-queue';
import redisConfig from '../config/redis';

// jobs
import EnrollmentMail from '../app/jobs/EnrollmentMail';
import HelpAnsweredMail from '../app/jobs/HelpAnsweredMail';

const jobs = [EnrollmentMail, HelpAnsweredMail];

class Queue {
  constructor() {
    this.queues = {};
    this.init();
  }

  init() {
    jobs.forEach(({ key, handle }) => {
      this.queues[key] = {
        bee: new Bee(key, {
          redis: redisConfig, // <== redis connection
          prefix: 'bq',
          stallInterval: 5000,
          nearTermWindow: 1200000,
          delayedDebounce: 1000,
          isWorker: true,
          getEvents: true,
          sendEvents: true,
          storeJobs: true,
          ensureScripts: true,
          activateDelayedJobs: false,
          removeOnSuccess: false,
          removeOnFailure: false,
          redisScanCount: 100,
        }),
        handle,
      };
    });
  }

  add(queue, job) {
    return this.queues[queue].bee.createJob(job).save();
  }

  processQueue() {
    jobs.forEach(job => {
      const { bee, handle } = this.queues[job.key];

      bee
        .process(handle)
        .on('ready', this.handleReady)
        .on('succeeded', this.handleSucceeded)
        .on('failed', this.handleFailure);
    });
  }

  handleReady() {
    console.info('BEE-QUEUE: Ready, listening ...');
  }

  handleSucceeded(job, result) {
    console.log(job);
    console.info(
      `BEE-QUEUE: Job ${job.queue.name} succeeded with result: ${result}`
    );
  }

  handleFailure(job, error) {
    console.info(`BEE-QUEUE: Queue ${job.queue.name}: FAILED`, error.message);
  }
}

export default new Queue();

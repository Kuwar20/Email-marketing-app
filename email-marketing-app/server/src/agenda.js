import Agenda from 'agenda';
import sendEmail from './nodemailer.js';

const agenda = new Agenda({ db: { address: process.env.MONGO_URI } });

agenda.define('send email', async (job) => {
  const { to, subject, body } = job.attrs.data;
  await sendEmail(to, subject, body);
  console.log(`Email sent to ${to}`);
});

// Export the `agenda` instance and a `start` function
export const start = async () => {
  await agenda.start();
  console.log('Agenda started');
};

export default agenda;

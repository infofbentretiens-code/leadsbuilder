import {Resend} from 'resend';
export const mailReady=()=>Boolean(process.env.RESEND_API_KEY&&process.env.EMAIL_FROM);
export async function sendMail(to,subject,text){
  if(!mailReady()) throw Object.assign(new Error('Le service d’e-mail est en cours de configuration. Contactez l’assistance.'),{status:503});
  const {error}=await new Resend(process.env.RESEND_API_KEY).emails.send({from:process.env.EMAIL_FROM,to,subject,text,reply_to:'info.fbentretiens@gmail.com'});
  if(error) throw new Error('Email delivery failed');
}

import Pricing from './PricingClient';
import {billingReady} from '../../lib/billing';
export const dynamic='force-dynamic';
export default function Page(){return <Pricing ready={billingReady()}/>;}

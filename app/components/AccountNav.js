'use client';
import Link from 'next/link';
import {useRouter} from 'next/navigation';
export default function AccountNav(){
  const router=useRouter();
  async function logout(){const res=await fetch('/api/auth/logout',{method:'POST'});if(res.ok){router.replace('/auth/login');router.refresh();}}
  return <nav aria-label="Navigation du compte" className="flex flex-wrap gap-5 items-center border-b pb-4 mb-6"><Link href="/">Accueil</Link><Link href="/dashboard">Tableau de bord</Link><Link href="/leads">Mes contacts</Link><button className="text-blue-700 ml-auto" onClick={logout}>Se déconnecter</button></nav>;
}

import {database,requireUser,readJson,fail,invalid,text} from '../../../lib/server';
const uuid=/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const statuses=['nouveau','contacte','qualifie','perdu','converti'];
export async function POST(req) {
  try {
    const userId=await requireUser(), body=await readJson(req), db=database();
    const {table,operation,filters=[],values,single,order}=body;
    if (!['leads','interactions'].includes(table)||!['select','insert','update','delete'].includes(operation)||!Array.isArray(filters)||filters.length>2) throw invalid('Requête invalide.');
    for (const f of filters) if(!['id','lead_id'].includes(f.column)||!uuid.test(f.value)) throw invalid('Identifiant invalide.');
    let query;
    if(table==='leads') {
      if(filters.some(f=>f.column!=='id')) throw invalid('Filtre invalide.');
      if(operation==='select') query=db.from('leads').select('*').eq('user_id',userId);
      if(operation==='insert') {
        const row=Array.isArray(values)?values[0]:values;
        if(!row||!text(row.nom,200)||!/^\S+@\S+\.\S+$/.test(text(row.email,254))) throw invalid('Le nom et une adresse e-mail valide sont obligatoires.');
        query=db.from('leads').insert({user_id:userId,nom:text(row.nom,200),email:text(row.email,254).toLowerCase(),entreprise:text(row.entreprise,200),telephone:text(row.telephone,40),source:text(row.source,100)||'direct',notes:text(row.notes,5000),statut:'nouveau'});
      }
      if(operation==='update') {
        if(!statuses.includes(values?.statut)) throw invalid('Statut invalide.');
        query=db.from('leads').update({statut:values.statut,updated_at:new Date().toISOString()}).eq('user_id',userId);
      }
      if(operation==='delete') query=db.from('leads').delete().eq('user_id',userId);
    } else {
      if(operation==='update') throw invalid('Action indisponible.');
      let leadId=operation==='insert'?(Array.isArray(values)?values[0]:values)?.lead_id:filters.find(f=>f.column==='lead_id')?.value;
      if(operation==='delete') {
        const id=filters.find(f=>f.column==='id')?.value;
        if(!id) throw invalid('Identifiant obligatoire.');
        const {data:item,error}=await db.from('interactions').select('lead_id').eq('id',id).maybeSingle();
        if(error) throw error;
        if(!item) return Response.json({data:[],error:null});
        leadId=item.lead_id;
      }
      if(!uuid.test(leadId)) throw invalid('Identifiant obligatoire.');
      const {data:lead,error}=await db.from('leads').select('id').eq('id',leadId).eq('user_id',userId).maybeSingle();
      if(error) throw error;
      if(!lead) return Response.json({error:'Contact introuvable.'},{status:404});
      if(operation==='select') query=db.from('interactions').select('*').eq('lead_id',leadId);
      if(operation==='delete') query=db.from('interactions').delete().eq('lead_id',leadId);
      if(operation==='insert') {
        const row=Array.isArray(values)?values[0]:values;
        if(!['email','appel','reunion','sms','note'].includes(row.type)||!text(row.description,5000)) throw invalid('Interaction invalide.');
        query=db.from('interactions').insert({lead_id:leadId,type:row.type,description:text(row.description,5000),date_interaction:new Date().toISOString()});
      }
    }
    if(['update','delete'].includes(operation)&&!filters.some(f=>f.column==='id')) throw invalid('Identifiant obligatoire.');
    for(const f of filters) query=query.eq(f.column,f.value);
    if(operation==='select') {
      const column=table==='leads'?'created_at':'date_interaction';
      query=query.order(column,{ascending:order?.ascending===true}).limit(1000);
      if(single) query=query.single();
    }
    const {data,error}=await query;
    if(error) throw error;
    return Response.json({data,error:null},{headers:{'Cache-Control':'no-store'}});
  } catch(error) {return fail(error);}
}


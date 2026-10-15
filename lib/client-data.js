export const supabase={from(table){
  const body={table,operation:'select',filters:[]};
  const query={
    select(){return query;}, insert(values){body.operation='insert';body.values=values;return query;},
    update(values){body.operation='update';body.values=values;return query;}, delete(){body.operation='delete';return query;},
    eq(column,value){body.filters.push({column,value});return query;}, order(column,options){body.order=options;return query;},single(){body.single=true;return query;},
    then(resolve,reject){return fetch('/api/data',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)}).then(async response=>{
      const result=await response.json();
      return response.ok?result:{data:null,error:{message:result.error||'Le service est momentanément indisponible.'}};
    }).then(resolve,reject);}
  };return query;
}};


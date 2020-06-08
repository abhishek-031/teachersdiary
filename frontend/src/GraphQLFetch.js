export default async function graphQLFetch(query,variables={}){
  try{
    const response = await fetch('/graphql',{
      method:'post',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({query,variables}),
    });
    const body = await response.text();
    const result = JSON.parse(body);
    return result.data;
  }
  catch(e){
    alert(`failed to fetch ${e.message}`);
  }
}

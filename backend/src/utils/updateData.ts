export const buildUpdateData = (body) =>{
  const data = {};

  Object.keys(body).forEach((key) =>{
    if(body[key] !== undefined){
      data[key] = body[key];
    }
  });
  return data;
}
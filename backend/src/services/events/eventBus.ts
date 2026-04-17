const subscriptions = new Map()

export const subscribe = (event, handler) =>{
  if(!subscriptions.has(event)){
    subscriptions.set(event, new Set())
  }

  subscriptions.get(event).add(handler);
}


export const publish = (event, payload)=>{
  const handlers = subscriptions.get(event);

  if(!handlers) return;

  handlers.forEach((handler) => handler(payload))
}
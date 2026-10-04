export default{fetch(request,env){return new URL(request.url).pathname.startsWith('/api/')?env.TRIAL_API.fetch(request):env.ASSETS.fetch(request);}};

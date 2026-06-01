import * as BunnySDK from "https://esm.sh/@bunny.net/edgescript-sdk@0.11.2";

BunnySDK.serve({
  async fetch(request: Request): Promise<Response> {
    return await fetch(request);
  },
});

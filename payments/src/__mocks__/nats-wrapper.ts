//   As jest dosent invoke nats connection , all the request failing cus respective publishe
//   fails to publish a event as no client available
//   writing fake implementaion of natsWrapper to generate fake client

// *orignal nats_client* IS ALREADY CONNECTED SO PASSING FAKE *client* TO CHILD CLASS
// *THIS.CLIENT.PUBLISH* OR *THIS.CLIENT.SUBSCRIBE* USE ORIGNAL NATS-CLIENT CONNECTED TO NATS STREAMING AND NOT THIS PROVIDED client

export const natsWrapper = {
  client: {
    publish: jest
      .fn()
      .mockImplementation(
        (subject: string, data: string, callback: () => void) => callback()
      ),
  },
};

//   jest.fn().mockImplementaion is mock function and can be used for tsting also mock function check wehther callbacks are invoked or not

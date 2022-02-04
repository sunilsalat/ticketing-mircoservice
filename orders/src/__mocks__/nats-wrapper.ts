//   As jest dosent invoke nats connection , all the request failing cus respective publishe
//   fails to publish a event as no client available
//   writing fake implementaion of natsWrapper to generate fake client

export const natsWrapper = {
    client: {
      publish: jest
        .fn()
        .mockImplementation(
          (subject: string, data: string, callback: () => void) => callback()
        ),
    },
  };
  
  //   hst.fn().mockImplementaion is mock function and can be used for tsting also mock function check wehther callbacks are invoked or not
  
import request from "supertest";

import { app } from "../../index";


it('return all the ticket', async()=>{
    const res = await request(app)
    .get('/api/ticket/')
    .send({})
    .expect(200)
})
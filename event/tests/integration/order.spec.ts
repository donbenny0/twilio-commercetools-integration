import { describe, expect, test } from '@jest/globals';
import app from '../../src/app';
import request from 'supertest';


const invalidOrderId = {
    "message": {
        "attributes": {
            "key": "value"
        },
        "data": "ewogICAgIm5vdGlmaWNhdGlvblR5cGUiOiAiTWVzc2FnZSIsCiAgICAicHJvamVjdEtleSI6ICJlbGVjdHJvbmljcy1lY29tIiwKICAgICJpZCI6ICJmNTFlMmMxMS0xYzU0LTRlZGUtYTI5My02ODY1YzIxMmNjOTAiLAogICAgInZlcnNpb24iOiAxLAogICAgInNlcXVlbmNlTnVtYmVyIjogNiwKICAgICJyZXNvdXJjZSI6IHsKICAgICAgICAidHlwZUlkIjogIm9yZGVyIiwKICAgICAgICAiaWQiOiAiMTJhMWM0MjYtZmRjOS00ODEzLWIwZWUtYmVhMTZlN2M1ZGU5IgogICAgfSwKICAgICJyZXNvdXJjZVZlcnNpb24iOiA2LAogICAgInJlc291cmNlVXNlclByb3ZpZGVkSWRlbnRpZmllcnMiOiB7CiAgICAgICAgIm9yZGVyTnVtYmVyIjogIjIwMjQtOC0yNC01MzMwNiIKICAgIH0sCiAgICAidHlwZSI6ICJPcmRlclN0YXRlQ2hhbmdlZCIsCiAgICAib3JkZXJJZCI6ICIwNzlmNDA1OC1mYTg3LTQ3ZmItYWJhNy02ZDQ2YmMwYjkxY2YiLAogICAgIm9yZGVyU3RhdGUiOiAiQ29uZmlybWVkIiwKICAgICJvbGRPcmRlclN0YXRlIjogIkNvbXBsZXRlIiwKICAgICJjcmVhdGVkQXQiOiAiMjAyNC0xMC0wM1QxMToyOToxOC40MDJaIiwKICAgICJsYXN0TW9kaWZpZWRBdCI6ICIyMDI0LTEwLTAzVDExOjI5OjE4LjQwMloiLAogICAgImNyZWF0ZWRCeSI6IHsKICAgICAgICAiaXNQbGF0Zm9ybUNsaWVudCI6IHRydWUsCiAgICAgICAgInVzZXIiOiB7CiAgICAgICAgICAgICJ0eXBlSWQiOiAidXNlciIsCiAgICAgICAgICAgICJpZCI6ICI0NTFmOThjNi00Nzk2LTQ0NGQtYjdlMy05YzFlZTQ3ZDVkNjgiCiAgICAgICAgfQogICAgfSwKICAgICJsYXN0TW9kaWZpZWRCeSI6IHsKICAgICAgICAiaXNQbGF0Zm9ybUNsaWVudCI6IHRydWUsCiAgICAgICAgInVzZXIiOiB7CiAgICAgICAgICAgICJ0eXBlSWQiOiAidXNlciIsCiAgICAgICAgICAgICJpZCI6ICI0NTFmOThjNi00Nzk2LTQ0NGQtYjdlMy05YzFlZTQ3ZDVkNjgiCiAgICAgICAgfQogICAgfQp9",
        "publishTime": "2021-02-26T19:13:55.749Z",
        "publish_time": "2021-02-26T19:13:55.749Z"
    },
    "subscription": "projects/myproject/subscriptions/mysubscription"
};

const noOrderId = {
    "message": {
        "attributes": {
            "key": "value"
        },
        "data": "ewogICAgIm5vdGlmaWNhdGlvblR5cGUiOiAiTWVzc2FnZSIsCiAgICAicHJvamVjdEtleSI6ICJlbGVjdHJvbmljcy1lY29tIiwKICAgICJpZCI6ICJmNTFlMmMxMS0xYzU0LTRlZGUtYTI5My02ODY1YzIxMmNjOTAiLAogICAgInZlcnNpb24iOiAxLAogICAgInNlcXVlbmNlTnVtYmVyIjogNiwKICAgICJyZXNvdXJjZSI6IHsKICAgICAgICAidHlwZUlkIjogIm9yZGVyIiwKICAgICAgICAiaWQiOiAiMTJhMWM0MjYtZmRjOS00ODEzLWIwZWUtYmVhMTZlN2M1ZGU5IgogICAgfSwKICAgICJyZXNvdXJjZVZlcnNpb24iOiA2LAogICAgInJlc291cmNlVXNlclByb3ZpZGVkSWRlbnRpZmllcnMiOiB7CiAgICAgICAgIm9yZGVyTnVtYmVyIjogIjIwMjQtOC0yNC01MzMwNiIKICAgIH0sCiAgICAidHlwZSI6ICJPcmRlclN0YXRlQ2hhbmdlZCIsCiAgICAib3JkZXJJZCI6ICIiLAogICAgIm9yZGVyU3RhdGUiOiAiQ29uZmlybWVkIiwKICAgICJvbGRPcmRlclN0YXRlIjogIkNvbXBsZXRlIiwKICAgICJjcmVhdGVkQXQiOiAiMjAyNC0xMC0wM1QxMToyOToxOC40MDJaIiwKICAgICJsYXN0TW9kaWZpZWRBdCI6ICIyMDI0LTEwLTAzVDExOjI5OjE4LjQwMloiLAogICAgImNyZWF0ZWRCeSI6IHsKICAgICAgICAiaXNQbGF0Zm9ybUNsaWVudCI6IHRydWUsCiAgICAgICAgInVzZXIiOiB7CiAgICAgICAgICAgICJ0eXBlSWQiOiAidXNlciIsCiAgICAgICAgICAgICJpZCI6ICI0NTFmOThjNi00Nzk2LTQ0NGQtYjdlMy05YzFlZTQ3ZDVkNjgiCiAgICAgICAgfQogICAgfSwKICAgICJsYXN0TW9kaWZpZWRCeSI6IHsKICAgICAgICAiaXNQbGF0Zm9ybUNsaWVudCI6IHRydWUsCiAgICAgICAgInVzZXIiOiB7CiAgICAgICAgICAgICJ0eXBlSWQiOiAidXNlciIsCiAgICAgICAgICAgICJpZCI6ICI0NTFmOThjNi00Nzk2LTQ0NGQtYjdlMy05YzFlZTQ3ZDVkNjgiCiAgICAgICAgfQogICAgfQp9",
        "publishTime": "2021-02-26T19:13:55.749Z",
        "publish_time": "2021-02-26T19:13:55.749Z"
    },
    "subscription": "projects/myproject/subscriptions/mysubscription"
}

// Helper function to make requests
const postEvent = (body: object) => {
    return request(app).post("/event").send(body);
};


describe('POST /event', () => {
    describe('given request body with invalid orderId', () => {
        test('should respond with 404 status code', async () => {
            const response = await postEvent(invalidOrderId);
            expect(response.statusCode).toBe(404);
        });
    });
    describe('given request body with no orderId', () => {
        test('should respond with 404 status code', async () => {
            const response = await postEvent(noOrderId);
            expect(response.statusCode).toBe(404);
        });
    });
});

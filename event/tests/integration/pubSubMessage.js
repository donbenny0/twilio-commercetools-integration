"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const app_1 = __importDefault(require("../../src/app"));
const supertest_1 = __importDefault(require("supertest"));
const validPubSubData = {
    "message": {
        "attributes": {
            "key": "value"
        },
        "data": "ewogICAgIm5vdGlmaWNhdGlvblR5cGUiOiAiTWVzc2FnZSIsCiAgICAicHJvamVjdEtleSI6ICJlbGVjdHJvbmljcy1lY29tIiwKICAgICJpZCI6ICJmNTFlMmMxMS0xYzU0LTRlZGUtYTI5My02ODY1YzIxMmNjOTAiLAogICAgInZlcnNpb24iOiAxLAogICAgInNlcXVlbmNlTnVtYmVyIjogNiwKICAgICJyZXNvdXJjZSI6IHsKICAgICAgICAidHlwZUlkIjogIm9yZGVyIiwKICAgICAgICAiaWQiOiAiMTJhMWM0MjYtZmRjOS00ODEzLWIwZWUtYmVhMTZlN2M1ZGU5IgogICAgfSwKICAgICJyZXNvdXJjZVZlcnNpb24iOiA2LAogICAgInJlc291cmNlVXNlclByb3ZpZGVkSWRlbnRpZmllcnMiOiB7CiAgICAgICAgIm9yZGVyTnVtYmVyIjogIjIwMjQtOC0yNC01MzMwNiIKICAgIH0sCiAgICAidHlwZSI6ICJPcmRlclN0YXRlQ2hhbmdlZCIsCiAgICAib3JkZXJJZCI6ICIwNzlmNDA1OC1mYTg3LTQ3ZmItYWJhNy02ZDQ2YmMwYjkxY2UiLAogICAgIm9yZGVyU3RhdGUiOiAiQ29uZmlybWVkIiwKICAgICJvbGRPcmRlclN0YXRlIjogIkNvbXBsZXRlIiwKICAgICJjcmVhdGVkQXQiOiAiMjAyNC0xMC0wM1QxMToyOToxOC40MDJaIiwKICAgICJsYXN0TW9kaWZpZWRBdCI6ICIyMDI0LTEwLTAzVDExOjI5OjE4LjQwMloiLAogICAgImNyZWF0ZWRCeSI6IHsKICAgICAgICAiaXNQbGF0Zm9ybUNsaWVudCI6IHRydWUsCiAgICAgICAgInVzZXIiOiB7CiAgICAgICAgICAgICJ0eXBlSWQiOiAidXNlciIsCiAgICAgICAgICAgICJpZCI6ICI0NTFmOThjNi00Nzk2LTQ0NGQtYjdlMy05YzFlZTQ3ZDVkNjgiCiAgICAgICAgfQogICAgfQp9",
        "publishTime": "2021-02-26T19:13:55.749Z",
        "publish_time": "2021-02-26T19:13:55.749Z"
    },
    "subscription": "projects/myproject/subscriptions/mysubscription"
};
const invalidPubSubData = {
    "message": {
        "attributes": {
            "key": "value"
        },
        "data": "hai", // Invalid data format
        "publishTime": "2021-02-26T19:13:55.749Z",
        "publish_time": "2021-02-26T19:13:55.749Z"
    },
    "subscription": "projects/myproject/subscriptions/mysubscription"
};
// Helper function to make requests
const postEvent = (body) => {
    return (0, supertest_1.default)(app_1.default).post("/event").send(body);
};
// Test Suite
(0, globals_1.describe)('POST /event', () => {
    // Valid PubSub Request Body Test
    (0, globals_1.describe)('with valid Pub/Sub request body', () => {
        (0, globals_1.test)('responds with 200 status code', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield postEvent(validPubSubData);
            (0, globals_1.expect)(response.statusCode).toBe(200);
        }));
    });
    // Invalid PubSub Request Body Test
    (0, globals_1.describe)('with invalid Pub/Sub request body', () => {
        (0, globals_1.test)('responds with 400 status code', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield postEvent(invalidPubSubData);
            (0, globals_1.expect)(response.statusCode).toBe(400);
        }));
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHViU3ViTWVzc2FnZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInB1YlN1Yk1lc3NhZ2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7QUFBQSwyQ0FBdUQ7QUFDdkQsd0RBQWdDO0FBQ2hDLDBEQUFnQztBQUVoQyxNQUFNLGVBQWUsR0FBRztJQUNwQixTQUFTLEVBQUU7UUFDUCxZQUFZLEVBQUU7WUFDVixLQUFLLEVBQUUsT0FBTztTQUNqQjtRQUNELE1BQU0sRUFBRSwwakNBQTBqQztRQUNsa0MsYUFBYSxFQUFFLDBCQUEwQjtRQUN6QyxjQUFjLEVBQUUsMEJBQTBCO0tBQzdDO0lBQ0QsY0FBYyxFQUFFLGlEQUFpRDtDQUNwRSxDQUFDO0FBRUYsTUFBTSxpQkFBaUIsR0FBRztJQUN0QixTQUFTLEVBQUU7UUFDUCxZQUFZLEVBQUU7WUFDVixLQUFLLEVBQUUsT0FBTztTQUNqQjtRQUNELE1BQU0sRUFBRSxLQUFLLEVBQUcsc0JBQXNCO1FBQ3RDLGFBQWEsRUFBRSwwQkFBMEI7UUFDekMsY0FBYyxFQUFFLDBCQUEwQjtLQUM3QztJQUNELGNBQWMsRUFBRSxpREFBaUQ7Q0FDcEUsQ0FBQztBQUVGLG1DQUFtQztBQUNuQyxNQUFNLFNBQVMsR0FBRyxDQUFDLElBQVksRUFBRSxFQUFFO0lBQy9CLE9BQU8sSUFBQSxtQkFBTyxFQUFDLGFBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDbEQsQ0FBQyxDQUFDO0FBRUYsYUFBYTtBQUNiLElBQUEsa0JBQVEsRUFBQyxhQUFhLEVBQUUsR0FBRyxFQUFFO0lBRXpCLGlDQUFpQztJQUNqQyxJQUFBLGtCQUFRLEVBQUMsaUNBQWlDLEVBQUUsR0FBRyxFQUFFO1FBQzdDLElBQUEsY0FBSSxFQUFDLCtCQUErQixFQUFFLEdBQVMsRUFBRTtZQUM3QyxNQUFNLFFBQVEsR0FBRyxNQUFNLFNBQVMsQ0FBQyxlQUFlLENBQUMsQ0FBQztZQUNsRCxJQUFBLGdCQUFNLEVBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUMxQyxDQUFDLENBQUEsQ0FBQyxDQUFDO0lBQ1AsQ0FBQyxDQUFDLENBQUM7SUFFSCxtQ0FBbUM7SUFDbkMsSUFBQSxrQkFBUSxFQUFDLG1DQUFtQyxFQUFFLEdBQUcsRUFBRTtRQUMvQyxJQUFBLGNBQUksRUFBQywrQkFBK0IsRUFBRSxHQUFTLEVBQUU7WUFDN0MsTUFBTSxRQUFRLEdBQUcsTUFBTSxTQUFTLENBQUMsaUJBQWlCLENBQUMsQ0FBQztZQUNwRCxJQUFBLGdCQUFNLEVBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUMxQyxDQUFDLENBQUEsQ0FBQyxDQUFDO0lBQ1AsQ0FBQyxDQUFDLENBQUM7QUFDUCxDQUFDLENBQUMsQ0FBQyJ9
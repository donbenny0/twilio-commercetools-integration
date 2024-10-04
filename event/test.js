"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var dotenv_1 = require("dotenv");
var logger_utils_1 = require("./src/utils/logger.utils");
dotenv_1.default.config();
logger_utils_1.logger.info("env", process.env.CTP_REGION);

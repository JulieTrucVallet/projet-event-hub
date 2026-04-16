import request from "supertest";
import { createApp } from "../../app";

export function getTestApp() {
  return request(createApp());
}
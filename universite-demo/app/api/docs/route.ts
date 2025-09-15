import { NextResponse } from "next/server";
import {createSwaggerSpec} from "next-swagger-doc";

export async function GET() {
  const spec = createSwaggerSpec({
    apiFolder: "app/api",
    definition: {
      openapi: "3.0.0",
      info: {
        title: "Université Demo API",
        version: "1.0.0",
      },
    },
  });

  return NextResponse.json(spec);
}
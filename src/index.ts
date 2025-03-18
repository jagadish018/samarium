import { Hono } from "hono";
import { PrismaClient } from "@prisma/client";
import { serve } from "@hono/node-server";

const prismaClient = new PrismaClient();

const app = new Hono();

app.get("/countries", async (c) => {
  try {
    const countries = await prismaClient.country.findMany();
    return c.json(countries, 200);
  } catch (error) {
    return c.json({ message: "Internal Server Error" });
    }
});

app.post("/countries", async (c) => {
  try {
    const { name, countryCode } = await c.req.json();
    const country = await prismaClient.country.create({
      data: { name: name, countryCode: countryCode },
    });
    return c.json(country, 201);
  }
  catch (e) {
    return c.json({ message: "Internal Server Error" });
  }
});

app.patch("/countries/:countrycode", async (c) => {
  try {
    const { countrycode } = c.req.param();
    const { name, countryCode } = await c.req.json();
    const country = await prismaClient.country.update({
      where: { countryCode: countrycode },
      data: { name: name, countryCode: countryCode },
    });
    return c.json(country, 201);
  }
  catch (e) {
  
    return c.json({ message: "Internal Server Error" });
  }
});

app.delete("/countries/:countrycode", async (c) => {
  try {
    const countryCode = c.req.param("countrycode");
    const countries = await prismaClient.country.delete({
      where: {
        countryCode: countryCode,
      },
    });
  } catch (error) {
    return c.json({ message: "Internal Server Error" });
    }
});

serve(app, (info) => {
  console.log(`Server is running on port ${info.port}`);
});

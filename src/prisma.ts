
import { Hono } from "hono";
import { PrismaClient } from "@prisma/client";
import { serve } from "@hono/node-server/.";

const prismaClient = new PrismaClient();

const app = new Hono();

app.get("/countries", async (c) => {
    const countries = await prismaClient.country.findMany();
    return c.json(countries,200);
 });

app.post("/countries", async (c) => {
    const { name, countryCode } = await c.req.json();
    const country = await prismaClient.country.create({ data: { name, countryCode } });
    return c.json(country,201);
    
});

app.patch("/countries", async (c) => {
    const { name, countryCode } = await c.req.json();
    const country = await prismaClient.country.update({ where: { countryCode: countryCode }, data: { name, countryCode } });
    return c.json(country,200);
    
});

app.delete("/countries/:countrycode", async (c) => {
    const countryCode  = await c.req.param("countrycode");
    const countries = await prismaClient.country.delete(
        {
            where: {
                countryCode: countryCode

            },
        }
    )
})


serve(app, (info) => {
    console.log(`Server is running on port ${info.port}`);
})


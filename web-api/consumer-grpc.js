#!/usr/bin/env node
const util = require("node:util");
const grpc = require("@grpc/grpc-js");
const { join } = require("node:path");
const loader = require("@grpc/proto-loader");
const pkg_def = loader.loadSync(join(__dirname, "..", "shared", "grpc-recipe.proto"));
const recipe = grpc.loadPackageDefinition(pkg_def).recipe;
const express = require("express");
const app = express();
const HOST = process.env.HOST || "localhost";
const PORT = process.env.PORT || 3000;
const TARGET = process.env.TARGET || "localhost:4000";

const client = new recipe.RecipeService(
    TARGET,
    grpc.credentials.createInsecure()
);

const getMetaData = util.promisify(client.getMetaData.bind(client));
const getRecipe = util.promisify(client.getRecipe.bind(client));

app.get("/", async (_, res) => {
    const [meta, recipe] = await Promise.all([getMetaData({}), getRecipe({ id: 42 })]);

    res.status(200).json({
        consumer_pid: process.pid,
        producer_data: meta,
        recipe,
    });
})

app.listen(PORT, () => {
    console.log(`Consumer (rpc) is running on http://${HOST}:${PORT}`);
})

#!/usr/bin/env node
const grpc = require("@grpc/grpc-js");
const loader = require("@grpc/proto-loader");
const { join } = require("node:path");
const pkg_def = loader.loadSync(join(__dirname, "..", 'shared', "grpc-recipe.proto"));
const recipe = grpc.loadPackageDefinition(pkg_def).recipe;
const HOST = process.env.HOST || "localhost";
const PORT = process.env.PORT || 4000;
const server = new grpc.Server();

try {

    server.addService(recipe.RecipeService.service, {
        getMetaData: (_call, cb) => {
            cb(null, {
                pid: process.pid
            });
        },
        getRecipe: ({ request }, cb) => {
            const id = request.id;
            if (id !== 42) return cb(new Error("unknow request id: " + request.id));

            const resObj = {
                producer_pid: process.pid,
                recipe: {
                    id,
                    name: "Chicken Tikka Masala",
                    steps: "Throw it in a pot...",
                    ingredients: [
                        {
                            id: 1,
                            name: "Chicken",
                            quantity: "1 lb"

                        },
                        {
                            id: 2,
                            name: "Sauce",
                            quantity: "2 cups",
                        }
                    ]
                }
            }
            return cb(null, resObj.recipe);
        }
    });


    server.bindAsync(`${HOST}:${PORT}`,
        grpc.ServerCredentials.createInsecure(),
        (err, port) => {
            if (err) throw err;
            server.start();
            console.log(`Producer (rpc) running at http://${HOST}:${port}/`)
        })
} catch (error) {
    console.error("Error: ", error.message);
}

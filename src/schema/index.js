"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
const Entities = fs.readFileSync(path.join(__dirname, './Entities.graphql')).toString();
const Query = fs.readFileSync(path.join(__dirname, './Query.graphql')).toString();
const Generics = fs.readFileSync(path.join(__dirname, './Generics.graphql')).toString();
const WhereInputs = fs.readFileSync(path.join(__dirname, './generated/WhereInputs.graphql')).toString();
exports.default = [Entities, Query, Generics, WhereInputs];

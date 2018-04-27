import * as  fs from 'fs';
import * as  path from 'path';

const Entities = fs.readFileSync(path.join(__dirname, './Entities.graphql')).toString();
const Query = fs.readFileSync(path.join(__dirname, './Query.graphql')).toString();
const Generics = fs.readFileSync(path.join(__dirname, './Generics.graphql')).toString();
const WhereInputs = fs.readFileSync(path.join(__dirname, './generated/WhereInputs.graphql')).toString();

export default [Entities, Query, Generics, WhereInputs];

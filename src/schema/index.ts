import * as  fs from 'fs';
import * as  path from 'path';

const Types = fs.readFileSync(path.join(__dirname, './Types.graphql')).toString();
const Query = fs.readFileSync(path.join(__dirname, './Query.graphql')).toString();
const Mutation = fs.readFileSync(path.join(__dirname, './Mutation.graphql')).toString();
const Inputs = fs.readFileSync(path.join(__dirname, './Inputs.graphql')).toString();
const Scalars = fs.readFileSync(path.join(__dirname, './Scalars.graphql')).toString();
const WhereInputs = fs.readFileSync(path.join(__dirname, './WhereInputs.graphql')).toString();

export default [Types, Query, Mutation, Inputs, Scalars, WhereInputs];

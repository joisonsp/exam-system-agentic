import { Given, When, Then } from '@cucumber/cucumber';
import chai from 'chai';
import axios from 'axios';

const expect = chai.expect;
let response: any;

Given('que o servidor está em execução', async function () {
  // Vincular para fase de teste; espera localhost:4000
  response = await axios.get('http://localhost:4000/health').catch(err => err.response);
});

When('eu acesso a API de saúde', async function () {
  if (!response) {
    response = await axios.get('http://localhost:4000/health').catch(err => err.response);
  }
});

Then('recebo status 200', function () {
  expect(response.status).to.equal(200);
});

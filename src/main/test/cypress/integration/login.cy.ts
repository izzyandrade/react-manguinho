import faker from '@faker-js/faker';

describe('Login', () => {
  beforeEach(() => {
    cy.visit('/login');
  });

  it('Should load with correct initial state', () => {
    cy.getByTestId('email-status')
      .should('have.attr', 'title', 'Campo Obrigatório')
      .should('contain.text', '🔴');
    cy.getByTestId('password-status')
      .should('have.attr', 'title', 'Campo Obrigatório')
      .should('contain.text', '🔴');
    cy.getByTestId('submit-button').should('have.attr', 'disabled');
    cy.getByTestId('error-wrap').should('not.have.descendants');
  });

  it('Should present error state if form is invalid', () => {
    cy.getByTestId('email').type(faker.random.word());
    cy.getByTestId('email-status').should(
      'have.attr',
      'title',
      'Campo inválido'
    );
    cy.getByTestId('password').type(faker.random.alphaNumeric(3));
    cy.getByTestId('password-status').should(
      'have.attr',
      'title',
      'Campo inválido'
    );
    cy.getByTestId('submit-button').should('have.attr', 'disabled');
    cy.getByTestId('error-wrap').should('not.have.descendants');
  });
});

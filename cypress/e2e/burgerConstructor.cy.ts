describe('конструктор работает корректно', function () {
  beforeEach(function () {
    cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' });
    cy.viewport(1000, 800);
    cy.visit('http://localhost:4000');
  });

  it('добавление булки', function () {
    cy.get('[data-cy=bun-ingredient]').contains('Добавить').click();
    cy.get('[data-cy=constructor-bun-1]').contains('Булка').should('exist');
    cy.get('[data-cy=constructor-bun-2]').contains('Булка').should('exist');
  });
});

describe('модальные окна работают корректно', function () {
  beforeEach(function () {
    cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' });
    cy.viewport(1000, 800);
    cy.visit('http://localhost:4000');
  });

  it('модальное окно открывается', function () {
    cy.contains('Детали ингредиента').should('not.exist');
    cy.contains('Булка').click();
    cy.contains('Детали ингредиента').should('exist');
    cy.get('#modals').contains('Булка').should('exist');
  });

  it('модальное окно закрывается по клику на оверлей', function () {
    cy.contains('Булка').click();
    cy.contains('Детали ингредиента').should('exist');
    cy.get('[data-cy=modal-overlay]').click('left', { force: true });
    cy.contains('Детали ингредиента').should('not.exist');
  });

  it('модальное окно закрывается по клику на крестик', function () {
    cy.contains('Булка').click();
    cy.contains('Детали ингредиента').should('exist');
    cy.get('[data-cy=modal-close-button]').click();
    cy.contains('Детали ингредиента').should('not.exist');
  });
});

describe('заказ происходит корректно', function () {
  beforeEach(function () {
    cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' });
    cy.intercept('GET', 'api/auth/user', { fixture: 'user.json' });
    cy.intercept('POST', 'api/orders', { fixture: 'order.json' });

    window.localStorage.setItem(
      'refreshToken',
      JSON.stringify('test-refreshToken')
    );
    cy.setCookie('accessToken', 'test-accessToken');
    cy.viewport(1000, 800);
    cy.visit('http://localhost:4000');
  });

  afterEach(function () {
    cy.clearLocalStorage();
    cy.clearCookies();
  });

  it('заказ отправляется корректно', function () {
    cy.get('[data-cy=bun-ingredient]').contains('Добавить').click();
    cy.get('[data-cy=mains-ingredient]').contains('Добавить').click();
    cy.get('[data-cy=sauces-ingredient]').contains('Добавить').click();
    cy.get('[data-cy=order-submit] button').click();
    cy.get('[data-cy=order-number]').contains('112358').should('exist');
    cy.get('[data-cy=modal-close-button]').click();
    cy.get('[data-cy=order-number]').should('not.exist');
    cy.get('[data-cy=burger-constructor]')
      .contains('Булка')
      .should('not.exist');
    cy.get('[data-cy=burger-constructor]').contains('Соус').should('not.exist');
    cy.get('[data-cy=burger-constructor]')
      .contains('Начинка')
      .should('not.exist');
  });
});

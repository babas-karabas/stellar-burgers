describe('тест страницы конструктора', function () {
  const details = 'Детали ингредиента';
  const bun = 'Булка';
  const add = 'Добавить';

  beforeEach(function () {
    cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' });
    cy.viewport(1000, 800);
    cy.visit('/');
  });
  describe('конструктор работает корректно', function () {
    it('добавление булки', function () {
      cy.get('[data-cy=bun-ingredient]').contains(add).click();
      cy.get('[data-cy=constructor-bun-1]').contains(bun).should('exist');
      cy.get('[data-cy=constructor-bun-2]').contains(bun).should('exist');
    });

    it('добавление другого ингредиента', function () {
      cy.get('[data-cy=mains-ingredient]').contains(add).click();
      cy.get('[data-cy=constructor-mains]').contains('Начинка').should('exist');
    });
  });

  describe('модальные окна работают корректно', function () {
    beforeEach(function () {
      cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' });
      cy.viewport(1000, 800);
      cy.visit('/');
    });

    it('модальное окно c описанием ингредиента открывается', function () {
      cy.contains(details).should('not.exist');
      cy.contains(bun).click();
      cy.contains(details).should('exist');
      cy.get('#modals').contains(bun).should('exist');
    });

    it('модальное окно c описанием ингредиента закрывается по клику на оверлей', function () {
      cy.contains(bun).click();
      cy.contains(details).should('exist');
      cy.get('[data-cy=modal-overlay]').click('left', { force: true });
      cy.contains(details).should('not.exist');
    });

    it('модальное окно c описанием ингредиента закрывается по клику на крестик', function () {
      cy.contains(bun).click();
      cy.contains(details).should('exist');
      cy.get('[data-cy=modal-close-button]').click();
      cy.contains(details).should('not.exist');
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
      cy.visit('/');
    });

    afterEach(function () {
      cy.clearLocalStorage();
      cy.clearCookies();
    });

    it('заказ отправляется корректно', function () {
      cy.get('[data-cy=bun-ingredient]').contains(add).click();
      cy.get('[data-cy=mains-ingredient]').contains(add).click();
      cy.get('[data-cy=sauces-ingredient]').contains(add).click();
      cy.get('[data-cy=order-submit] button').click();
      cy.get('[data-cy=order-number]').contains('112358').should('exist');
      cy.get('[data-cy=modal-close-button]').click();
      cy.get('[data-cy=order-number]').should('not.exist');
      cy.get('[data-cy=burger-constructor]').contains(bun).should('not.exist');
      cy.get('[data-cy=burger-constructor]')
        .contains('Соус')
        .should('not.exist');
      cy.get('[data-cy=burger-constructor]')
        .contains('Начинка')
        .should('not.exist');
    });
  });
});

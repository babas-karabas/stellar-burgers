describe('тест страницы конструктора', function () {
  beforeEach(function () {
    cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' });
    cy.viewport(1000, 800);
    cy.visit('/');
    cy.get('[data-cy=bun-ingredient]').contains('Добавить').as('add-btn');
    cy.get('div').contains('Детали ингредиента').as('modal');
  });
  describe('конструктор работает корректно', function () {
    it('добавление булки', function () {
      cy.get('@add-btn').click();
      cy.get('[data-cy=constructor-bun-1]').contains('Булка').should('exist');
      cy.get('[data-cy=constructor-bun-2]').contains('Булка').should('exist');
    });
  });

  describe('модальные окна работают корректно', function () {
    it('модальное окно открывается', function () {
      cy.get('@modal').should('not.exist');
      cy.contains('Булка').click();
      cy.get('@modal').should('exist');
      cy.get('#modals').contains('Булка').should('exist');
    });

    it('модальное окно закрывается по клику на оверлей', function () {
      cy.contains('Булка').click();
      cy.get('@modal').should('exist');
      cy.get('[data-cy=modal-overlay]').click('left', { force: true });
      cy.get('@modal').should('not.exist');
    });

    it('модальное окно закрывается по клику на крестик', function () {
      cy.contains('Булка').click();
      cy.get('@modal').should('exist');
      cy.get('[data-cy=modal-close-button]').click();
      cy.get('@modal').should('not.exist');
    });
  });

  describe('заказ происходит корректно', function () {
    beforeEach(function () {
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
      cy.get('@add-btn').click();
      cy.get('[data-cy=mains-ingredient]').contains('Добавить').click();
      cy.get('[data-cy=sauces-ingredient]').contains('Добавить').click();
      cy.get('[data-cy=order-submit] button').click();
      cy.get('[data-cy=order-number]').contains('112358').should('exist');
      cy.get('[data-cy=modal-close-button]').click();
      cy.get('[data-cy=order-number]').should('not.exist');
      cy.get('[data-cy=burger-constructor]')
        .contains('Булка')
        .should('not.exist');
      cy.get('[data-cy=burger-constructor]')
        .contains('Соус')
        .should('not.exist');
      cy.get('[data-cy=burger-constructor]')
        .contains('Начинка')
        .should('not.exist');
    });
  });
});

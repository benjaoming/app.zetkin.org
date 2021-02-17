import { mount } from '@cypress/react';
import { Provider, defaultTheme } from '@adobe/react-spectrum';

import RegForm from './RegForm';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mountWithTheme = (elem) : any => mount(
    <Provider theme={ defaultTheme }>
        { elem }
    </Provider>
);

describe('RegForm', () => {

    it('contains a form and input is submitted onClick', () => {
        const spyOnSubmit = cy.spy();

        const dummyInput = {
            email: 'mail@kristofferlarberg.se',
            first_name: 'Kristoffer',
            last_name: 'Larberg',
            password: 'abc123',
            phone: '0736767638',
        };

        mountWithTheme(<RegForm onValidSubmit={ spyOnSubmit } />);

        cy.get('[data-test="first-name"]').type(dummyInput.first_name);
        cy.get('[data-test="last-name"]').type(dummyInput.last_name);
        cy.get('[data-test="email-address"]').type(dummyInput.email);
        cy.get('[data-test="phone-number"]').type(dummyInput.phone);
        cy.get('[data-test="password"]').type(dummyInput.password);
        cy.get('[data-test="submit-button"]').click().then(() => {
            expect(spyOnSubmit).to.be.calledOnce;
            expect(spyOnSubmit).to.be.calledWith(dummyInput);
        });
    });
});
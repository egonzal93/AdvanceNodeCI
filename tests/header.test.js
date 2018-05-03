/**
 * Created by Jason Gonzales on 4/12/18.
 */

// const puppeteer = require('puppeteer');
// const sessionFactory = require('./factories/sessionFactory');
// const userFactory = require('./factories/userFactory');
const Page = require('./helpers/page');

// let browser;
let page;

beforeEach( async () => {
    // browser = await puppeteer.launch({
    //     headless: false
    // });

    // page = await browser.newPage();

    // page is now a proxy
    page = await Page.build();

    await page.goto('http://localhost:3000');

});

// test('Adds two numbers', () => {
//     const sum = 1+2;
//
//     expect(sum).toEqual(3);
// });

test('The header has the correct text', async () => {

    // const browser = await puppeteer.launch({
    //     headless: false
    // });
    // const page = await browser.newPage();
    // await page.goto('localhost:3000');

    // const text = await page.$eval('a.brand-logo', el => el.innerHTML);

    const text = await page.getContentsOf('a.brand-logo');

    expect (text).toEqual('Blogster');

});


test('Clicking login starts oauth flow', async () => {

    await page.click('.right a');

    const url = await page.url();

    expect(url).toMatch(/accounts\.google\.com/);

});

test('When signed in, shows logout button', async() => {

    // const id = '5abef87f91e6c10c7bc96667';

    // const Buffer = require('safe-buffer').Buffer;
    //
    // const sessionObject = {
    //   passport: {
    //       user: id
    //   }
    // };
    //
    // const sessionString = Buffer.from(JSON.stringify(sessionObject)).toString('base64');
    //
    // const Keygrip = require('keygrip');
    // const keys = require('../config/keys');
    //
    // const keygrip = new Keygrip([keys.cookieKey]);
    //
    // const sig = keygrip.sign('session=' + sessionString);

    //console.log(sessionString, sig);

    // const user = await userFactory();
    // const { session, sig } = sessionFactory(user);
    //
    // //page instances
    // await page.setCookie({ name: 'session', value: session });
    // await page.setCookie({ name: 'session.sig', value : sig});
    // // Make sure to refresh the page for the cookie settings to take effect.
    // await page.goto('localhost:3000');
    // // test might fail, if the app is broken
    // await page.waitFor('a[href="/auth/logout"]');

    await page.login();

    const text = await page.getContentsOf('a[href="/auth/logout"]');

    expect(text).toEqual('Logout');


});

afterEach( async () => {

    // await browser.close();

    await page.close();

});
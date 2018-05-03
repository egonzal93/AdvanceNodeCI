/**
 * Created by Jason Gonzales on 4/24/18.
 */


const puppeteer = require('puppeteer');
const sessionFactory = require('../factories/sessionFactory');
const userFactory = require('../factories/userFactory');

// --no-sandbox will decrease amount of time the test to run

class CustomPage {

    static async build() {
        const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox']
        });

        const page = await browser.newPage();

        const customPage = new CustomPage(page, browser);

        return new Proxy(customPage, {
           get: function(target, property) {
               // order is important, since both browser and page both has a close function
               return customPage[property] || browser[property] || page [property]
           }
        });
    }

    constructor(page, browser) {
        this._page = page;
        this._browser = browser
    }

    async login() {
        const user = await userFactory();
        const { session, sig } = sessionFactory(user);

        //page instances inject cookie into browser
        await this._page.setCookie({ name: 'session', value: session });
        await this._page.setCookie({ name: 'session.sig', value : sig});
        // Make sure to refresh the page for the cookie settings to take effect.
        //await this._page.goto('localhost:3000');
        await this._page.goto('http://localhost:3000/blogs');
        // test might fail, if the app is broken
        await this._page.waitFor('a[href="/auth/logout"]');
    }

    async getContentsOf(selector) {
        return this._page.$eval(selector, el => el.innerHTML);
    }

    // close(){
        // this._browser.close();
    // }


    get(path){

        // Referencing the path variable is fine, page.evaluate however converts the params
        // into a string, so passing path into the first argument of the page.evaluate will not work.
        // path is an argument that gets passed to the first argument which of function type.
        return this._page.evaluate(
            (_path) => {
                return fetch(_path, {
                    method: 'GET',
                    credentials: 'same-origin',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).then( res => res.json());
            },
             path
            );


    }

    post(path, data){

        return this._page.evaluate(
            (_path, _data) => {
                return fetch(_path, {
                    method: 'POST',
                    credentials: 'same-origin',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(_data)
                }).then( res => res.json());
            },
            path,
            data
        );

    }

    execRequests(actions){
        // Wait for all all promises to finish before returning control back
        return Promise.all(
            actions.map(({ method, path, data}) => {
              // Curry the function
              return this[method](path, data);
            })
        );
    }
}


module.exports = CustomPage;

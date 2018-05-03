/**
 * Created by Jason Gonzales on 4/24/18.
 */

const Page = require('./helpers/page');


let page;


beforeEach( async () => {

    page = await Page.build();
    await page.goto('http://localhost:3000');

});

afterEach( async () => {
    await page.close();
});


// test('When logged in, can see blog create form', async () => {
//
//    await page.login();
//    await page.click('a.btn-floating');
//
//    const label = await page.getContentsOf('form label');
//
//    expect(label).toEqual('Blog Title');
//
// });

describe('When logged in ', async() => {

    beforeEach( async () => {

        await page.login();
        await page.click('a.btn-floating');
    });


    test('can see blog create form', async () => {

        const label = await page.getContentsOf('form label');

        expect(label).toEqual('Blog Title');

    });

    describe('And using valid inputs', async () => {

        beforeEach( async () => {

            await page.type('.title input', 'My title');
            await page.type('.content input', 'My content');
            await page.click('form button');

        });

        test('Submitting takes user to review screen', async () => {

            const text = await page.getContentsOf('h5');

            expect(text).toEqual('Please confirm your entries');

        });

        test('Submitting then saving adds blog to index page', async () => {

            // Anytime an ajax request is done, a wait is needed, puppeteer will timeout.
            await page.click('button.green');
            await page.waitFor('.card');

            const title = await page.getContentsOf('.card-title');
            const content = await page.getContentsOf('p');

            expect(title).toEqual('My title');
            expect(content).toEqual('My content');

        });


    });

    describe('And using invalid inputs', async () => {

        beforeEach( async () => {
             await page.click('form button');
        });

        test('the form shows an error message', async () => {

            const titleError = await page.getContentsOf('.title .red-text');
            const contentError = await page.getContentsOf('.content .red-text');

            expect(titleError).toEqual('You must provide a value');
            expect(contentError).toEqual('You must provide a value');


        });

    });


});


describe('User is not logged in', async () => {

    const actions = [
        {
            method: 'get',
            path: '/api/blogs'
        },
        {
            method: 'post',
            path: '/api/blogs',
            data: {
                title: 'My title',
                content: 'My Content'
            }
        }
    ];

    test('Blog related actions are prohibited', async() => {
        const results = await page.execRequests(actions);
        // Expect the return value as an array
        for ( let result of results ) {
            expect(result).toEqual({ error: 'You must log in!'});
        }
    });

    // test('User cannot create blog posts', async () => {
    //
    //     // The function gets converted into a string and then back into a function
    //     const result = await page.post('/api/blogs', {title: 'My title', content: 'My Content'});
    //
    //     // console.log(result);
    //
    //     expect(result).toEqual({ error: 'You must log in!'});
    //
    // });
    //
    // test('User cannot get a list of posts', async () => {
    //
    //     const result = await page.get('/api/blogs');
    //
    //     expect(result).toEqual({ error: 'You must log in!'});
    //
    // });

});
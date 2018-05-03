/**
 * Created by Jason Gonzales on 4/26/18.
 */

() => {
    fetch('/api/blogs', {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({title: 'My title', content: 'My Content'})
    });
}

() => {
    fetch('/api/blogs', {
        method: 'GET',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json'
        }
    });
}

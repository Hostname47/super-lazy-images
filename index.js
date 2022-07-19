/**
 * This function take the page and items per page as parameters, and run a request
 * to pexels API to fetch images
 */
function fetchImages(page=1, perpage=15) {
    return fetch(`https://api.pexels.com/v1/search?query=space&page=${page}&per_page=${perpage}`, {
        method: 'get',
        headers: new Headers({
            'Authorization': '563492ad6f917000010000015f23a59eb1b1425e88387a9ba1fcb3de',
        }),
    }).then((response => {
        return response.json();
    }));
}

/**
 * Here we use Intersection Observer API to check if the user reach fetch more section,
 * or in case of the first fetch is visible in the viewport; If so, hen we fetch images
 * using fetchImages function
 */

let page = 1;
let perpage = 15;
let fetchLock = true;

let options = { // root is document window by default
    threshold: 0
}

let fetchObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(function(each, index){
        if(each.isIntersecting) {
            if(!fetchLock) return;
            fetchLock = false;

            fetch('data.json')
                .then(response => {
                    return response.json();
                })
                .then(data => {
                    let imagesBox = document.querySelector('#images-box');

                    data.photos.forEach((photo => {
                        // clone the image component
                        let component = document.querySelector('.image-component-skeleton').cloneNode(true);
                        // Set image dimensions
                        if(photo.width >= photo.height) {
                            component.querySelector('.image').style.width = 'auto';
                            component.querySelector('.image').style.height = '100%';
                        } else {
                            component.querySelector('.image').style.width = '100%';
                            component.querySelector('.image').style.height = 'auto';
                        }
                        component.querySelector('.image').dataset.src = photo.src.landscape;
                        component.querySelector('.title a').textContent = photo.alt;
                        component.querySelector('.title a').href = photo.url;
                        component.querySelector('.photographer-name').textContent = photo.photographer;
                        component.querySelector('.photographer-name').href = photo.photographer_url;
                        component.querySelector('.width').textContent = photo.width;
                        component.querySelector('.height').textContent = photo.height;
                        
                        component.classList.remove('image-component-skeleton', 'none');

                        imagesBox.append(component);
                    }));

                    // If there's no remaining images we have to delete fetch box
                    if(data.total_results <= document.querySelectorAll('#images-box .image-component').length) {
                        document.querySelector('#fetch-box').remove();
                    }
                }).finally(() => {
                    
                });

            // fetchImages(page, perpage)
            //     .then(data => {
            //         console.log(data);
            //         page++;
            //     })
            //     .finally(() => {
            //         fetchLock = true;
            //     });
        }
    });
}, options);

let fetchTarget = document.querySelector('#fetch-box');
fetchObserver.observe(fetchTarget);

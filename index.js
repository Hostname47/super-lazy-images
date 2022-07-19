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
    threshold: 0,
}

let fetchObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(function(each, index){
        if(each.isIntersecting) {
            if(!fetchLock) return;
            fetchLock = false;

            /**
             * I used setTimeOut here just to show the animation of fetch box, because if the internet connection
             * is fast, you'll get the response very quickly and you cannot see the animation properly
             * You can remove the setTimeOut and call fetchImages directly.
             */
            setTimeout(() => {
                fetchImages(page, perpage)
                    .then(data => {
                        let imagesBox = document.querySelector('#images-box');
                        let images = [];
                        data.photos.forEach((photo => {
                            // clone the image component
                            let component = document.querySelector('.image-component-skeleton').cloneNode(true);
                            // Set image dimensions
                            if(photo.width >= photo.height) {
                                component.querySelector('.image').style.width = '100%';
                                component.querySelector('.image').style.height = 'auto';
                            } else {
                                component.querySelector('.image').style.width = 'auto';
                                component.querySelector('.image').style.height = '100%';
                            }
                            component.querySelector('.image-container').style.backgroundColor = photo.avg_color;
                            component.querySelector('.image').dataset.src = photo.src.landscape;
                            component.querySelector('.title a').textContent = photo.alt;
                            component.querySelector('.title a').href = photo.url;
                            component.querySelector('.photographer-name').textContent = photo.photographer;
                            component.querySelector('.photographer-name').href = photo.photographer_url;
                            component.querySelector('.width').textContent = photo.width;
                            component.querySelector('.height').textContent = photo.height;
                            
                            component.classList.remove('image-component-skeleton', 'none');
    
                            imagesBox.append(component);
                            images.push(component);
                        }));
    
                        /**
                         * After getting images and putting them to images box, we start observing
                         * only the appended ones to handle their lazy loading management
                         * Here Instead of observing the image, we observe the whole component; If the component
                         * intersect with the root (the whole viewport), we handle the lazy image
                         */
                        images.forEach(image => {
                            lazyImageObserver.observe(image);
                        });
    
                        // After appending and observing the images, we increment the page to be ready for the next fetch
                        page++;
    
                        // If there's no remaining images we have to delete fetch box
                        if(data.total_results <= document.querySelectorAll('#images-box .image-component').length) {
                            document.querySelector('#fetch-box').remove();
                        }
                    }).finally(() => {
                        fetchLock = true;
                    });
            }, 1000);

        }
    });
}, options);

let fetchTarget = document.querySelector('#fetch-box');
fetchObserver.observe(fetchTarget);

/**
 * Implementing lazy loading images.
 * Here also we use Intersection Observer API to determine whether the image component is in 
 * the viewport and load the image from data-src to src
 * Notice that we use the same observer options we used in the previous observer because we 
 * are working in the same root (window viewport) and the same threshold (0)
 * 
 * Before using the observer to observe the image components, we need to get the images first,
 * then we start observing them.
 */
let lazyImageObserver = new IntersectionObserver((entries) => {
    entries.forEach(function(image){
        if(image.isIntersecting) {
            let lazyImage = image.target.querySelector('.image');
            console.log(lazyImage);
            lazyImage.src = lazyImage.dataset.src;
            // lazyImage.classList.remove("lazy-image"); // This is not neccessary right now
            lazyImageObserver.unobserve(lazyImage);
        }
    });
});
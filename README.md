# Lazy loading images with fade effect

This is a simple implementation of lazy loading images to increase performence. I used **Pexels API** to fetch images. While the browser is waiting for the API to return the images, we created a beautiful animation to show the user that the data is currently loading to achieve a better user experience.

After fetching the data, the **Intersection Observer API** will check all the images components that are currently displayed in the viewport and display them in the component. The images that are not in the viewport will hold the location of image in data-src attribute until the user scroll to them.

### Contributing
If you find any bug or something that can make this snippet better, don't hesitate to suggeste your changes and I'll be very happy to review and merge your code.

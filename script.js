'use strict';

///////////////////////////////////////
// Modal window
// Variables
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const nav = document.querySelector('.nav');
const tabs = document.querySelectorAll('.operations__tab');
const tabContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');
const header = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height;
const allSections = document.querySelectorAll('.section');
const imgTargets = document.querySelectorAll('img[data-src]');

///////////////////////////////////////////////////////////////
// FUNCTIONS
const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal))

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

///////////////////////////////////////////////////////////////
// EVENTS: SMOOTH SCROLLING

btnScrollTo.addEventListener('click', function (e) {
  // OPTION 1 MORE OLD SCHOOL
  const s1coords = section1.getBoundingClientRect();
  console.log(s1coords);

  console.log(e.target.getBoundingClientRect());

  console.log('Current scroll (X/Y)', window.pageXOffset, window.pageYOffset);

  console.log('heigh/width off viewport', document.documentElement.clientHeight, document.documentElement.clientWidth);

  // scrolling
  // window.scrollTo(s1coords.left + window.pageXOffset, s1coords.top + window.pageYOffset);

  window.scrollTo({
    left: s1coords.left + window.pageXOffset,
    top: s1coords.top + window.pageYOffset,
    behavior: 'smooth'
  })

  // OPTION 2 MORE MODERN WAY
  section1.scrollIntoView({ behavior: 'smooth' })
})

///////////////////////////////////////////////////////////////
// EVENTS PAGE DELEGATION

/* document.querySelectorAll('.nav__link').forEach(function (el) {
    el.addEventListener('click', function (e) {
        e.preventDefault();
        const id = this.getAttribute('href');
        document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
    })
}) */

document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();
  if (!e.target.closest('.nav__link')) return;
  const id = e.target.getAttribute('href');
  document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
});

///////////////////////////////////////////////////////////////
// EVENTS: MENU FADE ANIMATION
const handleHover = function (e) {
  if (e.target.classList.contains('nav__link') || e.target.classList.contains('nav__logo')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(el => {
      if (el !== link) el.style.opacity = this;
    })

    if (e.target !== logo) logo.style.opacity = this;
  }
}

/* nav.addEventListener('mouseover', function (e) {
  handleHover(e, 0.5);
})

nav.addEventListener('mouseout', function (e) {
  handleHover(e, 1);
}) */

// Passing an argument into handler
nav.addEventListener('mouseover', handleHover.bind(0.5));
nav.addEventListener('mouseout', handleHover.bind(1));

///////////////////////////////////////////////////////////////
// EVENTS: STICKY NAVIGATION

//// SOLUTION 1) Scroll event but poor performance
/* const initialCoords = section1.getBoundingClientRect();
console.log(initialCoords);
window.addEventListener('scroll', function (e) {
  console.log(window.scrollY);
  console.log(window.pageYOffset);

  if (this.window.scrollY > initialCoords.top) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
}) */

//// SOLUTION 2: the intersection observer API
/* 
// Callback to pass in the new observer
const obsCallback = function (entries, observer) {
  entries.forEach(entry => console.log(entry));
}

// Options to pass in the new Intersection observer
const obsOptions = {
  root: null, // element we want or target we want to intersect. if null, target element intersecting viewport
  // threshold: [0.1], // the percentage at which the observer callback will be called
  // whenever my element is intersecting the viewport (because null) at 10% (because 0.1)
  threshold: [0, 0.2]
}

// create a new observer
const observer = new IntersectionObserver(obsCallback, obsOptions);

// using the observer to observe a certain target
observer.observe(section1); */

const stickyNav = function (entries) {
  const [entry] = entries; // entries[0]
  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
}

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`
});
headerObserver.observe(header);

///////////////////////////////////////////////////////////////
// EVENTS: REVEAL ON SCROLL
const revealSection = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  entry.target.classList.remove('section--hidden');

  observer.unobserve(entry.target);
}
const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.4,
})
allSections.forEach(section => {
  sectionObserver.observe(section);
  //section.classList.add('section--hidden');
});

///////////////////////////////////////////////////////////////
// EVENTS: LAZY LOADING IMAGES

const loadImg = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  // replace src with data-src
  entry.target.src = entry.target.dataset.src;

  // entry.target.classList.remove('lazy-img'); NOT IMMEDIATELY IN CASE LOADING IS SLOW

  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img')
  })

  observer.unobserve(entry.target);
}
const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: '200px'
})
imgTargets.forEach(img => imgObserver.observe(img));

///////////////////////////////////////////////////////////////
// EVENTS: TABBED COMPONENT

tabContainer.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab');
  // guard clause
  if (!clicked) return;

  // Activate Tab
  tabs.forEach(tab => tab.classList.remove('operations__tab--active'));
  clicked.classList.add('operations__tab--active');

  // Activate Content
  tabsContent.forEach(content => content.classList.remove('operations__content--active'));
  document.querySelector(`.operations__content--${clicked.dataset.tab}`).classList.add('operations__content--active');
})

///////////////////////////////////////////////////////////////
// EVENTS: SLIDER COMPONENT

const slider = function () {

  const slides = document.querySelectorAll('.slide');
  const slider = document.querySelector('.slider');
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');
  const dotContainer = document.querySelector('.dots');

  let currentSlide = 0;
  const maxSlide = slides.length;


  // FUNCTIONS
  // CREATE DOTS
  const createDots = function () {
    slides.forEach((_, i) => {
      dotContainer.insertAdjacentHTML('beforeend', `
      <button class="dots__dot" data-slide="${i}"></button>
    `)
    })
  }

  // Activate Dots
  const activateDot = function (slide) {
    document.querySelectorAll('.dots__dot').forEach(dot => dot.classList.remove('dots__dot--active'));

    document.querySelector(`.dots__dot[data-slide="${slide}"]`).classList.add('dots__dot--active');
  }

  // GO TO SLIDE
  const goToSlide = function (slide) {
    slides.forEach((s, i) => {
      s.style.transform = `translateX(${100 * (i - slide)}%)`;
    })
  }

  // INIT FUNCTION
  const init = function () {
    goToSlide(0);
    createDots();
    activateDot(0);
  }

  // update slide function
  const updateSlide = function () {
    goToSlide(currentSlide);
    activateDot(currentSlide);
  }

  // NEXT SLIDE
  const nextSlide = function () {
    if (currentSlide === maxSlide - 1) {
      currentSlide = 0;
    } else {
      currentSlide++;
    }
    updateSlide();
  }

  // PREVIOUS SLIDE
  const previousSlide = function () {
    if (currentSlide === 0) {
      currentSlide = maxSlide - 1;
    } else {
      currentSlide--;
    }
    updateSlide();
  }

  // INITIALISE
  init();

  // EVENT HANDLERS
  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', previousSlide);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') previousSlide();
    if (e.key === 'ArrowRight') nextSlide();
  })

  dotContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      //const slide = e.target.dataset.slide;
      const { slide } = e.target.dataset; // destructuring
      currentSlide = Number(slide);
      updateSlide();
    }
  })
};

slider();

/*
///////////////////////////////////////////////////////////////
// LECTURE SELECT CREATE DELETE

// Selecting elements
console.log(document.documentElement);
console.log(document.head);
console.log(document.body);

const header = document.querySelector('header');
const allSections = document.querySelectorAll('.section'); // Node list
console.log(allSections);

document.getElementById('section--1');
const allButtons = document.getElementsByTagName('button'); // HTML collection = live collection
console.log(allButtons);

console.log(document.getElementsByClassName('btn'));

// Creating and inserting elements

// 1) insertAdjacentHTML

// 2)
const message = document.createElement('div');
message.classList.add('cookie-message');
// message.textContent = 'We use cookies for improved functionality and analytics.'
message.innerHTML = 'We use cookies for improved functionality and analytics. <button class="btn btn--close-cookie">Got it!</button>'
// header.prepend(message); // add as first child
header.append(message); // add as last child
// we can use append prepend to move existing elements
// header.before(message);
// header.after(message);

// Delete elements
document.querySelector('.btn--close-cookie').addEventListener('click', function () {
  message.remove();
})

///////////////////////////////////////////////////////////////
// LECTURE STYLE ATTRIBUTES CLASSES
// set as inline styles
message.style.backgroundColor = '#37383D';
message.style.width = '120%';

console.log(message.style.height); // reading only works for inline styles set manually

console.log(message.style.width);

console.log(getComputedStyle(message).color);
console.log(getComputedStyle(message).height);

message.style.height = Number.parseFloat(getComputedStyle(message).height, 10) + 30 + 'px';

// CSS custom properties CSS variables
document.documentElement.style.setProperty('--color-primary', 'orangered');

// Attributes
const logo = document.querySelector('.nav__logo');
console.log(logo.alt);
console.log(logo.src); // absolute path
console.log(logo.getAttribute('src')); // relative path
logo.setAttribute('hello', 'yes');
const link = document.querySelector('.nav__link--btn');
console.log(link.href)
console.log(link.getAttribute('href'));

// Data attributes
console.log(logo.dataset.versionNumber);

// Classes
logo.classList.add('c');
logo.classList.remove('c');
logo.classList.toggle('c');
logo.classList.contains('c');

// logo.className = "jonas" // OVERIDES ALL EXISTING CLASSES AND ALLOWS ONLY ONE CLASS

///////////////////////////////////////////////////////////////
// LECTURE SMOOTH SCROLLING

const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');

btnScrollTo.addEventListener('click', function (e) {
    // OPTION 1 MORE OLD SCHOOL
    const s1coords = section1.getBoundingClientRect();
    console.log(s1coords);

    console.log(e.target.getBoundingClientRect());

    console.log('Current scroll (X/Y)', window.pageXOffset, window.pageYOffset);

    console.log('heigh/width off viewport', document.documentElement.clientHeight, document.documentElement.clientWidth);

    // scrolling
    // window.scrollTo(s1coords.left + window.pageXOffset, s1coords.top + window.pageYOffset);

    window.scrollTo({
        left: s1coords.left + window.pageXOffset,
        top: s1coords.top + window.pageYOffset,
        behavior: 'smooth'
    })

    // OPTION 2 MORE MODERN WAY
    section1.scrollIntoView({ behavior: 'smooth' })
}) 

///////////////////////////////////////////////////////////////
// LECTURE EVENTS

const h1 = document.querySelector('h1');
const alerth1 = function () {
  console.log('addeventlistener');
  //h1.style.color = 'red';
}
h1.addEventListener('mouseenter', alerth1);

setTimeout(() => h1.removeEventListener('mouseenter', alerth1), 10000)

h1.onmouseenter = function () {
  console.log('old school');
}

// with new method, we can attach several event listeners and we can remove them

///////////////////////////////////////////////////////////////
// LECTURE BUBBLING


CAPTURING PHASE
There is a click
The dom generates a click event
The click event is not generated on the target element, it is generated at the root of the document, then it traverses down the tree

TARGET PHASE
The event reaches the target, action happens if addEventListener

BUBBLING PHASE
The event travels all the way up through all the parent elements
When it passes through an element in the bubbling phase, it happens as well in the elements it passes through



const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);
const randomColor = () => `rgb(${randomInt(0, 255)}, ${randomInt(0, 255)}, ${randomInt(0, 255)})`;

console.log(randomColor());

document.querySelector('.nav__link').addEventListener('click', function (e) {
    e.preventDefault();
    this.style.backgroundColor = randomColor();
    console.log('LINK', e.target, e.currentTarget);

    // stop propagation
    // e.stopPropagation();
});

document.querySelector('.nav__links').addEventListener('click', function (e) {
    this.style.backgroundColor = randomColor();
    console.log('CONTAINER', e.target, e.currentTarget);
});

document.querySelector('.nav').addEventListener('click', function (e) {
    this.style.backgroundColor = randomColor();
    console.log('NAV', e.target, e.currentTarget);
}, true);

///////////////////////////////////////////////////////////////
// LECTURE DOM TRAVERSING

// downwards
console.log(h1.querySelectorAll('.highlight')); // no matter how deep in the tree
console.log(h1.childNodes); // every single nodes existing
console.log(h1.children); // html collection
console.log(h1.firstElementChild);
console.log(h1.lastElementChild);

// going upwards
console.log(h1.parentNode);
console.log(h1.parentElement);

console.log(h1.closest('.header'));

h1.closest('.header').style.background = 'var(--gradient-secondary)';

// closest can be the element itself
h1.closest('h1').style.background = 'var(--gradient-primary)';

// Going sideways : siblings
console.log(h1.previousElementSibling);
console.log(h1.nextElementSibling);

console.log(h1.previousSibling);
console.log(h1.nextSibling);

// All the siblings
console.log(h1.parentElement.children);

[...h1.parentElement.children].forEach(function (el) {
  if (el !== h1) el.style.transform = 'scale(0.5)';
})

*/

///////////////////////////////////////////////////////////////
// LECTURE LIFECYCLE OF THE DOM
/* 
Events that occur in the dom during a page lifecycle, right from the moment the page is first accessed until the user leaves it

*/
// DOM CONTENT LOADED: fired by the document as soon as the HTML is completely parsed (downloaded and converted to the dom tree)
// HTML AND JS ONLY TO BE LOADED
document.addEventListener('DOMContentLoaded', function (e) {
  console.log('html parsed and dom tree built');
  console.log(e);
})

// not necessary to wrap all our code in it since script is last thing loaded

// LOAD EVENT
// when the complete page has finished loading
window.addEventListener('load', function (e) {
  console.log('Page fully loaded', e);
})

// BEFORE UNLOAD immediately before the user is leaving 
/* window.addEventListener('beforeunload', function (e) {
  e.preventDefault();
  console.log(e);
  e.returnValue = '';
}) */

///////////////////////////////////////////////////////////////
// LECTURE EFFICIENT SCRIPT LOADING: DEFER AND ASYNC
